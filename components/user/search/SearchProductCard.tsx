import Image from "next/image";
import Link from "next/link";
import { MapPin, PackageSearch, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import type { ProductCatalogItem } from "@/types/user/product";
import { formatCountThreshold } from "@/utils/number.utils";

type SearchProductCardProps = {
  product: ProductCatalogItem;
  showBestSeller?: boolean;
};

// Dữ liệu bổ sung cố định khi API chưa trả đủ thông tin hiển thị.
const SEARCH_CARD_DEFAULTS = {
  rating: 4.8,
};

// Thẻ sản phẩm tĩnh trong trang tìm kiếm, render phía server.
export function SearchProductCard({ product, showBestSeller = true }: SearchProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex w-full min-w-0 max-w-[240px] justify-self-start flex-col overflow-hidden rounded-xl border border-surface-border bg-surface-card transition-colors duration-200 hover:border-primary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none"
    >
      {/* Ảnh và nhãn ngành hàng của sản phẩm. */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        ) : (
          <PackageSearch className="absolute inset-0 m-auto h-10 w-10 text-primary/30" />
        )}

        {/* Mức giảm cao nhất từ API, độc lập với variant có giá maxPrice. */}
        {(product.maxDiscountPercent ?? 0) > 0 && (
          <Badge variant="discount" size="sm" className="absolute right-2 top-2 z-10">
            -{product.maxDiscountPercent}%
          </Badge>
        )}

        {/* Nhãn bán chạy dành cho sản phẩm có tổng lượng bán từ 100 trở lên. */}
        {showBestSeller && (product.totalSold ?? 0) >= 100 && (
          <span className="absolute left-2 top-2 rounded bg-cta-light px-1.5 py-0.5 text-[10px] font-semibold text-danger-hover">
            Bán chạy
          </span>
        )}
      </div>

      {/* Tên, giá, địa điểm và số lượng bán của sản phẩm. */}
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-3.5">
        <h3 className="line-clamp-2 whitespace-normal break-normal text-xs font-semibold leading-snug text-main transition-colors group-hover:text-primary sm:text-sm">
          {product.name}
        </h3>

        {/* Giá từ API và lượng sản phẩm đã bán trên cùng một hàng. */}
        <div className="flex min-w-0 items-baseline justify-between gap-1.5">
          <span className="shrink-0 text-sm font-black text-cta sm:text-base">
            {formatCurrency(product.maxPrice)}
          </span>
          <span className="truncate text-[10px] font-medium text-muted-foreground" title={`${formatCountThreshold(product.totalSold ?? 0)} đã bán`}>
            {formatCountThreshold(product.totalSold ?? 0)} đã bán
          </span>
        </div>

        {/* Đánh giá sao và địa điểm xuất kho trên cùng một hàng. */}
        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px] text-muted-foreground">
          <div className="flex shrink-0 items-center gap-1">
            <Star className="h-3 w-3 fill-star text-star" />
            <span className="font-bold text-slate-700">{SEARCH_CARD_DEFAULTS.rating}</span>
          </div>
          {/* Địa điểm xuất kho từ API, báo rõ khi người bán chưa cập nhật. */}
          <div className="flex min-w-0 items-center gap-1 text-slate-400">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            <span className="truncate">{product.location?.trim() || "Chưa cập nhật"}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
