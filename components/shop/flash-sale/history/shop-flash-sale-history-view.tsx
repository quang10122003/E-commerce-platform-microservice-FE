"use client";

import { useShopFlashSaleHistory } from "@/hooks/shop/flash-sale/useShopFlashSaleHistory";
import type { ShopCompletedFlashSalePage, ShopCompletedFlashSaleQuery } from "@/types/shop/flash-sale";
import { ShopFlashSaleHistoryFilters } from "./shop-flash-sale-history-filters";
import { ShopFlashSaleHistoryTable } from "./shop-flash-sale-history-table";
import { ShopFlashSaleHistoryFilterDrawer } from "./shop-flash-sale-history-filter-drawer";
import { ShopFlashSaleHistorySearch } from "./shop-flash-sale-history-search";

// Ghép bộ lọc URL và dữ liệu lịch sử đã tải từ API.
export function ShopFlashSaleHistoryView({
  data,
  query,
  error,
}: {
  data: ShopCompletedFlashSalePage;
  query: ShopCompletedFlashSaleQuery;
  error?: string;
}) {
  const filters = useShopFlashSaleHistory(query);
  const filterProps = {
    keyword: filters.keyword,
    onKeywordChange: filters.handleKeywordChange,
    fromDate: filters.fromDate,
    onFromDateChange: filters.handleFromDateChange,
    toDate: filters.toDate,
    onToDateChange: filters.handleToDateChange,
    quickFilter: filters.quickFilter,
    onQuickFilterSelect: filters.handleQuickFilterSelect,
  };

  return (
    <div className="flex flex-1 flex-col gap-5 sm:gap-6" aria-busy={filters.isPending}>
      {/* Desktop giữ bộ lọc trực tiếp; tablet và mobile mở bằng icon. */}
      <div className="hidden lg:block">
        <ShopFlashSaleHistoryFilters {...filterProps} onDatesConfirmed={() => filters.applyFilters()} error={filters.error} />
      </div>
      {/* Tìm kiếm luôn ở ngoài panel; icon chỉ mở các bộ lọc thời gian. */}
      <div className="flex items-center gap-2 lg:hidden">
        <ShopFlashSaleHistorySearch id="history-mobile-search-keyword" keyword={filters.keyword} onKeywordChange={filters.handleKeywordChange} showLabel={false} />
        <ShopFlashSaleHistoryFilterDrawer key={JSON.stringify(query)} query={query} />
      </div>

      <ShopFlashSaleHistoryTable
        items={data.items}
        totalItems={data.totalItems}
        currentPage={data.page}
        pageSize={data.pageSize}
        onPageChange={filters.handlePageChange}
        error={error}
      />
    </div>
  );
}
