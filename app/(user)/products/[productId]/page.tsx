import Link from "next/link";
import Image from "next/image";
import {
  Star,
  MapPin,
  MessageCircle,
  Store,
  Clock,
} from "lucide-react";
import { ProductImageGallery } from "@/components/user/product-detail/ProductImageGallery";
import { ProductActions } from "@/components/user/product-detail/ProductActions";
import { ProductReviews } from "@/components/user/product-detail/ProductReviews";
import { ProductDescription } from "@/components/user/product-detail/ProductDescription";
import { PersonalizedSuggestions } from "@/components/user/home/personalized-suggestions";

// Trang chi tiết sản phẩm – dữ liệu cứng, giao diện Shopee-style.
export default function ProductDetailPage() {
  return (
    <div className="space-y-4">

      {/* ── BLOCK CHÍNH: gallery trái + thông tin phải gom trong 1 card ── */}
      <div className="overflow-hidden rounded-xl border border-surface-border bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">

          {/* Cột trái: Gallery ảnh sản phẩm sticky khi cuộn. */}
          <div className="p-5">
            <div className="sticky top-4">
              <ProductImageGallery />
            </div>
          </div>

          {/* Cột phải: Tên, giá, phân loại, số lượng, nút mua. */}
          <div className="flex flex-col gap-5 p-6">

            {/* Tên sản phẩm. */}
            <h1 className="text-lg font-bold leading-snug text-main sm:text-xl">
              Đồng Hồ Thông Minh SmartX Pro Ultra 2026 – Màn Hình AMOLED,
              Theo Dõi Sức Khỏe 24/7, Pin 7 Ngày, GPS Tích Hợp, Kháng Nước 5ATM
            </h1>

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
                <span className="font-semibold text-main underline decoration-dotted">12.4k</span>
              </span>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>Hà Nội</span>
              </div>
            </div>

            {/* Khu vực giá kèm đồng hồ đếm ngược Flash Sale. */}
            <div className="flex flex-wrap items-end gap-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4">
              {/* Countdown Flash Sale. */}
              <div className="mb-1 flex w-full items-center gap-2 text-xs text-orange-600">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-semibold uppercase tracking-wide">Flash Sale kết thúc sau</span>
                <div className="flex items-center gap-1">
                  {["01", "23", "45"].map((unit, i) => (
                    <span key={i} className="flex items-center gap-1">
                      <span className="rounded bg-orange-500 px-1.5 py-0.5 text-xs font-black text-white">
                        {unit}
                      </span>
                      {i < 2 && <span className="font-black text-orange-500">:</span>}
                    </span>
                  ))}
                </div>
              </div>
              {/* Giá khuyến mãi và giá gốc gạch ngang. */}
              <span className="text-3xl font-black text-cta sm:text-4xl">1.390.000₫</span>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm text-muted-foreground line-through">1.990.000₫</span>
                <span className="rounded bg-cta px-2 py-0.5 text-center text-xs font-black text-white">
                  -30%
                </span>
              </div>
            </div>

            {/* Đường ngăn cách trước phần chọn phân loại và nút mua. */}
            <div className="border-t border-slate-100" />

            {/* Chọn màu sắc, phiên bản, số lượng và nút mua. */}
            <ProductActions />
          </div>
        </div>
      </div>

      {/* ── BLOCK THÔNG TIN SHOP – full-width bên ngoài lưới 2 cột ── */}
      <div className="rounded-xl border border-surface-border bg-white">
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

          {/* Nút hành động với shop. */}
          <div className="flex gap-3 sm:flex-col sm:gap-2">
            <Link
              href="#"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-primary hover:bg-primary-light hover:text-primary sm:flex-none"
            >
              <Store className="h-3.5 w-3.5" />
              Xem Shop
            </Link>
            <Link
              href="#"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white sm:flex-none"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Chat ngay
            </Link>
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
