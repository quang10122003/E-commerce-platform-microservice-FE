import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SuggestedProductCard } from "./suggested-product-card";
import { getNearbySellerPages } from "@/lib/utils/shop-product.utils";
import { getRecommendationsUrl } from "@/utils/recommendations.utils";
import type { ProductRecommendationsPage } from "@/types/user/product";

export function RecommendationsPageView({ data }: { data: ProductRecommendationsPage | null }) {
  const pageClass = "flex size-10 items-center justify-center rounded-lg border border-surface-border bg-surface-card text-sm text-main transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-primary";
  return (
    <div className="space-y-4">
      {!data ? (
        <p className="rounded-xl border border-surface-border bg-surface-card p-6 text-center text-sm text-muted-foreground">Sản phẩm gợi ý đang được cập nhật.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6">
            {data.items.map((product) => <SuggestedProductCard key={product.id} product={product} />)}
          </div>
          {data.items.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Chưa có sản phẩm gợi ý ở trang này.</p>}
          {data.totalPages > 0 && (
            <nav className="flex flex-wrap items-center justify-center gap-2 py-3" aria-label="Phân trang sản phẩm gợi ý">
              {data.page > 1 && <Link href={getRecommendationsUrl(data.page - 1, data.pageSize)} scroll={false} prefetch={false} aria-label="Trang trước" className={pageClass}><ChevronLeft className="size-4" /></Link>}
              {getNearbySellerPages(data.page, data.totalPages).map((page) => page === data.page
                ? <span key={page} aria-current="page" className="flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">{page}</span>
                : <Link key={page} href={getRecommendationsUrl(page, data.pageSize)} scroll={false} prefetch={false} aria-label={`Trang ${page}`} className={pageClass}>{page}</Link>)}
              {data.page < data.totalPages && <Link href={getRecommendationsUrl(data.page + 1, data.pageSize)} scroll={false} prefetch={false} aria-label="Trang sau" className={pageClass}><ChevronRight className="size-4" /></Link>}
            </nav>
          )}
        </>
      )}
    </div>
  );
}
