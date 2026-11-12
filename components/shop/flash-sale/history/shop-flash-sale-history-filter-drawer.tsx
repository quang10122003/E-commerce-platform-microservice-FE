"use client";

import type { ShopCompletedFlashSaleQuery } from "@/types/shop/flash-sale";
import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";
import { useFilterDrawer } from "@/hooks/shared/useFilterDrawer";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useShopFlashSaleHistory } from "@/hooks/shop/flash-sale/useShopFlashSaleHistory";
import { ShopFlashSaleHistoryFilters } from "./shop-flash-sale-history-filters";

// Mở bộ lọc lịch sử trong panel trượt giống danh sách Flash Sale trên tablet và mobile.
export function ShopFlashSaleHistoryFilterDrawer({ query }: { query: ShopCompletedFlashSaleQuery }) {
  const { isOpen, open, close } = useFilterDrawer();
  const mounted = useMounted();
  const filters = useShopFlashSaleHistory(query, false);

  return (
    <div className="lg:hidden">
      {/* Nút icon thay cho bộ lọc hiển thị trực tiếp trên màn hình nhỏ. */}
      <button type="button" onClick={open} aria-label="Mở bộ lọc" aria-expanded={isOpen}
        className="flex h-10 items-center gap-1.5 rounded-lg border border-surface-border bg-surface-card px-3 text-xs font-semibold text-main transition hover:bg-surface-subtle active:scale-95">
        <Filter className="size-3.5 text-cta" aria-hidden="true" />Bộ lọc
      </button>

      {/* Portal giữ panel phía trên layout và thanh điều hướng. */}
      {mounted && createPortal(
        <div className={cn("fixed inset-0 z-[9999] lg:hidden transition-all duration-300", isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none")}>
          <button type="button" aria-label="Đóng bộ lọc" onClick={close}
            className={cn("absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")} />
          <section aria-label="Bộ lọc lịch sử Flash Sale" className={cn("absolute inset-y-0 right-0 flex w-80 max-w-[88vw] flex-col overflow-hidden bg-surface-card shadow-2xl transition-transform duration-300", isOpen ? "translate-x-0" : "translate-x-full")}>
            {/* Tiêu đề và thao tác đóng panel. */}
            <header className="flex items-center justify-between shrink-0 border-b border-surface-border p-4">
              <h2 className="flex items-center gap-2 font-semibold text-main"><Filter className="size-4 text-cta" aria-hidden="true" />Bộ lọc</h2>
              <button type="button" onClick={close} aria-label="Đóng panel bộ lọc" className="flex size-10 items-center justify-center rounded-lg hover:bg-surface-subtle"><X className="size-5" aria-hidden="true" /></button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
              <ShopFlashSaleHistoryFilters
                keyword={filters.keyword} onKeywordChange={filters.handleKeywordChange}
                fromDate={filters.fromDate} onFromDateChange={filters.handleFromDateChange}
                toDate={filters.toDate} onToDateChange={filters.handleToDateChange}
                quickFilter={filters.quickFilter} onQuickFilterSelect={filters.handleQuickFilterSelect}
                idPrefix="history-mobile" inDrawer error={filters.error}
              />
            </div>
            {/* Áp dụng các ngày đã chọn rồi đóng panel. */}
            <footer className="shrink-0 border-t border-surface-border p-4">
              <Button type="button" onClick={() => filters.applyFilters(close)} disabled={filters.isPending}
                variant="primary" className="w-full rounded-lg shadow-none hover:shadow-none">Áp dụng bộ lọc</Button>
            </footer>
          </section>
        </div>, document.body,
      )}
    </div>
  );
}
