import { RefreshCw, ShoppingBag } from "lucide-react";

interface CartErrorViewProps {
  pending: boolean;
  onRetry: () => void;
}

// Hiển thị trạng thái lỗi tải giỏ hàng thay cho thông báo kỹ thuật.
export function CartErrorView({ pending, onRetry }: CartErrorViewProps) {
  return (
    <section className="flex min-h-svh items-center justify-center rounded-lg border border-surface-border bg-surface-card px-5 py-12 sm:px-8" aria-labelledby="cart-error-title">
      <div className="flex max-w-md flex-col items-center text-center">
        {/* Hình minh họa giữ cùng phong cách với trạng thái giỏ hàng trống. */}
        <div className="relative mb-8 flex h-36 w-36 items-center justify-center rounded-full bg-primary-light sm:h-44 sm:w-44">
          <ShoppingBag className="h-17 w-17 text-primary sm:h-20 sm:w-20" strokeWidth={1.35} aria-hidden="true" />
          <span className="absolute -right-1 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-surface-border bg-surface-card text-cta sm:right-0 sm:top-7" aria-hidden="true">
            <RefreshCw className="h-5 w-5" strokeWidth={1.7} />
          </span>
        </div>
        <h1 id="cart-error-title" className="text-xl font-semibold tracking-tight text-main sm:text-2xl">Chưa thể mở giỏ hàng lúc này</h1>
        <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Giỏ hàng của bạn vẫn ở đây. Hãy thử tải lại để tiếp tục mua sắm nhé.</p>
        <button type="button" disabled={pending} onClick={onRetry} className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-cta px-6 py-2.5 text-sm font-semibold text-cta-foreground transition-colors hover:bg-cta-hover active:scale-95 disabled:cursor-not-allowed disabled:opacity-60">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          Thử lại
        </button>
      </div>
    </section>
  );
}
