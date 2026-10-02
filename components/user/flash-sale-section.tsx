import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Badge, Card } from "@/components/ui";
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
    <Card variant="3d" className="border-orange-200/80 bg-gradient-to-b from-orange-50/70 via-white to-white overflow-hidden shadow-3d">
      <div className="p-4 sm:p-5 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap"><div className="flex items-center gap-2 text-cta font-black text-lg sm:text-xl"><Flame className="w-6 h-6 fill-cta text-cta animate-bounce" /><span className="bg-gradient-to-r from-orange-600 via-cta to-red-600 bg-clip-text text-transparent">FLASH SALE</span></div><div className="flex items-center gap-1 text-xs font-black text-white"><span className="px-2 py-1 rounded-lg bg-slate-900 shadow-xs">02</span><span className="text-slate-900 font-bold">:</span><span className="px-2 py-1 rounded-lg bg-slate-900 shadow-xs">45</span><span className="text-slate-900 font-bold">:</span><span className="px-2 py-1 rounded-lg bg-slate-900 shadow-xs">18</span></div><Badge variant="flame" size="xs" className="hidden sm:inline-flex">ĐANG DIỄN RA</Badge></div>
        <Link href="/flash-sale" className="text-xs font-bold text-cta hover:text-cta-hover flex items-center gap-1 group cursor-pointer"><span>Xem tất cả Flash Sale</span><ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" /></Link>
      </div>
      <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {products.map((item) => (
          <Link key={item.id} href={`/products/${item.id}`} className="rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-3.5 space-y-3 shadow-card hover:shadow-3d-hover hover:border-cta/60 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group cursor-pointer">
            <div><div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-100"><Image fill src={item.imageUrl} alt={item.title} sizes="(min-width: 1024px) 20vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500" /><div className="absolute top-2 right-2"><Badge variant="flame" size="sm">-{item.discount}%</Badge></div><div className="absolute top-2 left-2"><Badge variant="mall" size="xs">Mall</Badge></div></div>
              <div className="space-y-1.5 pt-2"><h4 className="text-xs sm:text-sm font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[38px]">{item.title}</h4><div className="flex items-baseline gap-2"><span className="text-sm sm:text-base font-black text-cta">{formatCurrency(item.price)}</span><span className="text-[11px] text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</span></div></div>
            </div>
            <div className="space-y-1 pt-1"><div className="h-4 w-full bg-orange-100/90 rounded-full overflow-hidden relative shadow-inner"><div className="h-full bg-gradient-to-r from-orange-500 via-cta to-red-600 rounded-full transition-all duration-500" style={{ width: `${item.soldPercent}%` }} /><span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-tight drop-shadow-xs">🔥 ĐÃ BÁN {item.soldPercent}%</span></div></div>
          </Link>
        ))}
      </div>
    </Card>
  );
}
