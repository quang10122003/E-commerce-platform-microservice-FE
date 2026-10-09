import { formatCurrency } from "@/lib/utils";

interface CartSummaryProps {
  itemCount: number;
  quantity: number;
  total: number;
  shopCount: number;
}

// Hiển thị tổng tiền của các sản phẩm còn có thể thanh toán.
export function CartSummary({ itemCount, quantity, total, shopCount }: CartSummaryProps) {
  return (
    <aside className="sticky bottom-0 z-20 overflow-hidden rounded-lg border border-surface-border bg-surface-card/95 backdrop-blur-md lg:bottom-auto lg:top-[86px] lg:bg-surface-card lg:backdrop-blur-none" aria-label="Tóm tắt giỏ hàng">
      {/* Khối thanh toán nằm bên phải trên PC và dưới danh sách ở màn hình nhỏ. */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border bg-slate-50/80 px-4 py-3.5 sm:px-5 lg:block lg:px-5">
        <h2 className="hidden text-base font-semibold text-main lg:block">Tóm tắt giỏ hàng</h2>
        <p className="text-sm font-semibold text-main lg:hidden">{itemCount} sản phẩm <span className="font-normal text-muted-foreground">từ {shopCount} cửa hàng</span></p>
        <dl className="mt-5 hidden space-y-3 border-t border-surface-border pt-5 text-sm lg:block">
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Sản phẩm đã chọn</dt><dd className="font-medium text-main">{itemCount}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Số lượng</dt><dd className="font-medium text-main">{quantity}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Cửa hàng</dt><dd className="font-medium text-main">{shopCount}</dd></div>
        </dl>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-5 lg:block lg:px-5 lg:py-5">
        <div className="ml-auto flex flex-wrap items-center justify-end gap-x-5 gap-y-2 lg:mt-4 lg:block">
          <div className="text-right lg:flex lg:items-baseline lg:justify-between lg:gap-2"><p className="text-xs text-muted-foreground">Tổng cộng ({quantity} sản phẩm)</p><p className="text-lg font-bold tracking-tight text-cta sm:text-xl lg:text-lg">{formatCurrency(total)}</p></div>
          <button type="button" disabled className="flex h-10 min-w-35 cursor-not-allowed items-center justify-center rounded-md bg-cta px-5 text-sm font-semibold text-cta-foreground transition-colors disabled:opacity-65 lg:mt-5 lg:w-full">Mua hàng</button>
        </div>
      </div>
    </aside>
  );
}
