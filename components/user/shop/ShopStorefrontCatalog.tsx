import { ArrowRight, PackageSearch } from "lucide-react";
import { SearchProductCard } from "@/components/user/search/SearchProductCard";
import { shopProducts } from "./shop-storefront.mock";
import { ShopStorefrontFilterDrawer } from "./ShopStorefrontFilterDrawer";
import type { CategoryResponse } from "@/types/shared/category";
import type { ShopProductPage, ShopProductQuery } from "@/types/user/shop";
import { ShopStorefrontCategories, ShopStorefrontSortOptions } from "./ShopCatalogFilters";
import { ShopProductSearch } from "./ShopProductSearch";
import { ShopProductPagination } from "./ShopProductPagination";
import { ShopProductsSkeleton } from "./ShopProductsSkeleton";

// Dùng lại card catalog để giao diện shop đồng nhất với tìm kiếm và trang chủ.
export function ShopStorefrontFeatured() {
  return (
    <section className="rounded-xl border border-surface-border bg-surface-card p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div><h2 className="font-heading text-lg font-bold text-main">Lựa chọn được yêu thích</h2><p className="mt-1 text-xs text-muted-foreground">Những thiết bị nổi bật tại SmartX</p></div>
        <label htmlFor="shop-tab-products" className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1 text-xs font-semibold text-primary hover:underline">Xem tất cả<ArrowRight className="size-3.5" /></label>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 xl:grid-cols-6 [&>a]:max-w-none [&>a]:justify-self-stretch [&_h3]:min-h-[2lh]">
        {shopProducts.slice(0, 6).map((product) => <SearchProductCard key={product.id} product={product} showBestSeller={false} />)}
      </div>
    </section>
  );
}

// Lưới và phân trang dùng dữ liệu server; lỗi API không thay bằng sản phẩm mock.
export function ShopStorefrontCatalog({ categories, shopId, query, data }: {
  categories: CategoryResponse[]; shopId: number; query: ShopProductQuery; data: ShopProductPage | null;
}) {
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

        {/* Transition đang request thì hiện skeleton, ẩn cả dữ liệu và phân trang cũ. */}
        <ShopProductsSkeleton />
        <div className="group-has-[[data-shop-products-pending=true]]/catalog:hidden">
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
