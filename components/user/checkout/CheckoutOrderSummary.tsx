import { Shield, Sparkles, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CheckoutOrderSummaryProps {
  onPlaceOrder: () => void;
  isSubmitting?: boolean;
}

// Bảng tóm tắt chi phí và nút hành động Đặt hàng cố định bên phải màn hình PC.
export function CheckoutOrderSummary({ onPlaceOrder, isSubmitting = false }: CheckoutOrderSummaryProps) {
  const subtotal = 6760000;
  const shippingFee = 77000;
  const shippingDiscount = 52000;
  const voucherDiscount = 50000;
  const totalSaved = shippingDiscount + voucherDiscount;
  const grandTotal = subtotal + shippingFee - shippingDiscount - voucherDiscount;

  return (
    <aside
      className="sticky top-[86px] overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-card space-y-4 p-4 sm:p-5"
      aria-label="Tóm tắt đơn hàng"
    >
      {/* Tiêu đề tóm tắt */}
      <div className="flex items-center justify-between border-b border-surface-border pb-3.5">
        <h2 className="text-base font-bold text-main">Tóm Tắt Đơn Hàng</h2>
        <span className="text-xs font-semibold text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-sm">
          3 sản phẩm
        </span>
      </div>

      {/* Chi tiết từng khoản tiền */}
      <dl className="space-y-2.5 text-xs sm:text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Tổng tiền hàng</dt>
          <dd className="font-semibold text-main">{formatCurrency(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Phí vận chuyển</dt>
          <dd className="font-semibold text-main">{formatCurrency(shippingFee)}</dd>
        </div>
        <div className="flex justify-between text-emerald-600">
          <dt>Giảm giá phí vận chuyển</dt>
          <dd className="font-semibold">-{formatCurrency(shippingDiscount)}</dd>
        </div>
        <div className="flex justify-between text-emerald-600">
          <dt>Voucher giảm giá</dt>
          <dd className="font-semibold">-{formatCurrency(voucherDiscount)}</dd>
        </div>

        {/* Khối huy hiệu tiết kiệm */}
        <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 border border-emerald-200">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4" /> Tổng tiết kiệm
          </span>
          <span>{formatCurrency(totalSaved)}</span>
        </div>

        {/* Tổng thanh toán cuối cùng */}
        <div className="border-t border-surface-border pt-3.5 flex items-baseline justify-between">
          <dt className="text-sm font-bold text-main">Tổng thanh toán</dt>
          <dd className="text-right">
            <span className="text-xl sm:text-2xl font-black text-cta tracking-tight">
              {formatCurrency(grandTotal)}
            </span>
            <p className="text-[10px] text-muted-foreground mt-0.5">(Đã bao gồm VAT nếu có)</p>
          </dd>
        </div>
      </dl>

      {/* Nút bấm Đặt hàng chính */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onPlaceOrder}
        className="w-full h-12 flex items-center justify-center rounded-xl bg-cta text-white font-bold text-base shadow-glow-cta hover:bg-cta-hover active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Đang xử lý đơn hàng..." : "Đặt Hàng Ngay"}
      </button>

      {/* Điều khoản và cam kết bảo vệ người mua */}
      <div className="space-y-2 border-t border-surface-border pt-3 text-[11px] text-slate-500">
        <p className="leading-relaxed text-center">
          Bằng việc nhấn &quot;Đặt Hàng Ngay&quot;, bạn đồng ý tuân thủ theo{" "}
          <span className="text-primary hover:underline cursor-pointer">Điều khoản dịch vụ</span> của ModernShop.
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-600 pt-1 font-medium">
          <span className="flex items-center gap-1">
            <Shield className="h-3.5 w-3.5 text-primary" /> Chính hãng 100%
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Trả hàng 15 ngày
          </span>
        </div>
      </div>
    </aside>
  );
}
