"use client";

import { useState } from "react";
import { Filter } from "lucide-react";

import { useProductSearchFilters } from "@/hooks/useProductSearchFilters";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductSortOption,
} from "@/types/product";
import { SearchEmptyState } from "./search/SearchEmptyState";
import { SearchFilterPanel } from "./search/SearchFilterPanel";
import { SearchMobileFilterDrawer } from "./search/SearchMobileFilterDrawer";
import { SearchProductList } from "./search/SearchProductList";
import { SearchResultHeader } from "./search/SearchResultHeader";
import { SearchSortBar } from "./search/SearchSortBar";

type ProductSearchResultsViewProps = {
  initialPage: ProductCatalogPage;
  keyword: string;
  sort: ProductSortOption;
  brandIds: number[];
  minPrice?: number;
  maxPrice?: number;
};

// Trang tìm kiếm: compose các sub-component, truyền filter state xuống qua props.
export function ProductSearchResultsView({
  initialPage,
  keyword,
  sort,
  brandIds,
  minPrice,
  maxPrice,
}: ProductSearchResultsViewProps) {
  // Trạng thái mở/đóng Drawer bộ lọc trên thiết bị di động.
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const {
    handleBrandChange,
    handleClearBrands,
    handleClearFilters,
    handlePriceSubmit,
    handleSortChange,
    isPending,
    maxPriceInput,
    minPriceInput,
    priceError,
    setMaxPriceInput,
    setMinPriceInput,
  } = useProductSearchFilters({ sort, brandIds, minPrice, maxPrice });

  const matchedBrands = initialPage.brands ?? [];
  const query: ProductCatalogQuery = {
    keyword: keyword || undefined,
    sort,
    brandIds,
    minPrice,
    maxPrice,
    size: 20,
  };
  const hasActiveFilters =
    sort !== "RELEVANCE" ||
    brandIds.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined;

  // Hiển thị trạng thái rỗng khi chưa có từ khoá.
  if (!keyword) return <SearchEmptyState variant="no-keyword" />;

  // Props dùng chung cho FilterPanel ở cả desktop sidebar và mobile drawer.
  const filterPanelProps = {
    matchedBrands,
    brandIds,
    isPending,
    minPriceInput,
    maxPriceInput,
    priceError,
    hasActiveFilters,
    onMinPriceChange: setMinPriceInput,
    onMaxPriceChange: setMaxPriceInput,
    onPriceSubmit: handlePriceSubmit,
    onBrandChange: handleBrandChange,
    onClearBrands: handleClearBrands,
    onClearFilters: handleClearFilters,
  };

  return (
    <section className="space-y-3">
      <SearchResultHeader keyword={keyword} />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-start pt-1">
        {/* Sidebar bộ lọc — chỉ hiển thị trên desktop. */}
        <aside className="hidden lg:block space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center gap-2 border-b border-slate-200/90 pb-3">
            <Filter className="h-4 w-4 text-slate-700" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Bộ lọc tìm kiếm
            </h2>
          </div>
          <SearchFilterPanel {...filterPanelProps} />
        </aside>

        {/* Cột nội dung chính: sort bar + danh sách sản phẩm. */}
        <div className="min-w-0 space-y-4">
          <SearchSortBar
            sort={sort}
            isPending={isPending}
            hasActiveFilters={hasActiveFilters}
            onSortChange={handleSortChange}
            onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
          />
          <SearchProductList
            initialPage={initialPage}
            query={query}
            sort={sort}
            isPendingFilter={isPending}
          />
        </div>
      </div>

      {/* Drawer bộ lọc trên mobile — render qua Portal. */}
      <SearchMobileFilterDrawer
        {...filterPanelProps}
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
      />
    </section>
  );
}
