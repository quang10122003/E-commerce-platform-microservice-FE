"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, PackageSearch } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { getSaleQuotaPercent } from "@/lib/utils/user-flash-sale.utils";
import { useHomeFlashSale } from "@/hooks/user/home/useHomeFlashSale";
import type { UserFlashSaleResponse } from "@/types/user/flash-sale";

// Hiển thị top sale thật trong bố cục home; rỗng hoặc hết hạn thì ẩn toàn bộ khối.
export function FlashSaleSection({ data, serverNow }: { data: UserFlashSaleResponse; serverNow: number }) {
  const countdown = useHomeFlashSale(data.endsAt, serverNow);
  if (!data.items.length || !data.endsAt || countdown.expired) return null;
  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card">
      {/* Deadline thật và lối vào trang danh sách sale. */}
      <div className="flex flex-col justify-between gap-3 border-b border-surface-border px-4 py-4 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-wrap items-center gap-3"><div className="flex items-center gap-2 text-cta"><Flame className="h-5 w-5" /><span className="text-base font-bold tracking-tight sm:text-lg">FLASH SALE</span></div><div className="flex items-center gap-1 font-mono text-xs font-semibold text-main">{countdown.parts.map((part, index) => <span key={index} className="flex items-center gap-1">{index > 0 && <span>:</span>}<span className="rounded border border-surface-border bg-surface-subtle px-2 py-1 tabular-nums">{part}</span></span>)}</div><Badge variant="cta-soft" size="xs" className="hidden sm:inline-flex">ĐANG DIỄN RA</Badge></div>
        <Link href="/flash-sale" className="group flex items-center gap-1 text-xs font-semibold text-cta transition-colors hover:text-cta-hover"><span>Xem tất cả Flash Sale</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
      </div>
      {/* Giữ thứ tự top 5 backend; quota không được dùng để suy diễn số đã bán. */}
      <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5 lg:grid-cols-5">
        {data.items.map((item) => (
          <Link key={item.variantId} href={`/products/${item.productId}?variantId=${item.variantId}`} className="group flex flex-col justify-between gap-3 rounded-lg border border-surface-border p-2.5 transition-colors duration-200 hover:border-cta/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none sm:p-3">
            <div><div className="relative aspect-square w-full overflow-hidden rounded-md bg-surface-subtle">{item.imageUrl ? <Image fill unoptimized src={item.imageUrl} alt={item.productName} sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover transition-transform duration-300 motion-safe:group-hover:scale-[1.03] motion-reduce:transition-none" /> : <div className="flex h-full items-center justify-center text-muted-foreground"><PackageSearch className="size-8" aria-label="Shop chưa cập nhật ảnh" /></div>}<div className="absolute right-2 top-2"><Badge variant="discount" size="sm">-{item.discountPercent}%</Badge></div></div>
              <div className="space-y-1.5 pt-2"><h4 className="min-h-[38px] text-xs font-medium leading-snug text-main transition-colors group-hover:text-primary sm:text-sm line-clamp-2">{item.productName}</h4><p className="truncate text-[11px] text-muted-foreground" title={item.variantLabel}>{item.variantLabel || "Phân loại tiêu chuẩn"}</p><div className="flex flex-wrap items-baseline gap-x-2"><span className="text-sm font-semibold text-cta sm:text-base">{formatCurrency(item.salePrice)}</span><span className="text-[11px] text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</span></div></div>
            </div>
            <div className="space-y-1 pt-1"><div className="relative h-4 w-full overflow-hidden rounded-sm bg-cta-light"><div className="h-full bg-cta transition-all duration-500" style={{ width: `${getSaleQuotaPercent(item)}%` }} /><span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold uppercase tracking-tight text-main">Còn {item.remainingQuantity} suất sale</span></div></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
