import { notFound } from "next/navigation";
import { ProductFormModal } from "@/components/shop/products/product-form-modal";
import { ShopFlashSaleItemsView } from "@/components/shop/flash-sale/shop-flash-sale-items-view";
import { getShopFlashSaleCampaignDetail } from "@/lib/service/flashSaleService";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";

type PageProps = {
  params: Promise<{ campaignId: string }>;
};

// Mở chi tiết lịch sử trong popup, giữ nguyên trang danh sách bên dưới.
export default async function ShopFlashSaleHistoryItemsModalPage({ params }: PageProps) {
  const { campaignId } = await params;
  const id = Number(campaignId);

  // Kiểm tra mã chương trình hợp lệ.
  if (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  // Tên chương trình được tải phía server; lỗi nghiệp vụ chỉ ẩn tiêu đề, không chặn bảng.
  let campaignName = "";
  try {
    const { data } = await getShopFlashSaleCampaignDetail(campaignId);
    campaignName = data.name?.trim() ?? "";
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return (
    <ProductFormModal
      className="sm:max-w-[90rem]"
      title={campaignName}
      description="Xem và kiểm tra các phân loại hàng của shop đã đăng ký tham gia chương trình."
    >
      {/* Dùng vùng cuộn sẵn có của modal để tránh hai thanh cuộn lồng nhau. */}
      <ShopFlashSaleItemsView campaignId={campaignId} isModal registrationOpen={false} isHistory />
    </ProductFormModal>
  );
}
