import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";

// Dẫn người dùng quay lại mua sắm khi giỏ hàng chưa có sản phẩm.
export function EmptyCartView() {
  return (
    <section className="flex min-h-svh items-center justify-center rounded-lg border border-surface-border bg-surface-card px-5 py-12 sm:px-8" aria-labelledby="empty-cart-title">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Hình minh họa đơn giản giúp trạng thái trống dễ nhận biết mà không dùng ảnh giả. */}
        <div className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-primary-light sm:h-44 sm:w-44">
          <ShoppingBag className="h-17 w-17 text-primary sm:h-20 sm:w-20" strokeWidth={1.35} aria-hidden="true" />
          <span className="absolute -right-1 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface-card text-star sm:right-0 sm:top-7" aria-hidden="true">
            <Sparkles className="h-5 w-5" strokeWidth={1.6} />
          </span>
        </div>
        <h1 id="empty-cart-title" className="text-xl font-semibold tracking-tight text-main sm:text-2xl">Giỏ hàng của bạn còn trống</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Khám phá những sản phẩm bạn yêu thích. Món đồ đầu tiên đang chờ được thêm vào giỏ hàng.</p>
        <Link href="/" className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover active:scale-95">
          Mua sắm ngay
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
