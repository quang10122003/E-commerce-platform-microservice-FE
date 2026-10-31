import { notFound } from "next/navigation";
import { ShopFlashSaleItemsView } from "@/components/shop/flash-sale/shop-flash-sale-items-view";

type PageProps = {
  params: Promise<{ campaignId: string }>;
};

// Trang chi tiết lịch sử dùng lại giao diện và logic danh sách phân loại đã đăng ký.
export default async function ShopFlashSaleHistoryItemsPage({ params }: PageProps) {
  const { campaignId } = await params;
  const id = Number(campaignId);

  // Kiểm tra mã chương trình hợp lệ, tránh id âm hoặc không phải số.
  if (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(id) || id <= 0) {
    notFound();
  }

  return (
    <main className="w-full min-w-0">
      <ShopFlashSaleItemsView campaignId={campaignId} registrationOpen={false} isHistory />
    </main>
  );
}
