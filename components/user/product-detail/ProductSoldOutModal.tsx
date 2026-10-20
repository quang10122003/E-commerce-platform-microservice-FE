"use client";

import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProductSoldOutModal } from "@/hooks/user/product-detail/useProductSoldOutModal";

// Phủ xám toàn màn hình và thông báo khi tất cả variant của sản phẩm đều hết tồn kho.
export function ProductSoldOutModal({ isSoldOut }: { isSoldOut: boolean }) {
  const { dialogRef, handleAcknowledge } = useProductSoldOutModal(isSoldOut);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="product-sold-out-title"
      aria-describedby="product-sold-out-description"
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl border border-surface-border-strong bg-surface-subtle p-0 text-main shadow-lg backdrop:bg-slate-900/55"
    >
      {/* Block thông báo giữa màn hình dùng tông Slate đồng nhất với lớp nền xám. */}
      <div className="relative px-6 py-7 text-center sm:px-8 sm:py-8">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-surface-border-strong bg-surface-muted text-muted-foreground">
          <PackageX className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2 id="product-sold-out-title" className="text-balance text-lg font-semibold leading-snug">Sản phẩm tạm thời hết hàng</h2>
        <p id="product-sold-out-description" className="mt-2 text-sm leading-relaxed text-muted-foreground">Bạn vui lòng quay lại sau.</p>
        <Button type="button" variant="outline" onClick={handleAcknowledge} className="mt-6 w-full border-surface-border-strong bg-surface-card text-main hover:bg-surface-muted">Đã hiểu</Button>
      </div>
    </dialog>
  );
}
