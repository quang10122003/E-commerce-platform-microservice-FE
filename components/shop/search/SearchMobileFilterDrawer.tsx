"use client";

import { createPortal } from "react-dom";
import { Filter, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks";
import type { ProductBrandOption } from "@/types/product";
import { SearchFilterPanel } from "./SearchFilterPanel";

type SearchMobileFilterDrawerProps = {
  isOpen: boolean;
  hasActiveFilters: boolean;
  isPending: boolean;
  matchedBrands: ProductBrandOption[];
  brandIds: number[];
  minPriceInput: string;
  maxPriceInput: string;
  priceError: string | null;
  onClose: () => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onPriceSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBrandChange: (id: number) => void;
  onClearBrands: () => void;
  onClearFilters: () => void;
};

// Drawer bộ lọc tìm kiếm trượt từ phải vào — chỉ hiển thị trên mobile.
export function SearchMobileFilterDrawer({
  isOpen,
  hasActiveFilters,
  isPending,
  matchedBrands,
  brandIds,
  minPriceInput,
  maxPriceInput,
  priceError,
  onClose,
  onMinPriceChange,
  onMaxPriceChange,
  onPriceSubmit,
  onBrandChange,
  onClearBrands,
  onClearFilters,
}: SearchMobileFilterDrawerProps) {
  const mounted = useMounted();

  if (!mounted) return null;

  // Bọc submit giá để tự đóng drawer sau khi áp dụng thành công.
  const handlePriceSubmitAndClose = (event: React.FormEvent<HTMLFormElement>) => {
    onPriceSubmit(event);
    // Chỉ đóng khi không có lỗi giá — kiểm tra qua event bị prevent hay không.
    // onPriceSubmit đã gọi preventDefault nên nếu không có lỗi thì navigate xảy ra.
    onClose();
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] lg:hidden transition-all duration-300",
        isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none"
      )}
    >
      {/* Nền mờ Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Bảng trượt Drawer */}
      <div
        className={cn(
          "fixed top-0 bottom-0 right-0 w-80 max-w-[88vw] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out z-[10000]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header Drawer */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-cta" />
            <h3 className="text-sm font-bold text-main uppercase">Bộ lọc tìm kiếm</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-main hover:bg-slate-100 transition-colors"
            aria-label="Đóng bộ lọc"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nội dung lọc cuộn dọc */}
        <div className="flex-1 overflow-y-auto p-4">
          <SearchFilterPanel
            mobile
            matchedBrands={matchedBrands}
            brandIds={brandIds}
            isPending={isPending}
            minPriceInput={minPriceInput}
            maxPriceInput={maxPriceInput}
            priceError={priceError}
            hasActiveFilters={hasActiveFilters}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
            onPriceSubmit={handlePriceSubmitAndClose}
            onBrandChange={onBrandChange}
            onClearBrands={onClearBrands}
            onClearFilters={onClearFilters}
          />
        </div>

        {/* Footer Drawer: nút Thiết lập lại và Đóng. */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-2">
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                onClearFilters();
                onClose();
              }}
              disabled={isPending}
              className="flex-1 h-10 rounded-xs border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition disabled:opacity-50"
            >
              Thiết lập lại
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-10 rounded-xs bg-cta text-xs font-bold uppercase text-white shadow-glow-cta hover:bg-cta-hover transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
