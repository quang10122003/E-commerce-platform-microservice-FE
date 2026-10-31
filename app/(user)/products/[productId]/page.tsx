import { notFound } from "next/navigation";
import {
  Star,
  MapPin,
} from "lucide-react";
import { ProductDetailName, ProductDetailSold, ProductDetailLocation } from "@/components/user/product-detail/ProductDetailInfoView";
import { ProductDetailLoadingView } from "@/components/user/product-detail/ProductDetailLoadingView";
import { ProductImageGallery } from "@/components/user/product-detail/ProductImageGallery";
import { ProductPriceView } from "@/components/user/product-detail/ProductPriceView";
import { ProductPurchaseSection } from "@/components/user/product-detail/ProductPurchaseSection";
import { ProductReviews } from "@/components/user/product-detail/ProductReviews";
import { ProductShopInfoView } from "@/components/user/product-detail/ProductShopInfoView";
import { ProductDescription } from "@/components/user/product-detail/ProductDescription";
import { ProductSimilarProductsView } from "@/components/user/product-detail/ProductSimilarProductsView";

type ProductDetailPageProps = {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ variantId?: string | string[] }>;
};

// Trang chi tiết sản phẩm; dữ liệu thật được gắn ở component client, các phần chưa có API giữ mock.
export default async function ProductDetailPage({ params, searchParams }: ProductDetailPageProps) {
  const [{ productId }, { variantId }] = await Promise.all([params, searchParams]);
  const initialVariantId = typeof variantId === "string" ? variantId : undefined;
  const parsedProductId = Number(productId);
  // Chỉ gọi API với mã nguyên dương hợp lệ từ đường dẫn trang.
  if (!/^\d+$/.test(productId) || !Number.isSafeInteger(parsedProductId) || parsedProductId <= 0) {
    notFound();
  }

  return (
    <ProductDetailLoadingView key={`${parsedProductId}:${initialVariantId ?? "default"}`} productId={parsedProductId} initialVariantId={initialVariantId}>
    <div className="space-y-4 max-sm:pb-[calc(5rem+env(safe-area-inset-bottom))]">

      {/* ── BLOCK CHÍNH: gallery trái + thông tin phải gom trong 1 card ── */}
      <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
        <div className="grid grid-cols-1 md:max-lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">

          {/* Cột trái: Gallery ảnh sản phẩm sticky khi cuộn. */}
          <div className="p-5 md:max-lg:p-4">
            <div className="sticky top-4">
              <ProductImageGallery />
            </div>
          </div>

          {/* Cột phải: Tên, giá, phân loại, số lượng, nút mua. */}
          <div className="flex flex-col gap-5 p-6 md:max-lg:gap-4 md:max-lg:p-4">

            {/* Tên sản phẩm. */}
            <ProductDetailName />

            {/* Đánh giá tổng hợp: sao, lượt đánh giá, đã bán, khu vực. */}
            <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-star underline decoration-dotted">4.9</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-star text-star" />
                  ))}
                </div>
              </div>
              <span className="h-4 w-px bg-slate-200" />
              <span className="text-sm text-muted-foreground">
                <span className="font-semibold text-main underline decoration-dotted">1.000</span>{" "}
                Đánh giá
              </span>
              <span className="h-4 w-px bg-slate-200" />
              <span className="text-sm text-muted-foreground">
                Đã bán{" "}
                <ProductDetailSold />
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <ProductDetailLocation />
              </div>
            </div>

            {/* Block mua hàng luôn hiện trên tablet/desktop, mở theo yêu cầu trên mobile. */}
            <ProductPurchaseSection>
              {/* Khu vực giá kèm đồng hồ đếm ngược Flash Sale. */}
              <ProductPriceView />

              {/* Đường ngăn cách trước phần chọn phân loại và nút mua. */}
              <div className="border-t border-slate-100" />

            </ProductPurchaseSection>
          </div>
        </div>
      </div>

      {/* ── BLOCK THÔNG TIN SHOP – full-width bên ngoài lưới 2 cột ── */}
      <ProductShopInfoView />

      {/* ── BLOCK MÔ TẢ VÀ ĐÁNH GIÁ phía dưới ── */}
      <ProductDetailTabs />

      {/* Gợi ý sản phẩm hiển thị sau phần đánh giá. */}
      <ProductSimilarProductsView productId={parsedProductId} />
    </div>
    </ProductDetailLoadingView>
  );
}

// Phần mô tả sản phẩm và đánh giá người mua – Server Component bao bọc client bên trong.
function ProductDetailTabs() {
  return (
    <div className="space-y-4">
      {/* Card mô tả chi tiết sản phẩm. */}
      <div className="rounded-xl border border-surface-border bg-white">
        <div className="border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-main">Mô tả sản phẩm</h2>
        </div>
        <div className="p-6">
          <ProductDescription />
        </div>
      </div>

      {/* Card đánh giá của người mua thực tế. */}
      <div className="rounded-xl border border-surface-border bg-white">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-base font-bold text-main">Đánh giá sản phẩm</h2>
          <span className="text-xs text-muted-foreground">1.000 đánh giá</span>
        </div>
        <div className="p-6">
          <ProductReviews />
        </div>
      </div>
    </div>
  );
}
