"use client";

import { PAGE_SIZE } from "@/lib/constants";

import { useFilterDrawer } from "@/hooks/shared/useFilterDrawer";
import { Filter } from "lucide-react";

import { useProductSearchFilters } from "@/hooks/user/search/useProductSearchFilters";
import type { ProductCatalogPage, ProductCatalogQuery, ProductSortOption } from "@/types/user/product";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchFilterPanel } from "./SearchFilterPanel";
import { SearchMobileFilterDrawer } from "./SearchMobileFilterDrawer";
import { SearchProductList } from "./SearchProductList";
import { SearchResultHeader } from "./SearchResultHeader";
import { SearchSortBar } from "./SearchSortBar";

type ProductSearchResultsViewProps = {
  initialPage: ProductCatalogPage;
  keyword: string;
  categoryId?: number;
  sort: ProductSortOption;
  brandIds: number[];
  locations: string[];
  minPrice?: number;
  maxPrice?: number;
};

// Trang tìm kiếm: compose các sub-component, truyền filter state xuống qua props.
export function ProductSearchResultsView({
  initialPage,
  keyword,
  categoryId,
  sort,
  brandIds,
  locations,
  minPrice,
  maxPrice,
}: ProductSearchResultsViewProps) {
  // Điều khiển panel bộ lọc trên thiết bị nhỏ.
  const { isOpen: isMobileFilterOpen, open: openFilter, close: closeFilter } = useFilterDrawer();

  const {
    handleBrandChange,
    handleClearBrands,
    handleClearFilters,
    handleLocationChange,
    handlePriceSubmit,
    handleSortChange,
    isPending,
    maxPriceInput,
    minPriceInput,
    priceError,
    setMaxPriceInput,
    setMinPriceInput,
  } = useProductSearchFilters({ sort, brandIds, locations, minPrice, maxPrice });

  const matchedBrands = initialPage.brands ?? [];
  const query: ProductCatalogQuery = {
    keyword: keyword || undefined,
    categoryId,
    sort,
    brandIds,
    locations,
    minPrice,
    maxPrice,
    size: PAGE_SIZE.PRODUCT_SEARCH,
  };
  const hasActiveFilters =
    sort !== "RELEVANCE" ||
    brandIds.length > 0 ||
    locations.length > 0 ||
    minPrice !== undefined ||
    maxPrice !== undefined;

  // Cho phép duyệt danh mục không có từ khóa, vẫn dùng đầy đủ bộ lọc hiện tại.
  if (!keyword && categoryId === undefined) return <SearchEmptyState variant="no-keyword" />;

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
    locations,
    onLocationChange: handleLocationChange,
    onClearFilters: handleClearFilters,
  };

  return (
    <section className="space-y-5">
      <SearchResultHeader keyword={keyword} categoryId={categoryId} />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start">
        {/* Sidebar bộ lọc desktop cuộn riêng khi nội dung vượt chiều cao màn hình. */}
        <aside className="hidden space-y-3 lg:sticky lg:top-24 lg:block lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:overscroll-y-contain lg:[scrollbar-width:none] lg:[&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 px-1">
            <Filter className="h-4 w-4 text-slate-700" />
            <h2 className="text-sm font-semibold text-slate-800">Bộ lọc</h2>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-3.5">
            <SearchFilterPanel {...filterPanelProps} />
          </div>
        </aside>

        {/* Cột nội dung chính: sort bar + danh sách sản phẩm. */}
        <div className="min-w-0 space-y-4">
          <SearchSortBar
            sort={sort}
            isPending={isPending}
            hasActiveFilters={hasActiveFilters}
            onSortChange={handleSortChange}
            onOpenMobileFilter={openFilter}
          />
          <SearchProductList
            key={JSON.stringify(query)}
            initialPage={initialPage}
            query={query}
            isPendingFilter={isPending}
          />
        </div>
      </div>

      {/* Drawer bộ lọc trên mobile — render qua Portal. */}
      <SearchMobileFilterDrawer
        {...filterPanelProps}
        isOpen={isMobileFilterOpen}
        onClose={closeFilter}
      />
    </section>
  );
}
