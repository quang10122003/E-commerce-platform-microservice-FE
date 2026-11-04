"use client";

import { Store } from "lucide-react";
import { EmptyCartView } from "@/components/user/cart/EmptyCartView";
import { CartErrorView } from "@/components/user/cart/CartErrorView";
import { CartItemView } from "@/components/user/cart/CartItemView";
import { CartSummary } from "@/components/user/cart/CartSummary";
import { useCart } from "@/hooks/user/cart/useCart";
import { Loading } from "@/components/ui";
import { isCartItemAvailable } from "@/utils/cart.utils";
import type { CartResponse } from "@/types/user/cart";

interface CartViewProps {
  initialCart: CartResponse | null;
  loadError: boolean;
}

// Hiển thị dữ liệu ban đầu từ server cùng các thao tác cập nhật ở client.
export function CartView({ initialCart, loadError }: CartViewProps) {
  const { items, groups, summary, pending, updatingVariantIds, loadingLabel, refreshCart, changeQuantity, deleteItem, selectedItemIds, allSelected, canSelect, toggleSelection, cartRef, stockErrors } = useCart(initialCart);

  if (loadError) {
    return <CartErrorView pending={pending} onRetry={refreshCart} />;
  }

  if (items.length === 0) {
    return <EmptyCartView />;
  }

  return (
    <div ref={cartRef} className="mx-auto max-w-[1440px] space-y-5 pb-20 sm:pb-10">
      {/* Giữ loading toàn trang cho thao tác xóa và tải lại thủ công. */}
      {pending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-main/20 p-4 backdrop-blur-[2px]">
          <Loading label={loadingLabel} className="min-h-0 w-full max-w-xs border-surface-border bg-surface-card shadow-none" />
        </div>
      )}
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_280px] xl:grid-cols-[minmax(0,1fr)_300px]">
      {/* Danh sách sản phẩm chiếm cột chính trên màn hình PC. */}
      <div className="min-w-0 space-y-3">
        {/* Hàng tiêu đề giữ cùng nhịp cột với các dòng sản phẩm. */}
        <div className="grid grid-cols-1 items-center gap-3 rounded-lg border border-surface-border bg-surface-card px-5 py-3 text-center text-xs text-muted-foreground xl:sticky xl:top-[86px] xl:z-30 xl:grid-cols-[minmax(0,1fr)_130px_120px_110px_60px]">
          <label className="inline-flex cursor-pointer items-center gap-3 text-left text-main">
            <input type="checkbox" checked={allSelected} disabled={!canSelect || pending} onChange={() => toggleSelection(items)} aria-label="Chọn tất cả sản phẩm"
              className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
            <span>Chọn tất cả sản phẩm</span>
          </label>
          <span className="hidden xl:block">Đơn giá</span><span className="hidden xl:block">Số lượng</span><span className="hidden xl:block">Số tiền</span><span className="hidden xl:block">Thao tác</span>
        </div>
        {/* Các dòng sản phẩm được nhóm theo shopId từ response BE. */}
        {groups.map((group) => {
          const availableItems = group.items.filter(isCartItemAvailable);
          const selected = availableItems.length > 0 && availableItems.every((item) => selectedItemIds.has(item.cartItemId));
          return (
            <section key={group.shopId} className="overflow-hidden rounded-lg border border-surface-border bg-surface-card" aria-label={`Sản phẩm từ ${group.name}`}>
              <div className="flex items-center gap-3 border-b border-surface-border bg-slate-50/80 px-4 py-3.5 sm:px-5">
                <input type="checkbox" checked={selected} disabled={availableItems.length === 0 || pending} onChange={() => toggleSelection(group.items)} aria-label={`Chọn sản phẩm từ ${group.name}`}
                  className="h-4 w-4 shrink-0 cursor-pointer rounded-sm accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary"><Store className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" /></span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-main">{group.name}</h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{group.items.length} sản phẩm</p>
                </div>
              </div>
              {group.items.map((item) => <CartItemView key={item.cartItemId} item={item} stockError={stockErrors[item.cartItemId]} pending={pending} quantityPending={updatingVariantIds.has(item.productVariantId)} selected={selectedItemIds.has(item.cartItemId)} onToggleSelection={toggleSelection} onChangeQuantity={changeQuantity} onDelete={deleteItem} />)}
            </section>
          );
        })}
      </div>
      <CartSummary {...summary} />
      </div>
    </div>
  );
}
