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

// Bảng tóm tắt chi phí và nút hành động Đặt hàng cố định bên phải màn hình PC.
export function CheckoutOrderSummary({ isSubmitting = false, total, itemCount, quoteLoading, quoteError, onRetry, disabled }: CheckoutOrderSummaryProps) {
  // Chưa có API phí nên không cộng khoản mock vào báo giá BE.
  const shippingFee = 0;
  const amountLabel = quoteLoading ? "Đang tính..." : total === null ? "—" : formatCurrency(total);

  return (
    <aside
      className="sticky top-[86px] overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-card space-y-4 p-4 sm:p-5"
      aria-label="Tóm tắt đơn hàng"
    >
      {/* Tiêu đề tóm tắt */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <h2 className="text-base font-bold text-main">Tóm Tắt Đơn Hàng</h2>
        <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-sm">
          {itemCount} sản phẩm
        </span>
      </div>

      {/* Chi tiết từng khoản tiền */}
      <dl className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tổng tiền hàng</dt>
          <dd className="font-semibold text-main" aria-live="polite">{amountLabel}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Phí vận chuyển</dt>
          <dd className="font-semibold text-main">{formatCurrency(shippingFee)}</dd>
        </div>
        {/* Tổng thanh toán cuối cùng */}
        <div className="border-t border-surface-border pt-3.5 flex items-baseline justify-between">
          <dt className="text-sm font-bold text-main">Tổng thanh toán</dt>
          <dd className="text-right">
            <span className="text-xl sm:text-2xl font-black text-cta tracking-tight">
              {amountLabel}
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">(Đã bao gồm VAT nếu có)</p>
          </dd>
        </div>
      </dl>

      {quoteError && <div role="alert" className="space-y-2 text-xs text-danger">
        <p>{quoteError}</p>
        <button type="button" onClick={onRetry} className="cursor-pointer font-semibold text-primary hover:underline">Thử tính lại</button>
      </div>}

      {/* Nút bấm Đặt hàng chính */}
      <button
        type="submit"
        disabled={isSubmitting || disabled}
        className="w-full h-12 flex items-center justify-center rounded-xl bg-cta text-white font-bold text-base shadow-glow-cta hover:bg-cta-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xử lý đơn hàng..." : "Đặt Hàng Ngay"}
      </button>

    </aside>
  );
}
