import { cn, formatCurrency } from "@/lib/utils";
import type { CartPricedItem } from "@/types/user/cart";
import { isCartItemAvailable } from "@/utils/cart.utils";

interface CartItemPriceViewProps {
  item: CartPricedItem;
  className?: string;
}

// Hiển thị riêng số lượng hưởng ưu đãi và số lượng tính giá thường trên mọi màn hình.
export function CartItemPriceView({ item, className }: CartItemPriceViewProps) {
  const isAvailable = isCartItemAvailable(item);
  if (item.pricingPending) {
    return <span role="status" className={cn("text-[11px] text-muted-foreground", className)}>Đang cập nhật giá...</span>;
  }
  return (
    <span className={cn("inline-flex flex-col items-end gap-1 tabular-nums", className)}>
      {item.hasSale ? (
        <span className="inline-flex flex-col items-end gap-0.5">
          <del className={cn("text-[11px]", isAvailable ? "text-muted-foreground" : "text-placeholder")}>{formatCurrency(item.price)}</del>
          <span className={cn("whitespace-nowrap font-semibold", isAvailable ? "text-cta" : "text-placeholder")}>
            {item.regularQuantity > 0 ? `${item.saleQuantity} × ` : null}{formatCurrency(item.effectivePrice)}
          </span>
        </span>
      ) : null}
      {item.regularQuantity > 0 ? (
        <span className={cn("whitespace-nowrap", isAvailable ? "text-main" : "text-placeholder")}>
          {item.hasSale ? `${item.regularQuantity} × ` : null}{formatCurrency(item.price)}
        </span>
      ) : null}
    </span>
  );
}
