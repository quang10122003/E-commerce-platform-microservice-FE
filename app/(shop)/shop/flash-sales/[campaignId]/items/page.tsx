import { notFound } from "next/navigation";
import { ShopFlashSaleItemsView } from "@/components/shop/flash-sale/shop-flash-sale-items-view";
import { getShopFlashSaleCampaignDetail } from "@/lib/service/flashSaleService";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { isRegistrationDeadlineOpen } from "@/lib/utils/flash-sale.utils";

type PageProps = {
  params: Promise<{ campaignId: string }>;
};

// Trang hiển thị danh sách các phân loại đã đăng ký Flash Sale của Shop
export default async function ShopFlashSaleItemsPage({ params }: PageProps) {
  const { campaignId } = await params;
  const id = Number(campaignId);

  // Kiểm tra mã chương trình hợp lệ, tránh id âm hoặc không phải số
  if (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  // Không cho đăng ký khi chưa xác định được deadline; vẫn giữ danh sách sản phẩm.
  let registrationOpen = false;
  try {
    const { data, now } = await getShopFlashSaleCampaignDetail(campaignId);
    registrationOpen = isRegistrationDeadlineOpen(data.registrationDeadline, now);
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return (
    <main className="w-full min-w-0">
      <ShopFlashSaleItemsView campaignId={campaignId} registrationOpen={registrationOpen} />
    </main>
  );
}
