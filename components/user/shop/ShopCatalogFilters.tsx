import { ShopProductNavigationLink as Link } from "./ShopProductNavigationLink";
import { ChevronDown, ChevronRight, ListFilter } from "lucide-react";
import type { CategoryResponse } from "@/types/shared/category";
import type { ShopProductQuery } from "@/types/user/shop";
import { getShopProductsUrl } from "@/utils/shop-products.utils";

const SHOP_VISIBLE_CATEGORIES = 7;
type ShopFilterProps = { shopId: number; query: ShopProductQuery };

// Giữ bộ lọc hiện tại và trả về trang đầu khi thay cách sắp xếp.
export function ShopStorefrontSortOptions({ shopId, query }: ShopFilterProps) {
  return (
    <>
      {([
        { label: "Liên quan", value: "RELEVANCE" },
        { label: "Mới nhất", value: "NEWEST" },
        { label: "Bán chạy", value: "MOST_SOLD" },
      ] as const).map(({ label, value }) => (
        <Link key={value} href={getShopProductsUrl(shopId, { ...query, sort: value, page: 1 })} scroll={false} prefetch={false} aria-current={query.sort === value ? "true" : undefined} className={`flex min-h-9 items-center rounded-md px-3 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-primary sm:px-4 ${query.sort === value ? "bg-primary text-primary-foreground" : "border border-surface-border bg-surface-card text-main hover:text-primary"}`}>{label}</Link>
      ))}
    </>
  );
}

// Danh mục lấy từ API dùng chung với home; dữ liệu rỗng thì ẩn cả tiêu đề lẫn danh sách.
export function ShopStorefrontCategories({ categories, shopId, query }: ShopFilterProps & { categories: CategoryResponse[] }) {
  if (categories.length === 0) return null;

  const categoryLinks = categories.map((category) => (
    <Link key={category.id} href={getShopProductsUrl(shopId, { ...query, categoryId: category.id, page: 1 })} scroll={false} prefetch={false} aria-current={query.categoryId === category.id ? "true" : undefined} className={`flex min-h-10 items-center rounded-lg px-3 text-sm transition-colors hover:bg-primary-light hover:text-primary ${query.categoryId === category.id ? "bg-primary-light font-semibold text-primary" : "text-muted-foreground"}`}>
      {category.name}
    </Link>
  ));

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 border-b border-surface-border pb-3 text-sm font-bold text-main"><ListFilter className="size-4" />Danh mục shop</h2>
      <nav className="space-y-1" aria-label="Danh mục sản phẩm của shop">
        <Link href={getShopProductsUrl(shopId, { ...query, categoryId: undefined, page: 1 })} scroll={false} prefetch={false} aria-current={!query.categoryId ? "true" : undefined} className={`flex min-h-10 items-center justify-between gap-2 rounded-lg px-3 text-sm transition-colors hover:bg-primary-light hover:text-primary ${!query.categoryId ? "bg-primary-light font-semibold text-primary" : "text-muted-foreground"}`}>Tất cả sản phẩm<ChevronRight className="size-3.5 shrink-0" /></Link>
        {categoryLinks.slice(0, SHOP_VISIBLE_CATEGORIES)}
        {/* Chỉ hiện thao tác mở rộng khi API còn danh mục ngoài bảy mục đầu. */}
        {categories.length > SHOP_VISIBLE_CATEGORIES && (
          <details className="group/categories flex flex-col">
            <div className="space-y-1">{categoryLinks.slice(SHOP_VISIBLE_CATEGORIES)}</div>
            <summary className="order-last mt-2 flex min-h-9 cursor-pointer list-none items-center justify-center gap-1.5 border-t border-surface-border px-2 pt-2 text-xs font-semibold text-primary transition-colors hover:text-primary-hover hover:underline focus-visible:outline-2 focus-visible:outline-primary">
              <span className="group-open/categories:hidden">Xem thêm ({categories.length - SHOP_VISIBLE_CATEGORIES})</span>
              <span className="hidden group-open/categories:inline">Thu nhỏ</span>
              <ChevronDown className="size-3.5 transition-transform group-open/categories:rotate-180 motion-reduce:transition-none" />
            </summary>
          </details>
        )}
      </nav>
    </section>
  );
}
