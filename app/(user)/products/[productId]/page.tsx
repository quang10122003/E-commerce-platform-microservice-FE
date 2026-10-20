import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  ChevronRight,
  MessageCircle,
  Store,
} from "lucide-react";
import { ProductDetailName, ProductDetailSold, ProductDetailLocation, ProductDetailShopLink, ProductDetailChatButton } from "@/components/user/product-detail/ProductDetailInfoView";
import { ProductDetailLoadingView } from "@/components/user/product-detail/ProductDetailLoadingView";
import { ProductImageGallery } from "@/components/user/product-detail/ProductImageGallery";
import { ProductPriceView } from "@/components/user/product-detail/ProductPriceView";
import { ProductPurchaseSection } from "@/components/user/product-detail/ProductPurchaseSection";
import { ProductReviews } from "@/components/user/product-detail/ProductReviews";
import { ProductDescription } from "@/components/user/product-detail/ProductDescription";
import { PersonalizedSuggestions } from "@/components/user/home/personalized-suggestions";

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
      <div id="product-shop-chat" className="relative rounded-xl border border-surface-border bg-white">
        {/* Toàn bộ block shop là vùng bấm trên mobile; URL tạm chưa có trang đích. */}
        <ProductDetailShopLink
          className="absolute inset-0 z-10 rounded-xl transition-colors active:bg-primary/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
          aria-label="Xem shop SmartX Official Store"
        />
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between">

          {/* Avatar và tên shop. */}
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-primary/20">
              <Image
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&q=80"
                alt="SmartX Official Store"
                fill
                unoptimized
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-main">SmartX Official Store</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span> Online 5 phút trước</span>
                <span className="hidden sm:inline">·</span>
                <span>⭐ 4.9/5 · 8.4k sản phẩm</span>
              </div>
            </div>
            <ChevronRight className="ml-auto h-5 w-5 shrink-0 text-muted-foreground sm:hidden" aria-hidden="true" />
          </div>

          {/* Số liệu thống kê shop chia theo các cột. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:divide-x sm:divide-slate-100">
            {[
              { label: "Đánh giá", value: "4.9/5" },
              { label: "Sản phẩm", value: "8.4k" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 sm:px-6 first:sm:pl-0">
                <span className="text-base font-black text-primary">{value}</span>
                <span className="text-[11px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>

          {/* Nút hành động với shop chỉ hiển thị trên tablet và desktop. */}
          <div className="hidden gap-2 sm:flex sm:flex-col">
            <ProductDetailShopLink
              className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-primary hover:bg-primary-light hover:text-primary"
            >
              <Store className="h-3.5 w-3.5" />
              Xem Shop
            </ProductDetailShopLink>
            <ProductDetailChatButton />
          </div>
        </div>
      </div>

      {/* ── BLOCK MÔ TẢ VÀ ĐÁNH GIÁ phía dưới ── */}
      <ProductDetailTabs />

      {/* Gợi ý sản phẩm hiển thị sau phần đánh giá. */}
      <section className="space-y-4">
        <h2 className="text-lg font-medium text-slate-600 sm:text-xl">Có thể bạn cũng thích</h2>
        <PersonalizedSuggestions showTabs={false} />
      </section>
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
