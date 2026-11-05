import Link from "next/link";
import styles from "./CheckoutOrderSuccessView.module.css";
import { ArrowRight, Check, House, PackageCheck, Sparkles, Star } from "lucide-react";
import type { CheckoutSucceededResponse } from "@/types/user/checkout";

// Xác nhận COD trong khối động; người mua có thể về trang chủ trước khi hết 5 giây.
export function CheckoutOrderSuccessView({ result }: { result: CheckoutSucceededResponse }) {
  return (
    <section role="status" className={`${styles.card} relative w-full max-w-lg overflow-hidden rounded-xl border border-white/80 bg-gradient-to-br from-emerald-50 via-surface-card to-indigo-50 px-6 py-8 text-center shadow-xl shadow-slate-900/10 sm:px-8`}>
      {/* Cụm biểu tượng kiện hàng và dấu xác nhận tạo điểm nhấn cho kết quả thành công. */}
      <div className="relative z-10 mx-auto w-full max-w-2xl">
        <div className="relative mx-auto mb-7 h-28 w-28 sm:h-32 sm:w-32" aria-hidden="true">
          <div className="absolute inset-0 rounded-full border border-emerald-200/70 bg-emerald-100/40" />
          <div className={`${styles.icon} absolute inset-3 flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-emerald-50`}>
            <PackageCheck className="h-14 w-14 text-emerald-600 sm:h-16 sm:w-16" strokeWidth={1.4} />
          </div>
          <span className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white ring-4 ring-white sm:h-11 sm:w-11"><Check className={`${styles.check} h-6 w-6`} strokeWidth={3} /></span>
          <Sparkles className={`${styles.sparkle} absolute -left-7 top-5 h-6 w-6 text-amber-500`} strokeWidth={1.5} />
          <Star className="absolute -right-6 top-0 h-5 w-5 fill-amber-100 text-amber-500 sm:-right-10" strokeWidth={1.5} />
          <Sparkles className="absolute -right-12 bottom-3 h-6 w-6 text-primary/60 sm:-right-16" strokeWidth={1.5} />
          <span className="absolute -left-3 bottom-5 h-2.5 w-2.5 rounded-full bg-cta/60" />
        </div>
        {/* Nội dung xác nhận không hiển thị mã checkout nội bộ. */}
        <h2 id="checkout-status-title" className="text-2xl font-bold leading-tight tracking-tight text-main sm:text-3xl">Đặt hàng thành công!</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">Đơn hàng của bạn đã được xác nhận.<br />Cảm ơn bạn đã chọn mua sắm cùng chúng tôi.</p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-emerald-800">
          {result.orderIds.map((id) => <span key={id} className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5">Đơn hàng #{id}</span>)}
        </div>
        {/* Điều hướng ngay hoặc tự động trở về sau khoảng chờ hiện có. */}
        <Link href="/" replace className="mx-auto mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4">
          <House className="h-4 w-4" aria-hidden="true" />Về trang chủ<ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <p className="mt-4 text-xs leading-6 text-muted-foreground">Tự động trở về trang chủ sau 5 giây.</p>
      </div>
    </section>
  );
}
