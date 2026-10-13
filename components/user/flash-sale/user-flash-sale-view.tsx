"use client";

import Link from "next/link";
import { Flame, LogIn, PackageSearch, RefreshCw } from "lucide-react";
import { AuthModal } from "@/components/auth/auth-modal";
import { Button } from "@/components/ui";
import { useUserFlashSale } from "@/hooks/user/flash-sale/useUserFlashSale";
import type { FlashSaleSort, UserFlashSaleInitialData } from "@/types/user/flash-sale";
import { FlashSaleHero } from "./flash-sale-hero";
import { FlashSaleCategories } from "./flash-sale-categories";
import { FlashSaleProductCard } from "./flash-sale-product-card";
import { FlashSaleProductSkeleton } from "./flash-sale-product-skeleton";

// Kết hợp UI sale; toàn bộ gọi API, state và side-effect nằm trong custom hook.
export function UserFlashSaleView({ initialData }: { initialData: UserFlashSaleInitialData }) {
  const sale = useUserFlashSale(initialData);

  return (
    <div className="space-y-5 selection:bg-primary-light selection:text-primary">
      {/* Chỉ hiển thị khu vực săn sale khi API chưa xác nhận không có đợt đang diễn ra. */}
      {!sale.isNoActiveSale && <>
      <FlashSaleHero endsAt={sale.endsAt} expired={sale.countdown.expired} parts={sale.countdown.parts} totalItems={sale.totalItems} maxDiscount={sale.maxDiscount} />
      <FlashSaleCategories categories={sale.categories} selectedId={sale.categoryId} onSelect={sale.setCategoryId} />
      </>}

      {/* Bộ điều khiển danh sách và trạng thái tải không làm mất ngữ cảnh đợt sale. */}
      <section aria-label="Sản phẩm Flash Sale" className="space-y-4">
        {!sale.isNoActiveSale && <>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-main"><Flame className="size-5 text-cta-hover" aria-hidden="true" />Ưu đãi đang diễn ra</h2>
            <p className="mt-1 text-xs text-muted-foreground" role="status">{`${sale.items.length} phân loại sản phẩm${sale.categoryId ? " trong danh mục đã chọn" : ""}`}</p>
          </div>
          <Button variant="outline" size="sm" onClick={sale.retry} disabled={sale.isLoading || sale.isRefreshing} className="min-h-10"><RefreshCw className="size-3.5" aria-hidden="true" />Tải lại</Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-surface-border bg-surface-card px-4 py-3">
          <label className="flex min-h-10 cursor-pointer items-center gap-2 text-sm text-main">
            <input type="checkbox" checked={sale.availableOnly} onChange={(event) => sale.setAvailableOnly(event.target.checked)} className="size-4 accent-primary focus-visible:outline-2 focus-visible:outline-primary" />Chỉ hiện sản phẩm còn suất
          </label>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">Sắp xếp
            <select value={sale.sort} onChange={(event) => sale.setSort(event.target.value as FlashSaleSort)} className="min-h-10 max-w-full rounded-md border border-surface-border bg-surface-card px-3 text-sm text-main focus-visible:outline-2 focus-visible:outline-primary">
              <option value="DEFAULT">Mặc định</option><option value="DISCOUNT_DESC">Giảm nhiều nhất</option><option value="PRICE_ASC">Giá thấp đến cao</option><option value="PRICE_DESC">Giá cao đến thấp</option>
            </select>
          </label>
        </div>
        </>}

        {/* Các trạng thái xác thực, lỗi và rỗng có hướng khôi phục cụ thể. */}
        {sale.isLoading ? (
          <FlashSaleProductSkeleton />
        ) : !sale.isAuthenticated ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-surface-border bg-surface-card px-5 py-10 text-center">
            <LogIn className="size-8 text-primary" aria-hidden="true" /><h3 className="font-heading text-lg font-semibold">Đăng nhập để xem Flash Sale</h3>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">Đăng nhập tài khoản ModernShop để xem giá ưu đãi và phân loại đang tham gia đợt sale.</p>
            <Button onClick={sale.openLogin} className="mt-2">Đăng nhập</Button>
          </div>
        ) : sale.error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border border-surface-border bg-surface-card p-6 text-center" role="alert">
            <h3 className="font-heading text-lg font-semibold">Chưa tải được ưu đãi</h3><p className="text-sm text-muted-foreground">Vui lòng kiểm tra kết nối và tải lại danh sách Flash Sale.</p><Button variant="outline" onClick={sale.retry}>Thử lại</Button>
          </div>
        ) : sale.items.length ? (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5">
            {sale.items.map((item) => <FlashSaleProductCard key={item.variantId} item={item} />)}
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center gap-3 p-6 text-center ${sale.isNoActiveSale ? "min-h-dvh" : "min-h-64 rounded-xl border border-surface-border bg-surface-card"}`}>
            {sale.isNoActiveSale ? (
              <>
                {/* Biểu tượng túi mua sắm và đồng hồ cho trạng thái chưa có ưu đãi. */}
                <svg viewBox="0 0 64 64" fill="none" className="size-20 text-muted-foreground/50" aria-hidden="true" focusable="false">
                  <path d="M15 23h30l4 31H11l4-31Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M22 25v-9a8 8 0 0 1 16 0v9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="22" cy="27" r="2" fill="currentColor" />
                  <circle cx="38" cy="27" r="2" fill="currentColor" />
                  <circle cx="47" cy="46" r="12" className="fill-surface-bg stroke-cta" strokeWidth="2" />
                  <path d="M47 39v7l5 3" className="stroke-cta" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm text-muted-foreground" role="status">Chưa có ưu đãi Flash Sale lúc này.</p>
              </>
            ) : (
              <>
                <PackageSearch className="size-9 text-primary" aria-hidden="true" />
                <h3 className="font-heading text-lg font-semibold">{sale.countdown.expired ? "Đợt Flash Sale đã kết thúc" : sale.totalItems ? "Chưa có ưu đãi phù hợp" : "Chưa có Flash Sale đang diễn ra"}</h3>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{sale.totalItems && !sale.countdown.expired ? "Thử danh mục khác hoặc bỏ bộ lọc còn suất để xem thêm sản phẩm." : "Bạn có thể quay lại sau hoặc tiếp tục khám phá sản phẩm tại trang chủ."}</p>
              </>
            )}
            {sale.totalItems && !sale.countdown.expired ? <Button variant="outline" onClick={() => { sale.setCategoryId(undefined); sale.setAvailableOnly(false); }}>Xem tất cả ưu đãi</Button> : <Link href="/" className="mt-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-primary">Khám phá trang chủ</Link>}
          </div>
        )}
        {!sale.isNoActiveSale && <p className="text-center text-xs leading-relaxed text-muted-foreground">Giá ưu đãi áp dụng cho phân loại được hiển thị, trong thời gian và số lượng của đợt sale.</p>}
      </section>
      <AuthModal isOpen={sale.isLoginOpen} onClose={sale.closeLogin} initialTab="login" />
    </div>
  );
}


