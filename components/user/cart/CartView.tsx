"use client";

import { Check, Store } from "lucide-react";
import { EmptyCartView } from "@/components/user/cart/EmptyCartView";
import { CartErrorView } from "@/components/user/cart/CartErrorView";
import { CartItemView } from "@/components/user/cart/CartItemView";
import { CartSummary } from "@/components/user/cart/CartSummary";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { Loading } from "@/components/ui";
import { isCartItemAvailable } from "@/utils/cart.utils";
import type { CartResponse } from "@/types/cart";

interface CartViewProps {
  initialCart: CartResponse | null;
  loadError: boolean;
}

// Hiển thị dữ liệu ban đầu từ server cùng các thao tác cập nhật ở client.
export function CartView({ initialCart, loadError }: CartViewProps) {
  const { items, groups, summary, pending, loadingLabel, refreshCart, changeQuantity, deleteItem } = useCart(initialCart);

  if (loadError) {
    return <CartErrorView pending={pending} onRetry={refreshCart} />;
  }

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div className="mx-auto grid max-w-[1440px] gap-3 pb-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
      {/* Chặn thao tác lặp khi xóa hoặc đổi số lượng đang được xử lý. */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-main/20 p-4 backdrop-blur-[2px]">
          <Loading label={loadingLabel} className="min-h-0 w-full max-w-xs border-surface-border bg-surface-card shadow-none" />
        </div>
      )}
      {/* Danh sách sản phẩm chiếm cột chính trên màn hình PC. */}
      <div className="min-w-0 space-y-3">
        {/* Hàng tiêu đề giữ cùng nhịp cột với các dòng sản phẩm. */}
        <div className="hidden grid-cols-[minmax(0,1fr)_110px_120px_110px_60px] items-center gap-3 rounded-lg border border-surface-border bg-surface-card px-5 py-3 text-center text-xs text-muted-foreground xl:sticky xl:top-[86px] xl:z-30 xl:grid">
          <span className="inline-flex items-center gap-3 text-left text-main"><span className="flex h-4 w-4 items-center justify-center rounded-sm bg-primary text-primary-foreground"><Check className="h-3 w-3" /></span> Sản phẩm</span>
          <span>Đơn giá</span><span>Số lượng</span><span>Số tiền</span><span>Thao tác</span>
        </div>
        {/* Các dòng sản phẩm được nhóm theo shopId từ response BE. */}
        {groups.map((group) => {
          const selected = group.items.every(isCartItemAvailable);
          return (
            <section key={group.shopId} className="overflow-hidden rounded-lg border border-surface-border bg-surface-card" aria-label={`Sản phẩm từ ${group.name}`}>
              <div className="flex items-center gap-3 border-b border-surface-border px-4 py-3 sm:px-5">
                <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-sm", selected ? "bg-primary text-primary-foreground" : "border border-surface-border bg-surface-card")}>{selected && <Check className="h-3 w-3" />}</span>
                <Store className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-sm font-semibold text-main">{group.name}</span>
              </div>
              {group.items.map((item) => <CartItemView key={item.cartItemId} item={item} pending={pending} onChangeQuantity={changeQuantity} onDelete={deleteItem} />)}
            </section>
          );
        })}
      </div>
      <CartSummary {...summary} />
    </div>
  );
}
