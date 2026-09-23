import Image from "next/image";
import Link from "next/link";
import { MapPin, PackageSearch, Star } from "lucide-react";

import { Badge } from "@/components/ui";
import { formatCompactNumber, formatCurrency } from "@/lib/utils";
import type { ProductCatalogItem, ProductSortOption } from "@/types/product";

type SearchProductCardProps = {
  product: ProductCatalogItem;
  sort: ProductSortOption;
};

// Dữ liệu bổ sung cố định khi API chưa trả đủ thông tin hiển thị.
const SEARCH_CARD_DEFAULTS = {
  originalPrice: 1990000,
  discount: 30,
  rating: 4.8,
  location: "Hà Nội",
};

// Thẻ sản phẩm tĩnh trong trang tìm kiếm, render phía server.
export function SearchProductCard({ product, sort }: SearchProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-indigo-300 hover:shadow-3d-hover"
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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <PackageSearch className="absolute inset-0 m-auto h-10 w-10 text-primary/30" />
        )}

        {/* Badge Mall và Freeship Xtra góc trên trái. */}
        <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
          <Badge variant="mall" size="xs">Mall</Badge>
          <Badge variant="freeship-xtra" size="xs">Freeship Xtra</Badge>
        </div>

        {/* Tag phần trăm giảm giá góc trên phải. */}
        <div className="absolute right-0 top-0 z-10">
          <span className="block rounded-bl-xl bg-gradient-to-b from-amber-400 to-orange-500 px-2 py-1 text-[10px] font-black text-slate-900 shadow-xs sm:text-xs">
            -{SEARCH_CARD_DEFAULTS.discount}%
          </span>
        </div>

        {/* Nhãn bán chạy chỉ hiển thị khi đang sắp xếp theo lượng bán. */}
        {sort === "MOST_SOLD" && (
          <span className="absolute right-2 top-2 rounded-md bg-cta px-1.5 py-1 text-[9px] font-black uppercase text-white shadow-sm">
            Bán chạy
          </span>
        )}
      </div>

      {/* Tên, giá, địa điểm và số lượng bán của sản phẩm. */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
        <h3 className="min-h-[38px] text-xs font-semibold leading-snug text-main line-clamp-2 transition-colors group-hover:text-primary sm:text-sm">
          {product.name}
        </h3>

        {/* Giá khuyến mãi và giá gốc gạch ngang. */}
        <div className="space-y-0.5">
          <div className="flex flex-wrap items-baseline gap-1.5">
            <span className="text-sm font-black text-cta sm:text-base">
              {formatCurrency(product.maxPrice)}
            </span>
            <span className="text-[11px] text-muted-foreground line-through">
              {formatCurrency(SEARCH_CARD_DEFAULTS.originalPrice)}
            </span>
          </div>
        </div>

        {/* Địa điểm xuất kho. */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400">
          <MapPin className="h-2.5 w-2.5" />
          <span className="truncate">{SEARCH_CARD_DEFAULTS.location}</span>
        </div>

        {/* Đánh giá sao và tổng lượng đã bán. */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-star text-star" />
            <span className="font-bold text-slate-700">{SEARCH_CARD_DEFAULTS.rating}</span>
          </div>
          <span className="shrink-0 font-medium">
            Đã bán {formatCompactNumber(product.totalSold ?? 0)}
          </span>
        </div>
      </div>
    </Link>
  );
}
