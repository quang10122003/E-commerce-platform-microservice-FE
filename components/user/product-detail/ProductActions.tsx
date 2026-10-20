"use client";

import { useProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";
import { Minus, Plus, ShoppingCart, Zap, Share2, Check } from "lucide-react";
import { cn, formatNumberInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Khu vực chọn phân loại, số lượng và nút hành động mua hàng.
export function ProductActions({ mobileAction }: { mobileAction?: "cart" | "buy" }) {
  const {
    attributes, selectedAttributeValueIds, selectableAttributeValueIds, selectedVariant, selectAttribute,
    quantity, isQuantityDisabled, canDecrease, canIncrease, handleDecrement, handleIncrement,
    handleAddToCart, isAddingToCart, cartValidationMessage,
  } = useProductDetailContext();

  return (
    <div className="flex flex-col gap-5">
      {/* Chọn thuộc tính thật; tổ hợp mặc định được dùng chung cho desktop và mobile. */}
      {attributes.map((attribute) => (
        <div key={attribute.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-3">
          <span className="pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {attribute.name}
          </span>
          <div className="flex flex-wrap gap-2.5">
            {attribute.values.map((value) => (
              <button
                key={value.id}
                type="button"
                onClick={() => selectAttribute(attribute.id, value.id)}
                disabled={!selectableAttributeValueIds.has(value.id)}
                title={selectableAttributeValueIds.has(value.id) ? value.value : `${value.value} — Không có tổ hợp còn hàng`}
                aria-pressed={selectedAttributeValueIds.includes(value.id)}
                className={`group relative flex min-h-9 items-center gap-2 rounded-lg border-2 px-3 py-2 text-xs font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-surface-border disabled:hover:bg-surface-muted ${
                  selectedAttributeValueIds.includes(value.id)
                    ? "border-primary bg-primary-light text-primary"
                    : "border-surface-border bg-surface-card text-muted-foreground hover:border-primary/40 hover:bg-surface-subtle"
                }`}
              >
                {value.value}
                {selectedAttributeValueIds.includes(value.id) && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Bộ điều chỉnh số lượng và tồn kho. */}
      <div className="flex items-center gap-4 max-sm:flex-wrap md:max-lg:flex-wrap md:max-lg:gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Số lượng
        </span>
        <div className={cn("flex items-center overflow-hidden rounded-lg border border-slate-200", isQuantityDisabled ? "bg-surface-muted" : "bg-surface-card")}>
          <button
            type="button"
            aria-label="Giảm số lượng"
            onClick={handleDecrement}
            disabled={!canDecrease}
            className="flex h-9 w-9 items-center justify-center border-r border-slate-200 text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40"
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <span className={cn("w-12 text-center text-sm font-bold", isQuantityDisabled ? "text-placeholder" : "text-main")}>{quantity}</span>
          <button
            type="button"
            aria-label="Tăng số lượng"
            onClick={handleIncrement}
            disabled={!canIncrease}
            className="flex h-9 w-9 items-center justify-center border-l border-slate-200 text-slate-500 transition hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>
        <span className="text-xs text-muted-foreground">
          <span className={cn("font-semibold", isQuantityDisabled ? "text-placeholder" : "text-perk")}>{formatNumberInput(selectedVariant?.stockQuantity ?? 0)}</span> sản phẩm có sẵn
        </span>
      </div>

      {/* Nút mua trên màn hình lớn; bảng mobile hiện nút theo thao tác đã chọn. */}
      <div className={`${mobileAction ? "flex" : "hidden"} gap-3 sm:flex sm:flex-row md:max-lg:flex-col`}>
        <Button
          type="button"
          onClick={handleAddToCart}
          isLoading={isAddingToCart}
          disabled={Boolean(cartValidationMessage)}
          title={cartValidationMessage ?? undefined}
          variant="cta-outline"
          size="lg"
          className={`flex-1 md:max-lg:flex-none ${mobileAction === "cart" ? "max-sm:flex-none max-sm:w-full" : "max-sm:hidden"}`}
          leftIcon={<ShoppingCart className="h-4 w-4" />}
        >
          Thêm vào giỏ hàng
        </Button>
        <Button
          type="button"
          disabled={Boolean(cartValidationMessage)}
          title={cartValidationMessage ?? undefined}
          variant="gradient-cta"
          size="lg"
          className={`flex-1 md:max-lg:flex-none ${mobileAction === "buy" ? "max-sm:flex-none max-sm:w-full" : "max-sm:hidden"}`}
          leftIcon={mobileAction ? undefined : <Zap className="h-4 w-4" />}
        >
          Mua ngay
        </Button>
      </div>

      {/* Nút chia sẻ giữ giao diện, chưa nối chức năng. */}
      <div className="flex items-center gap-3 border-t border-slate-100 pt-3">

        <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-main">
          <Share2 className="h-4 w-4" />
          Chia sẻ
        </button>
      </div>
    </div>
  );
}
