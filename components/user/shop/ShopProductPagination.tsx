import { ShopProductNavigationLink as Link } from "./ShopProductNavigationLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import { getShopProductsUrl } from "@/utils/shop-products.utils";
import type { ShopProductPage, ShopProductQuery } from "@/types/user/shop";

// Phân trang từ metadata BE; giới hạn liên kết trong result window mà API chấp nhận.
export function ShopProductPagination({ shopId, query, data }: { shopId: number; query: ShopProductQuery; data: ShopProductPage }) {
  const totalPages = Math.min(data.totalPages, Math.floor(10_000 / query.size));
  if (totalPages <= 1) return null;
  const pageClass = "flex size-10 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-sm text-main transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary";

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 py-3" aria-label="Phân trang sản phẩm shop">
      {data.page > 1 ? <Link href={getShopProductsUrl(shopId, { ...query, page: Math.min(data.page - 1, totalPages) })} scroll={false} prefetch={false} aria-label="Trang trước" className={pageClass}><ChevronLeft className="size-4" /></Link> : <span aria-hidden="true" className={`${pageClass} opacity-40`}><ChevronLeft className="size-4" /></span>}
      {getNearbySellerPages(data.page, totalPages).map((page) => data.page === page
        ? <span key={page} aria-current="page" className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{page}</span>
        : <Link key={page} href={getShopProductsUrl(shopId, { ...query, page })} scroll={false} prefetch={false} aria-label={`Trang ${page}`} className={pageClass}>{page}</Link>)}
      {data.page < totalPages ? <Link href={getShopProductsUrl(shopId, { ...query, page: data.page + 1 })} scroll={false} prefetch={false} aria-label="Trang sau" className={pageClass}><ChevronRight className="size-4" /></Link> : <span aria-hidden="true" className={`${pageClass} opacity-40`}><ChevronRight className="size-4" /></span>}
    </nav>
  );
}
