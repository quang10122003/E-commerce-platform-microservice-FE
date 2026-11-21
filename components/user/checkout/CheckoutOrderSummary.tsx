import { formatCurrency } from "@/lib/utils";

interface CheckoutOrderSummaryProps {
  isSubmitting?: boolean;
  total: number | null;
  itemCount: number;
  quoteLoading: boolean;
  quoteError: string | null;
  onRetry: () => void;
  disabled: boolean;
}

// Đầy đủ chi tiết trên PC; mobile/tablet chỉ giữ tổng tiền và nút đặt hàng để thanh ghim đáy gọn.
export function CheckoutOrderSummary({ isSubmitting = false, total, itemCount, quoteLoading, quoteError, onRetry, disabled }: CheckoutOrderSummaryProps) {
  // Chưa có API phí nên không cộng khoản mock vào báo giá BE.
  const shippingFee = 0;
  const amountLabel = quoteLoading ? "Đang tính..." : total === null ? "—" : formatCurrency(total);

  return (
    <aside
      className="overflow-hidden rounded-xl border border-surface-border bg-surface-card/95 p-4 shadow-card backdrop-blur-md sm:p-5 lg:space-y-4 lg:bg-surface-card lg:backdrop-blur-none"
      aria-label="Tóm tắt đơn hàng"
    >
      <div className="hidden items-center justify-between border-b border-surface-border pb-3.5 lg:flex">
        <h2 className="text-base font-bold text-main">Tóm Tắt Đơn Hàng</h2>
        <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-sm">
          {itemCount} sản phẩm
        </span>
      </div>

      <div className="flex items-center justify-between gap-4 lg:block lg:space-y-4">
        <dl className="text-xs sm:text-sm lg:space-y-2.5">
          <div className="hidden justify-between lg:flex">
            <dt className="text-muted-foreground">Tổng tiền hàng</dt>
            <dd className="font-semibold text-main">{amountLabel}</dd>
          </div>
          <div className="hidden justify-between lg:flex">
            <dt className="text-muted-foreground">Phí vận chuyển</dt>
            <dd className="font-semibold text-main">{formatCurrency(shippingFee)}</dd>
          </div>
          <div className="lg:flex lg:items-baseline lg:justify-between lg:border-t lg:border-surface-border lg:pt-3.5">
            <dt className="text-xs text-muted-foreground lg:text-sm lg:font-bold lg:text-main">Tổng thanh toán<span className="lg:hidden"> ({itemCount} sản phẩm)</span></dt>
            <dd className="text-lg font-black tracking-tight text-cta sm:text-xl lg:text-2xl" aria-live="polite">{amountLabel}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={isSubmitting || disabled}
          className="flex h-11 min-w-35 shrink-0 items-center justify-center rounded-xl bg-cta px-5 text-sm font-bold text-white shadow-glow-cta transition-all hover:bg-cta-hover active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 lg:h-12 lg:w-full lg:text-base"
        >
          {isSubmitting ? "Đang xử lý..." : "Đặt Hàng Ngay"}
        </button>
      </div>

      {quoteError && <div role="alert" className="mt-2 space-y-2 text-xs text-danger lg:mt-0">
        <p>{quoteError}</p>
        <button type="button" onClick={onRetry} className="cursor-pointer font-semibold text-primary hover:underline">Thử tính lại</button>
      </div>}
    </aside>
  );
}
