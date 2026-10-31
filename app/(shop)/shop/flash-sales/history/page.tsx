import type { Metadata } from "next";
import { ShopFlashSaleHistoryView } from "@/components/shop/flash-sale/history/shop-flash-sale-history-view";
import { FIRST_PAGE, PAGE_SIZE } from "@/lib/constants";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { FlashSaleApiError, getShopCompletedFlashSales } from "@/lib/service/flashSaleService";
import type { ShopCompletedFlashSalePage, ShopCompletedFlashSaleQuery } from "@/types/shop/flash-sale";

export const metadata: Metadata = {
  title: "Lịch sử Flash Sale | Kênh Người Bán",
  description: "Xem lại lịch sử các chiến dịch Flash Sale gian hàng đã tham gia.",
};

type PageProps = {
  searchParams: Promise<{ page?: string; from?: string; to?: string; keyword?: string; range?: string }>;
};

// Chỉ nhận số nguyên dương từ URL để gọi đúng trang API.
function parsePositiveInteger(value?: string) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

// Tải lịch sử Flash Sale đã hoàn thành qua serverFetch, không chuyển token xuống client.
export default async function ShopFlashSaleHistoryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query: ShopCompletedFlashSaleQuery = {
    page: parsePositiveInteger(params.page) ?? FIRST_PAGE,
    from: params.from || undefined,
    to: params.to || undefined,
    keyword: params.keyword?.trim() || undefined,
    quickFilter: ["all", "7d", "30d", "this_month", "custom"].includes(params.range ?? "")
      ? params.range
      : params.from || params.to ? "custom" : "all",
  };

  let data: ShopCompletedFlashSalePage = {
    items: [],
    page: query.page,
    pageSize: PAGE_SIZE.SHOP_FLASH_SALE_HISTORY,
    totalItems: 0,
    totalPages: 0,
  };
  let error: string | undefined;
  try {
    data = await getShopCompletedFlashSales(query);
  } catch (cause) {
    rethrowSessionRefreshRequired(cause);
    error = cause instanceof FlashSaleApiError
      ? cause.message
      : "Không thể tải lịch sử Flash Sale. Vui lòng thử lại.";
  }

  return <ShopFlashSaleHistoryView key={JSON.stringify([query.from, query.to, query.quickFilter])} data={data} query={query} error={error} />;
}
