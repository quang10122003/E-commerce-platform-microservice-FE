import { Suspense } from "react";
import { Loading } from "@/components/ui";
import { notFound } from "next/navigation";
import { ShopFlashSaleRegistrationContent } from "@/components/shop/flash-sale/shop-flash-sale-registration-content";
import { ProductFormModal } from "@/components/shop/products/product-form-modal";

// Kiểm tra mã chương trình trước khi tải dữ liệu biểu mẫu.
export default async function RegistrationPage({ params }: { params: Promise<{ campaignId: string }> }) {
  const { campaignId } = await params;
  const id = Number(campaignId);
  if (campaignId !== "demo" && (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(id) || id <= 0)) notFound();
  return <ProductFormModal title="Đăng ký sản phẩm" description="Chọn sản phẩm và phân loại để đăng ký.">
    <Suspense fallback={<Loading label="Đang tải sản phẩm..." />}><ShopFlashSaleRegistrationContent campaignId={campaignId} isModal /></Suspense>
  </ProductFormModal>;
}
