"use client";

import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui";
import { useProductSearch } from "@/hooks/useProductSearch";
import { getApiErrorMessage } from "@/lib/utils";
import type {
  ProductCatalogPage,
  ProductCatalogQuery,
  ProductSortOption,
} from "@/types/product";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchProductCard } from "./SearchProductCard";

type SearchProductListProps = {
  initialPage: ProductCatalogPage;
  query: ProductCatalogQuery;
  sort: ProductSortOption;
  isPendingFilter: boolean;
};

// Danh sách sản phẩm với infinite scroll — quản lý việc tải thêm kết quả.
export function SearchProductList({
  initialPage,
  query,
  sort,
  isPendingFilter,
}: SearchProductListProps) {
  const { error, hasNext, isFetching, prefetchRef, products, retryLoadMore } = useProductSearch({
    initialPage,
    query,
  });

  // Khi đang áp dụng bộ lọc mới: hiển thị lưới skeleton thay thế.
  if (isPendingFilter) {
    return (
      <div
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5"
        aria-busy="true"
        aria-label="Đang lọc danh sách sản phẩm"
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <div
            key={index}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card"
          >
            {/* Khung ảnh skeleton */}
            <div className="relative aspect-square w-full skeleton-shimmer" />
            {/* Khung thông tin skeleton */}
            <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
              <div className="space-y-1.5 min-h-[38px]">
                <div className="skeleton-shimmer h-3.5 w-full rounded-md" />
                <div className="skeleton-shimmer h-3.5 w-3/4 rounded-md" />
              </div>
              <div className="space-y-0.5 pt-0.5">
                <div className="flex items-baseline gap-1.5">
                  <div className="skeleton-shimmer h-4 w-20 rounded-md" />
                  <div className="skeleton-shimmer h-3 w-12 rounded-md" />
                </div>
              </div>
              <div className="skeleton-shimmer h-2.5 w-16 rounded-md" />
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                <div className="skeleton-shimmer h-3 w-10 rounded-md" />
                <div className="skeleton-shimmer h-3 w-16 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return <SearchEmptyState variant="no-result" />;
  }

  return (
    <>
      {/* Lưới sản phẩm responsive theo số cột phù hợp từng breakpoint. */}
      <div className="relative grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => (
          <SearchProductCard key={product.id} product={product} sort={sort} />
        ))}
        {/* Điểm tải thêm nằm ở 70% chiều cao lưới sản phẩm đã hiển thị. */}
        <span ref={prefetchRef} aria-hidden="true" className="pointer-events-none absolute left-0 top-[70%] h-px w-px" />
      </div>

      {/* Trạng thái tải thêm và thông báo cuối danh sách. */}
      <div className="flex min-h-12 items-center justify-center">
        {isFetching && (
          <span className="text-sm font-semibold text-cta">Đang tải thêm sản phẩm...</span>
        )}
        {!isFetching && !hasNext && (
          <span className="text-sm text-muted-foreground">Bạn đã xem hết kết quả.</span>
        )}
        {error && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4" />
            <span>{getApiErrorMessage(error, "Không thể tải thêm sản phẩm.")}</span>
            <Button type="button" variant="outline" size="sm" onClick={retryLoadMore}>
              Thử lại
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
