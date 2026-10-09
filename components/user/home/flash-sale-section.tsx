import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

const products = [
  { id: "fs-1", title: "Tai nghe True Wireless Chống ồn Pro ANC Kép", price: 499000, originalPrice: 990000, discount: 50, soldPercent: 88, imageUrl: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=80" },
  { id: "fs-2", title: "Pin sạc dự phòng 20.000mAh Sạc nhanh 65W PD 3.0", price: 349000, originalPrice: 650000, discount: 46, soldPercent: 94, imageUrl: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&auto=format&fit=crop&q=80" },
  { id: "fs-3", title: "Bàn phím cơ không dây RGB 3 Mode Hot-swap Gasket", price: 790000, originalPrice: 1290000, discount: 39, soldPercent: 72, imageUrl: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=80" },
  { id: "fs-4", title: "Củ sạc GaN 100W 4 Cổng Đa năng Type-C & USB An Toàn", price: 420000, originalPrice: 750000, discount: 44, soldPercent: 81, imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80" },
  { id: "fs-5", title: "Đồng hồ thông minh theo dõi sức khỏe chống nước", price: 699000, originalPrice: 1190000, discount: 41, soldPercent: 76, imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80" },
];

export function FlashSaleSection() {
  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
        <div className="flex flex-wrap items-center gap-3"><div className="flex items-center gap-2 text-cta"><Flame className="h-5 w-5" /><span className="text-base font-bold tracking-tight sm:text-lg">FLASH SALE</span></div><div className="flex items-center gap-1 font-mono text-xs font-semibold text-main"><span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">02</span><span>:</span><span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">45</span><span>:</span><span className="rounded border border-slate-200 bg-slate-50 px-2 py-1">18</span></div><Badge variant="cta-soft" size="xs" className="hidden sm:inline-flex">ĐANG DIỄN RA</Badge></div>
        <Link href="/flash-sale" className="group flex items-center gap-1 text-xs font-semibold text-cta transition-colors hover:text-cta-hover"><span>Xem tất cả Flash Sale</span><ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" /></Link>
      </div>
      <div className="grid grid-cols-2 gap-3 p-4 sm:gap-4 sm:p-5 lg:grid-cols-5">
        {products.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="group flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-2.5 transition-all duration-200 hover:-translate-y-1 hover:border-cta/50 hover:shadow-md sm:p-3">
            <div><div className="relative aspect-square w-full overflow-hidden rounded-md bg-slate-100"><Image fill src={item.imageUrl} alt={item.title} sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute right-2 top-2"><Badge variant="cta-soft" size="sm">-{item.discount}%</Badge></div></div>
              <div className="space-y-1.5 pt-2"><h4 className="min-h-[38px] text-xs font-medium leading-snug text-main transition-colors group-hover:text-primary sm:text-sm line-clamp-2">{item.title}</h4><div className="flex flex-wrap items-baseline gap-x-2"><span className="text-sm font-semibold text-cta sm:text-base">{formatCurrency(item.price)}</span><span className="text-[11px] text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</span></div></div>
            </div>
            <div className="space-y-1 pt-1"><div className="relative h-4 w-full overflow-hidden rounded-sm bg-orange-100"><div className="h-full bg-cta transition-all duration-500" style={{ width: `${item.soldPercent}%` }} /><span className="absolute inset-0 flex items-center justify-center text-[9px] font-semibold uppercase tracking-tight text-main">Đã bán {item.soldPercent}%</span></div></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
