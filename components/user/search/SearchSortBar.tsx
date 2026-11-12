"use client";

import { ArrowDownUp, Filter, Star, type LucideIcon } from "lucide-react";

import type { ProductSortOption } from "@/types/user/product";

type SearchSortBarProps = {
  sort: ProductSortOption;
  isPending: boolean;
  hasActiveFilters: boolean;
  onSortChange: (sort: ProductSortOption) => void;
  onOpenMobileFilter: () => void;
};

const SORT_OPTIONS: Array<{ value: ProductSortOption; label: string; icon?: LucideIcon }> = [
  { value: "RELEVANCE", label: "Liên quan" },
  { value: "MOST_SOLD", label: "Bán chạy", icon: ArrowDownUp },
  { value: "HIGHEST_RATED", label: "Đánh giá cao", icon: Star },
];

// Thanh sắp xếp kết quả và nút kích hoạt bộ lọc trên mobile.
export function SearchSortBar({
  sort,
  isPending,
  hasActiveFilters,
  onSortChange,
  onOpenMobileFilter,
}: SearchSortBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 sm:px-4">
      {/* Nhóm nút sắp xếp chính */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="mr-1 text-xs font-medium text-slate-600 sm:text-sm">
          Sắp xếp theo
        </span>
        {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onSortChange(value)}
            disabled={isPending}
            aria-pressed={sort === value}
            className={`flex h-9 items-center gap-1.5 rounded-md px-3 sm:px-4 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
              sort === value
                ? "bg-cta text-white font-semibold"
                : "bg-slate-50 text-slate-800 hover:bg-slate-100 hover:text-cta"
            }`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
            {label}
          </button>
        ))}
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
          className="lg:hidden relative flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-cta active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
