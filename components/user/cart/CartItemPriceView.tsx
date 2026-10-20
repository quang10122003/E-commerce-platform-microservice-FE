import { cn, formatCurrency } from "@/lib/utils";
import type { CartPricedItem } from "@/types/user/cart";
import { isCartItemAvailable } from "@/utils/cart.utils";

interface CartItemPriceViewProps {
  item: CartPricedItem;
  className?: string;
}

// Dùng chung đơn giá desktop/mobile; chỉ gạch giá gốc khi ưu đãi còn hiệu lực.
export function CartItemPriceView({ item, className }: CartItemPriceViewProps) {
  const isAvailable = isCartItemAvailable(item);
  return (
    <span className={cn("inline-flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5", className)}>
      {item.hasSale ? <del className={cn("text-[11px]", isAvailable ? "text-muted-foreground" : "text-placeholder")}>{formatCurrency(item.price)}</del> : null}
      <span className={cn(isAvailable ? item.hasSale ? "font-semibold text-cta" : "text-main" : "text-placeholder")}>
        {formatCurrency(item.effectivePrice)}
      </span>
    </span>
  );
}
