import Image from "next/image";
import { Check, Minus, Plus, Package } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem } from "@/types/cart";
import { isCartItemAvailable } from "@/utils/cart.utils";

interface CartItemViewProps {
  item: CartItem;
  pending: boolean;
  onChangeQuantity: (item: CartItem, delta: -1 | 1) => void;
  onDelete: (item: CartItem) => void;
}

// Hiển thị một sản phẩm và các thao tác số lượng, xóa trong giỏ hàng.
export function CartItemView({ item, pending, onChangeQuantity, onDelete }: CartItemViewProps) {
  const isAvailable = isCartItemAvailable(item);
  const availabilityLabel = item.status === "INACTIVE" ? "Ngừng bán" : isAvailable ? "Còn hàng" : "Hết hàng";
  const canDecrease = isAvailable && !pending && item.quantity > 1;
  const canIncrease = isAvailable && !pending && item.quantity < item.stockQuantity;

  return (
    <article aria-label={`${item.productName} - ${availabilityLabel}`} className={cn("group grid grid-cols-[minmax(0,1fr)_64px] border-b border-surface-border last:border-b-0 sm:grid-cols-[minmax(0,1fr)_76px] xl:block", !isAvailable && "bg-surface-muted/70")}>
      {/* Thông tin sản phẩm giữ cùng nhịp cột với tiêu đề trên PC. */}
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-3 py-4 sm:px-5 xl:grid-cols-[minmax(0,1fr)_110px_120px_110px_60px] xl:text-center">
        <div className="col-span-2 flex min-w-0 items-center gap-2 text-left sm:gap-3 xl:col-span-1">
          <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-sm", isAvailable ? "bg-primary text-primary-foreground" : "border border-surface-border-strong bg-surface-muted")}>
            {isAvailable && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
          </span>
          <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-sm border border-surface-border bg-surface-subtle sm:h-20 sm:w-20">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.productName} fill unoptimized sizes="(min-width: 640px) 80px, 72px" className={cn("object-cover transition-transform duration-500", isAvailable ? "group-hover:scale-105" : "grayscale opacity-45")} />
            ) : (
              <span className="flex h-full items-center justify-center text-muted-foreground"><Package className="h-6 w-6" aria-hidden="true" /></span>
            )}
          </div>
          <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,1fr)_110px] sm:items-center sm:gap-3">
            <h2 className={cn("line-clamp-2 text-xs font-medium leading-snug sm:text-sm", isAvailable ? "text-main" : "text-placeholder")}>{item.productName}</h2>
            {item.hasOption && item.variantOptions.length > 0 && <p className="mt-1 text-[11px] text-muted-foreground sm:mt-0">Phân loại: {item.variantOptions.map((option) => `${option.name} ${option.value}`).join(" · ")}</p>}
          </div>
        </div>
        <div className={cn("hidden text-sm xl:block", isAvailable ? "text-main" : "text-placeholder")}>{formatCurrency(item.price)}</div>
        {/* Căn cụm số lượng với mép trái ảnh trên mobile và tablet. */}
        <div className="ml-6 flex justify-start sm:ml-7 xl:ml-0 xl:justify-center">
          <div className={cn("flex h-8 items-center overflow-hidden rounded-sm border border-surface-border text-xs", isAvailable ? "bg-surface-card text-main" : "bg-surface-muted text-placeholder")} aria-label={`Số lượng ${item.quantity}`}>
            <button type="button" disabled={!canDecrease} onClick={() => onChangeQuantity(item, -1)} aria-label={`Giảm số lượng ${item.productName}`} className="flex h-full w-7 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:text-placeholder"><Minus className="h-3 w-3" /></button>
            <span className="flex h-full min-w-8 items-center justify-center border-x border-surface-border">{item.quantity}</span>
            <button type="button" disabled={!canIncrease} onClick={() => onChangeQuantity(item, 1)} aria-label={`Tăng số lượng ${item.productName}`} className="flex h-full w-7 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:text-placeholder"><Plus className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="text-right xl:text-center">
          <span className={cn("block text-[11px] xl:hidden", isAvailable ? "text-muted-foreground" : "text-placeholder")}>Đơn giá {formatCurrency(item.price)}</span>
          <strong className={cn("block text-xs font-semibold xl:text-sm", isAvailable ? "text-cta" : "text-placeholder")}>{formatCurrency(item.price * item.quantity)}</strong>
        </div>
        <button type="button" disabled={pending} onClick={() => onDelete(item)} className="hidden cursor-pointer text-xs text-danger-hover disabled:cursor-not-allowed disabled:opacity-50 xl:block">Xóa</button>
      </div>
      {/* Vùng thao tác nằm cạnh thông tin sản phẩm trên mobile và tablet. */}
      <button type="button" disabled={pending} onClick={() => onDelete(item)} className="flex w-full cursor-pointer items-center justify-center border-l border-surface-border bg-danger-light text-xs font-medium text-danger-hover disabled:cursor-not-allowed disabled:opacity-50 xl:hidden">Xóa</button>
    </article>
  );
}
