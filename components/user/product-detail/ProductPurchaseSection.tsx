"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle, ShoppingCart, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useProductPurchaseSection } from "@/hooks/user/product-detail/useProductPurchaseSection";
import { ProductActions } from "./ProductActions";
import { ProductPurchasePreview } from "./ProductPurchasePreview";

// Giữ block mua hàng trên màn hình lớn và dùng bảng trượt riêng trên mobile.
export function ProductPurchaseSection({ children }: { children: ReactNode }) {
  const { purchaseAction, purchaseDialogRef, openPurchase, closePurchase, handleBackdropClick } =
    useProductPurchaseSection();

  return (
    <>
      {/* Giá và thuộc tính giữ nguyên vị trí trên tablet và desktop. */}
      <div className="hidden flex-col gap-5 sm:flex md:max-lg:gap-4">
        {children}
        {/* Chọn màu sắc, phiên bản, số lượng và nút mua. */}
        <ProductActions />
      </div>

      {/* Bảng mobile nằm trên trang, không chèn nội dung hay cuộn trang nền. */}
      <dialog
        id="product-purchase-section"
        ref={purchaseDialogRef}
        aria-labelledby="product-purchase-title"
        onCancel={closePurchase}
        onClick={handleBackdropClick}
        className="fixed inset-x-0 top-auto bottom-0 m-0 max-h-[85dvh] w-full max-w-none overflow-y-auto overscroll-contain rounded-t-xl border-0 bg-white p-0 text-main backdrop:bg-slate-900/50 motion-safe:[&[open]]:animate-purchase-slide-up motion-reduce:animate-none sm:hidden"
      >
        {/* Tiêu đề và nút đóng luôn nằm đầu bảng khi cuộn nội dung. */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-border bg-white px-4 py-3">
          <h2 id="product-purchase-title" className="text-base font-bold">
            Chọn thuộc tính sản phẩm
          </h2>
          <button
            type="button"
            onClick={closePurchase}
            aria-label="Đóng bảng chọn thuộc tính"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-bg focus-visible:outline-2 focus-visible:outline-primary"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {/* Giá, phân loại và số lượng dùng lại nội dung mua hàng hiện có. */}
        <div className="flex flex-col gap-4 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {/* Ảnh preview theo variant chỉ hiển thị trong bảng chọn thuộc tính mobile. */}
          <ProductPurchasePreview />
          {children}
          <ProductActions mobileAction={purchaseAction ?? "cart"} />
        </div>
      </dialog>

      {/* Thanh hành động mobile chừa safe area cho thiết bị có thanh home. */}
      <nav
        aria-label="Hành động mua sản phẩm"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-surface-border bg-white/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] backdrop-blur-md sm:hidden"
      >
        <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1.15fr)] gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("open-shop-chat"))}
            className="flex min-h-12 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold text-primary transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-primary active:bg-primary-light cursor-pointer"
          >
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
            Nhắn tin
          </button>
          <Button
            type="button"
            variant="cta-outline"
            onClick={() => openPurchase("cart")}
            aria-controls="product-purchase-section"
            aria-haspopup="dialog"
            aria-expanded={purchaseAction !== null}
            className="h-12 flex-col gap-1 rounded-lg px-2 text-xs"
            leftIcon={<ShoppingCart className="h-5 w-5" aria-hidden="true" />}
          >
            Thêm giỏ
          </Button>
          <Button
            type="button"
            variant="gradient-cta"
            onClick={() => openPurchase("buy")}
            aria-controls="product-purchase-section"
            aria-haspopup="dialog"
            aria-expanded={purchaseAction !== null}
            className="h-12 rounded-lg px-2 text-sm shadow-none hover:shadow-none"
          >
            Mua hàng
          </Button>
        </div>
      </nav>
    </>
  );
}
