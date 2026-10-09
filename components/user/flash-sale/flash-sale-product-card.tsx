import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Flame, PackageSearch, Zap } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { getSaleQuotaPercent } from "@/lib/utils/user-flash-sale.utils";
import type { UserFlashSaleItem } from "@/types/user/flash-sale";
import styles from "./flash-sale.module.css";

const AVAILABILITY_LABELS = {
  AVAILABLE: "Còn suất sale",
  OUT_OF_STOCK: "Tạm hết hàng",
  SOLD_OUT: "Hết suất sale",
} as const;

// Hiển thị đúng giá và quota từng variant, không suy diễn số đã bán từ tồn kho.
export function FlashSaleProductCard({ item }: { item: UserFlashSaleItem }) {
  const available = item.availability === "AVAILABLE" && item.remainingQuantity > 0;
  const detailUrl = `/products/${item.productId}?variantId=${item.variantId}`;
  return (
    <article className={cn(styles.saleCard, "group flex min-w-0 flex-col overflow-hidden rounded-xl border border-cta/20 bg-surface-card")}>
      {/* Ảnh thật của phân loại và mức giảm do backend tính. */}
      <Link href={detailUrl} aria-label={`Xem ${item.productName}, ${item.variantLabel || "phân loại tiêu chuẩn"}`}
        className="relative block aspect-[4/3] overflow-hidden bg-surface-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary">
        {item.imageUrl ? <Image src={item.imageUrl} alt={item.productName} fill unoptimized sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
          className={cn("object-cover transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]", !available && "opacity-60")} />
          : <div className="flex h-full flex-col items-center justify-center gap-2 text-muted-foreground"><PackageSearch className="size-9" aria-hidden="true" /><span className="text-xs">Shop chưa cập nhật ảnh</span></div>}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded bg-star px-2 py-1 font-heading text-xs font-bold text-main"><Zap className="size-3 fill-current" aria-hidden="true" />-{item.discountPercent}%</span>
        {!available && <span className="absolute inset-x-0 bottom-0 bg-main/80 px-2 py-2 text-center text-xs font-semibold text-white">{AVAILABILITY_LABELS[item.availability]}</span>}
      </Link>
      {/* Giá theo phân loại và thông tin quota được cung cấp bởi API. */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <Link href={detailUrl} className="rounded-sm focus-visible:outline-2 focus-visible:outline-primary">
          <h3 className="line-clamp-2 min-h-9 text-xs font-semibold leading-[18px] text-main transition-colors hover:text-primary sm:text-sm">{item.productName}</h3>
        </Link>
        <p title={item.variantLabel} className="mt-1 truncate text-[11px] leading-4 text-muted-foreground">{item.variantLabel || "Phân loại tiêu chuẩn"}</p>
        <div className="mt-2">
          <span className="block text-lg font-extrabold leading-6 tabular-nums text-cta-hover sm:text-xl">{formatCurrency(item.salePrice)}</span>
          <span className="text-[11px] tabular-nums text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</span>
        </div>
        <div className="mt-2">
          <div className="relative h-5 overflow-hidden rounded bg-cta-light" role="meter" aria-label="Số suất mua còn lại" aria-valuemin={0} aria-valuemax={item.registeredQuantity} aria-valuenow={item.remainingQuantity}>
            <div className="absolute inset-y-0 left-0 bg-star/45" style={{ width: `${getSaleQuotaPercent(item)}%` }} />
            <span className="relative flex h-full items-center justify-center gap-1 text-[10px] font-semibold text-main"><Flame className="size-3 text-cta-hover" aria-hidden="true" />{available ? `Còn ${item.remainingQuantity} suất sale` : AVAILABILITY_LABELS[item.availability]}</span>
          </div>
        </div>
        {/* Mua ngay chỉ dựng UI theo yêu cầu; chưa nối API khi backend chưa được chốt. */}
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          <button type="button" disabled title="Chức năng mua ngay sẽ được tích hợp sau" aria-label={`Mua ngay ${item.productName} — chưa khả dụng`}
            className={cn("flex min-h-10 cursor-not-allowed items-center justify-center gap-1 rounded-md px-1 text-[10px] font-bold sm:text-xs", available ? `${styles.buyButton} text-main` : "bg-surface-muted text-muted-foreground")}>
            <Zap className="relative z-10 size-3 shrink-0 fill-current" aria-hidden="true" /><span className="relative z-10">Mua ngay</span>
          </button>
          <Link href={detailUrl} aria-label={`Xem chi tiết ${item.productName}, ${item.variantLabel || "phân loại tiêu chuẩn"}`}
            className={cn(styles.detailButton, "flex min-h-10 items-center justify-center gap-1 rounded-md border border-cta/30 bg-cta-light px-1 text-center text-[10px] font-semibold text-cta-hover focus-visible:outline-2 focus-visible:outline-primary sm:text-xs")}>Xem chi tiết<ArrowUpRight className="size-3 shrink-0" aria-hidden="true" /></Link>
        </div>
      </div>
    </article>
  );
}

