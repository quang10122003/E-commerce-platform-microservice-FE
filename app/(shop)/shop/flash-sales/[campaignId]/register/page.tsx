import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { notFound } from "next/navigation";
import { ShopFlashSaleRegistrationContent } from "@/components/shop/flash-sale/shop-flash-sale-registration-content";

// Kiểm tra mã chương trình trước khi tải dữ liệu biểu mẫu.
export default async function RegistrationPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const id = Number(campaignId);
  if (campaignId !== "demo" && (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(id) || id <= 0)) notFound();
  return <section className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-surface-border bg-surface-card">
    {/* Trang đầy đủ thay thế popup khi mở link trực tiếp hoặc refresh. */}
    <header className="border-b border-surface-border px-6 py-5 sm:px-8">
      <h1 className="font-heading text-2xl font-bold text-main">Đăng ký sản phẩm</h1>
    </header>
    <Suspense fallback={<Loading label="Đang tải sản phẩm..." />}><ShopFlashSaleRegistrationContent campaignId={campaignId} /></Suspense>
  </section>;
}
