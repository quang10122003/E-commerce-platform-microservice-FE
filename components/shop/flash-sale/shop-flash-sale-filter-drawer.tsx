"use client";

import type { ShopFlashSaleQuery } from "@/types/shop/flash-sale";
import { ShopFlashSaleFilters } from "./shop-flash-sale-filters";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";
import { useFilterDrawer } from "@/hooks/shared/useFilterDrawer";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Hiển thị bộ lọc trong panel trượt trên tablet và mobile.
export function ShopFlashSaleFilterDrawer({ query }: { query: ShopFlashSaleQuery }) {
  const { isOpen, open, close } = useFilterDrawer();
  const mounted = useMounted();

  return (
    <div className="lg:hidden">
      {/* Nút mở bộ lọc theo cách hiển thị của trang tìm kiếm. */}
      <button type="button" onClick={open} aria-label="Mở bộ lọc" aria-expanded={isOpen}
        className="flex h-10 items-center gap-1.5 rounded-lg border border-surface-border bg-surface-card px-3 text-xs font-semibold text-main transition hover:bg-surface-subtle active:scale-95">
        <Filter className="size-3.5 text-cta" aria-hidden="true" />Bộ lọc
      </button>
      {/* Portal giữ panel trượt nằm trên layout và thanh điều hướng. */}
      {mounted && createPortal(
        <div className={cn("fixed inset-0 z-[9999] lg:hidden transition-all duration-300", isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none")}>
          <button type="button" aria-label="Đóng bộ lọc" onClick={close}
            className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")} />
          <section aria-label="Bộ lọc chương trình" className={cn("absolute inset-y-0 right-0 flex w-80 max-w-[88vw] flex-col overflow-hidden bg-surface-card shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")}>
            {/* Tiêu đề và thao tác đóng panel. */}
            <header className="flex items-center justify-between shrink-0 border-b border-surface-border p-4">
              <h2 className="flex items-center gap-2 font-semibold text-main"><Filter className="size-4 text-cta" />Bộ lọc</h2>
              <button type="button" onClick={close} aria-label="Đóng panel bộ lọc" className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-subtle"><X className="size-5" /></button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4"><ShopFlashSaleFilters query={query} idPrefix="sale-mobile" immediate={false} onApplied={close} /></div>
            {/* Xác nhận lựa chọn bộ lọc trước khi đóng panel. */}
            <footer className="shrink-0 border-t border-surface-border p-4">
              <Button type="submit" form="sale-mobile-form" variant="primary" className="w-full rounded-lg shadow-none hover:shadow-none">Áp dụng bộ lọc</Button>
            </footer>
          </section>
        </div>, document.body,
      )}
    </div>
  );
}
