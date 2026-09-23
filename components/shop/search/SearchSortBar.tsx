"use client";

import { ArrowDownUp, Filter } from "lucide-react";

import type { ProductSortOption } from "@/types/product";

type SearchSortBarProps = {
  sort: ProductSortOption;
  isPending: boolean;
  hasActiveFilters: boolean;
  onSortChange: (sort: ProductSortOption) => void;
  onOpenMobileFilter: () => void;
};

// Thanh sắp xếp kết quả và nút kích hoạt bộ lọc trên mobile.
export function SearchSortBar({
  sort,
  isPending,
  hasActiveFilters,
  onSortChange,
  onOpenMobileFilter,
}: SearchSortBarProps) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xs bg-slate-100/90 px-3 sm:px-4 py-2">
      {/* Nhóm nút sắp xếp chính */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="hidden sm:inline-block mr-1 text-xs font-medium text-slate-600 sm:text-sm">
          Sắp xếp theo
        </span>
        <button
          type="button"
          onClick={() => onSortChange("RELEVANCE")}
          disabled={isPending}
          className={`h-8 rounded-xs px-3 sm:px-4 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
            sort === "RELEVANCE"
              ? "bg-cta text-white font-semibold"
              : "bg-white text-slate-800 hover:bg-white/80"
          }`}
        >
          Liên quan
        </button>
        <button
          type="button"
          onClick={() => onSortChange("MOST_SOLD")}
          disabled={isPending}
          className={`flex h-8 items-center gap-1.5 rounded-xs px-3 sm:px-4 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
            sort === "MOST_SOLD"
              ? "bg-cta text-white font-semibold"
              : "bg-white text-slate-800 hover:bg-white/80"
          }`}
        >
          <ArrowDownUp className="h-3.5 w-3.5" />
          Bán chạy
        </button>
      </div>

      {/* Thông báo đang cập nhật và nút mở bộ lọc mobile */}
      <div className="flex items-center gap-2 shrink-0">
        {isPending && (
          <span className="hidden sm:inline-block text-[11px] font-semibold text-cta">
            Đang cập nhật...
          </span>
        )}
        {/* Nút kích hoạt Drawer bộ lọc — chỉ hiển thị trên mobile. */}
        <button
          type="button"
          onClick={onOpenMobileFilter}
          className="lg:hidden relative flex h-8 items-center gap-1.5 rounded-xs bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs border border-slate-200/80 hover:bg-slate-50 transition active:scale-95"
          aria-label="Mở bộ lọc tìm kiếm"
        >
          <Filter className="h-3.5 w-3.5 text-cta" />
          <span>Bộ lọc</span>
          {/* Chấm xanh báo hiệu đang có bộ lọc được áp dụng. */}
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-cta animate-pulse" />
          )}
        </button>
      </div>
    </div>
  );
}
