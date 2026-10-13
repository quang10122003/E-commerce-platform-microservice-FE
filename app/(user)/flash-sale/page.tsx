import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import type { Metadata } from "next";
import { UserFlashSaleView } from "@/components/user/flash-sale/user-flash-sale-view";
import { HTTP_STATUS } from "@/lib/constants";
import { getCategories } from "@/lib/service/categoryService";
import { getUserFlashSaleItems, UserFlashSaleApiError } from "@/lib/service/userFlashSaleService";
import { parseSaleCategoryId } from "@/lib/utils/user-flash-sale.utils";

export const metadata: Metadata = {
  title: "Flash Sale | ModernShop",
  description: "Khám phá sản phẩm và phân loại đang được giảm giá trong đợt Flash Sale hiện tại.",
};

type FlashSalePageProps = {
  searchParams: Promise<{ categoryId?: string | string[] }>;
};

// Tải sale và danh mục song song; lỗi từng nguồn không làm hỏng toàn bộ trang.
export default async function FlashSalePage({ searchParams }: FlashSalePageProps) {
  const categoryId = parseSaleCategoryId((await searchParams).categoryId);
  // Dữ liệu không lọc giữ deadline và phân biệt hết sale với danh mục không có sản phẩm.
  const campaignPromise = getUserFlashSaleItems();
  const selectedPromise = categoryId === undefined ? campaignPromise : getUserFlashSaleItems(categoryId);
  const [categories, campaign, selectedSale] = await Promise.allSettled([
    getCategories(), campaignPromise, selectedPromise,
  ]);

  // Giữ redirect trước fallback; lỗi request chỉ được log trong serverFetch.
  for (const result of [categories, campaign, ...(categoryId === undefined ? [] : [selectedSale])]) {
    if (result.status === "rejected") {
      rethrowSessionRefreshRequired(result.reason);
    }
  }
  const requiresLogin = [campaign, selectedSale].some((result) => result.status === "rejected"
    && result.reason instanceof UserFlashSaleApiError && result.reason.status === HTTP_STATUS.UNAUTHORIZED);

  return <UserFlashSaleView initialData={{
    categories: categories.status === "fulfilled" ? categories.value : [],
    campaign: campaign.status === "fulfilled" ? campaign.value.data : null,
    selectedSale: selectedSale.status === "fulfilled" ? selectedSale.value.data : null,
    categoryId,
    hasError: campaign.status === "rejected" || selectedSale.status === "rejected",
    requiresLogin,
    serverNow: campaign.status === "fulfilled" ? campaign.value.now : 0,
  }} />;
}
