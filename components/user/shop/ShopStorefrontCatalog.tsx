"use client";

import { ArrowRight, PackageSearch } from "lucide-react";
import { SearchProductCard } from "@/components/user/search/SearchProductCard";
import { ShopStorefrontFilterDrawer } from "./ShopStorefrontFilterDrawer";
import type { CategoryResponse } from "@/types/shared/category";
import { useShopProducts, useShopTopProducts } from "@/hooks/user/shop/useShopProducts";
import { ShopStorefrontCategories, ShopStorefrontSortOptions } from "./ShopCatalogFilters";
import { ShopProductSearch } from "./ShopProductSearch";
import { ShopProductPagination } from "./ShopProductPagination";
import { ShopProductsSkeleton } from "./ShopProductsSkeleton";

// Sản phẩm nổi bật của shop qua Redux; đang tải hiện skeleton, lỗi hoặc shop chưa có sản phẩm thì ẩn khối.
export function ShopStorefrontFeatured({ shopId }: { shopId: number }) {
  const { products, isLoading, isError } = useShopTopProducts(shopId);
  if (isError || (!isLoading && products.length === 0)) return null;

  return (
    <section className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="font-heading text-lg font-bold text-main">Lựa chọn được yêu thích</h2><p className="mt-1 text-xs text-muted-foreground">Bán chạy và được đánh giá cao nhất của shop</p></div>
        <label htmlFor="shop-tab-products" className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline">Xem tất cả<ArrowRight className="size-3.5" /></label>
      </div>
      {isLoading ? <ShopProductsSkeleton visible count={10} className="xl:grid-cols-5" /> : (
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-5 [&>a]:max-w-none [&>a]:justify-self-stretch [&_h3]:min-h-[2lh]">
          {products.map((product) => <SearchProductCard key={product.id} product={product} showBestSeller={false} />)}
        </div>
      )}
    </section>
  );
}

// Lưới và phân trang lấy qua Redux theo bộ lọc trên URL; đang gọi API thì hiện skeleton, lỗi không thay bằng dữ liệu giả.
export function ShopStorefrontCatalog({ categories, shopId }: { categories: CategoryResponse[]; shopId: number }) {
  const { query, data, isFetching } = useShopProducts(shopId);

  return (
    <section id="shop-products" className="group/catalog grid scroll-mt-28 gap-5 lg:grid-cols-[200px_minmax(0,1fr)]">
      {/* Danh mục bên trái trên desktop; thiết bị nhỏ dùng drawer cạnh ô tìm kiếm. */}
      <aside className="hidden self-start space-y-4 rounded-xl border border-surface-border bg-surface-card p-4 lg:block">
        <ShopStorefrontCategories categories={categories} shopId={shopId} query={query} />
      </aside>

      <div className="min-w-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-xl font-bold text-main">Tất cả sản phẩm {data ? <span className="ml-1 text-sm font-normal text-muted-foreground">({data.totalItems})</span> : null}</h2>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <ShopProductSearch shopId={shopId} query={query} />
            <ShopStorefrontFilterDrawer>
              <ShopStorefrontCategories categories={categories} shopId={shopId} query={query} />
              <section className="border-t border-surface-border pt-4">
                <h3 className="mb-3 text-sm font-semibold text-main">Sắp xếp theo</h3>
                <div className="flex flex-wrap gap-2"><ShopStorefrontSortOptions shopId={shopId} query={query} /></div>
              </section>
            </ShopStorefrontFilterDrawer>
          </div>
        </div>

        {/* Bộ lọc giữ trên URL, số trang lấy từ metadata backend. */}
        <div className="hidden flex-wrap items-center gap-2 rounded-lg border border-surface-border bg-surface-muted p-3 lg:flex">
          <span className="mr-1 hidden text-xs text-muted-foreground sm:block">Sắp xếp theo</span>
          <ShopStorefrontSortOptions shopId={shopId} query={query} />
          {data && data.totalPages > 0 ? <span className="ml-auto text-xs text-muted-foreground"><span className="font-semibold text-primary">{data.page}</span> / {Math.min(data.totalPages, Math.floor(10_000 / query.size))}</span> : null}
        </div>

        {/* Đang chuyển URL hoặc đang gọi API thì hiện skeleton, ẩn cả dữ liệu và phân trang cũ. */}
        <ShopProductsSkeleton visible={isFetching} />
        <div className={isFetching ? "hidden" : "group-has-[[data-shop-products-pending=true]]/catalog:hidden"}>
          {/* Chỉ render sản phẩm thật; danh sách rỗng có trạng thái riêng, không dùng mock dự phòng. */}
          {data ? <>
            {data.items.length ? <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5 [&>a]:max-w-none [&>a]:justify-self-stretch [&_h3]:min-h-[2lh]">
              {data.items.map((product) => <SearchProductCard key={product.id} product={product} showBestSeller={false} />)}
            </div> : <div className="rounded-xl border border-surface-border bg-surface-card px-5 py-12 text-center">
              <PackageSearch className="mx-auto mb-3 size-9 text-primary" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-main">Chưa có sản phẩm phù hợp</p>
              <p className="mt-1 text-xs text-muted-foreground">Thử thay đổi từ khóa hoặc danh mục sản phẩm.</p>
            </div>}
            <ShopProductPagination shopId={shopId} query={query} data={data} />
          </> : null}
        </div>
      </div>
    </section>
  );
}
