import { notFound } from "next/navigation";
import { ShopFlashSaleItemsView } from "@/components/shop/flash-sale/shop-flash-sale-items-view";

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

  return (
    <main className="w-full min-w-0 space-y-4">
      {/* Vùng chứa nội dung toàn trang khi truy cập trực tiếp bằng URL */}
      <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-xs">
        <ShopFlashSaleItemsView campaignId={campaignId} />
      </section>
    </main>
  );
}
