import Image from "next/image";
import { Minus, Plus, Package, Trash2 } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import type { CartItem, CartPricedItem } from "@/types/user/cart";
import { CartItemPriceView } from "./CartItemPriceView";
import { isCartItemAvailable } from "@/utils/cart.utils";

interface CartItemViewProps {
  item: CartPricedItem;
  pending: boolean;
  quantityPending: boolean;
  selected: boolean;
  onToggleSelection: (items: CartItem[]) => void;
  onChangeQuantity: (item: CartItem, delta: -1 | 1) => void;
  onDelete: (item: CartItem) => void;
}

// Hiển thị một sản phẩm và các thao tác số lượng, xóa trong giỏ hàng.
export function CartItemView({ item, pending, quantityPending, selected, onToggleSelection, onChangeQuantity, onDelete }: CartItemViewProps) {
  const isAvailable = isCartItemAvailable(item);
  const availabilityLabel = item.status === "INACTIVE" ? "Ngừng bán" : isAvailable ? "Còn hàng" : "Hết hàng";
  const canDecrease = isAvailable && !pending && !quantityPending && item.quantity > 1;
  const canIncrease = isAvailable && !pending && !quantityPending && item.quantity < item.stockQuantity;

  return (
    <article aria-label={`${item.productName} - ${availabilityLabel}`} className={cn("group grid grid-cols-[minmax(0,1fr)_64px] border-b border-surface-border last:border-b-0 sm:grid-cols-[minmax(0,1fr)_76px] xl:block", !isAvailable && "bg-surface-muted/70")}>
      {/* Thông tin sản phẩm giữ cùng nhịp cột với tiêu đề trên PC. */}
      <div className="grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-3 px-3 py-4 sm:px-5 xl:grid-cols-[minmax(0,1fr)_130px_120px_110px_60px] xl:text-center">
        <div className="col-span-2 flex min-w-0 items-center gap-2 text-left sm:gap-3 xl:col-span-1">
          <input type="checkbox" checked={selected} disabled={!isAvailable || pending}
            onChange={() => onToggleSelection([item])} aria-label={`Chọn ${item.productName}, mã ${item.cartItemId}`}
            className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-surface-border bg-surface-subtle xl:h-24 xl:w-24">
            {item.imageUrl ? (
              <Image src={item.imageUrl} alt={item.productName} fill unoptimized sizes="(min-width: 1280px) 96px, 80px" className={cn("object-cover transition-transform duration-300", isAvailable ? "group-hover:scale-105" : "grayscale opacity-45")} />
            ) : (
              <span className="flex h-full items-center justify-center text-muted-foreground"><Package className="h-6 w-6" aria-hidden="true" /></span>
            )}
          </div>
          <div className="min-w-0 flex-1 sm:grid sm:grid-cols-[minmax(0,1fr)_110px] sm:items-center sm:gap-3">
            <h2 className={cn("line-clamp-2 text-xs font-medium leading-snug sm:text-sm", isAvailable ? "text-main" : "text-placeholder")}>{item.productName}</h2>
            {item.hasOption && item.variantOptions.length > 0 && <p className="mt-1.5 inline-flex max-w-full rounded-sm bg-slate-100 px-2 py-1 text-[11px] text-slate-600 sm:mt-1">Phân loại: {item.variantOptions.map((option) => `${option.name} ${option.value}`).join(" · ")}</p>}
          </div>
        </div>
        {/* Phân bổ giá sale và giá thường theo số lượng BE trả về. */}
        <CartItemPriceView item={item} className="hidden justify-center px-2 text-xs xl:flex" />
        {/* Căn cụm số lượng với mép trái ảnh trên mobile và tablet. */}
        <div className="ml-6 flex justify-start sm:ml-7 xl:ml-0 xl:justify-center">
          <div className={cn("flex h-8 items-center overflow-hidden rounded-sm border border-surface-border text-xs", isAvailable ? "bg-surface-card text-main" : "bg-surface-muted text-placeholder")} aria-label={`Số lượng ${item.quantity}`}>
            <button type="button" disabled={!canDecrease} onClick={() => onChangeQuantity(item, -1)} aria-label={`Giảm số lượng ${item.productName}`} className="flex h-full w-8 cursor-pointer items-center justify-center transition-colors hover:bg-slate-100 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-placeholder"><Minus className="h-3 w-3" /></button>
            <span className="flex h-full min-w-8 items-center justify-center border-x border-surface-border">{item.quantity}</span>
            <button type="button" disabled={!canIncrease} onClick={() => onChangeQuantity(item, 1)} aria-label={`Tăng số lượng ${item.productName}`} className="flex h-full w-8 cursor-pointer items-center justify-center transition-colors hover:bg-slate-100 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary disabled:cursor-not-allowed disabled:text-placeholder"><Plus className="h-3 w-3" /></button>
          </div>
        </div>
        <div className="text-right xl:text-center">
          <span className={cn("block text-xs xl:hidden", isAvailable ? "text-muted-foreground" : "text-placeholder")}><CartItemPriceView item={item} /></span>
          <strong className={cn("block text-sm font-semibold", isAvailable ? "text-cta" : "text-placeholder")}>{item.pricingPending ? "—" : formatCurrency(item.lineTotal)}</strong>
        </div>
        <button type="button" disabled={pending} onClick={() => onDelete(item)} className="hidden cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-danger-hover transition-colors hover:bg-danger-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger xl:inline-flex disabled:cursor-not-allowed disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Xóa</button>
      </div>
      {/* Vùng thao tác nằm cạnh thông tin sản phẩm trên mobile và tablet. */}
      <button type="button" disabled={pending} onClick={() => onDelete(item)} className="flex w-full cursor-pointer items-center justify-center gap-1.5 border-l border-surface-border bg-rose-50 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-rose-600 disabled:cursor-not-allowed disabled:opacity-50 xl:hidden"><Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Xóa</button>
    </article>
  );
}
