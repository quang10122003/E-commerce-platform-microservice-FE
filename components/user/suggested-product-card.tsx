import Image from "next/image";
import Link from "next/link";
import { MapPin, ShoppingCart, Star } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

export interface SuggestedProduct {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  sold: number;
  category: string;
  isMall?: boolean;
  isFreeship?: boolean;
  isFlashSale?: boolean;
  location: string;
  imageUrl: string;
}

export function SuggestedProductCard({ product }: { product: SuggestedProduct }) {
  return (
    <Link href={`/products/${product.id}`} className="rounded-2xl border border-slate-200/90 bg-white shadow-card hover:shadow-3d-hover hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 overflow-hidden group flex flex-col justify-between cursor-pointer">
      <div>
        {/* Product Thumbnail with Unsplash Image */}
        <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
          <Image fill src={product.imageUrl} alt={product.title} sizes="(min-width: 1536px) 16.67vw, (min-width: 1024px) 20vw, (min-width: 640px) 25vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" />
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">{product.isMall && <Badge variant="mall" size="xs">Mall</Badge>}{product.isFreeship && <Badge variant="freeship-xtra" size="xs">Freeship Xtra</Badge>}</div>
          <div className="absolute top-0 right-0 z-10"><span className="bg-gradient-to-b from-amber-400 to-orange-500 text-slate-900 font-black text-[10px] sm:text-xs px-2 py-1 rounded-bl-xl shadow-xs block">-{product.discount}%</span></div>
        </div>
        <div className="p-3 sm:p-3.5 space-y-2">
          <h3 className="text-xs sm:text-sm font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[38px]">{product.title}</h3>
          <div className="flex items-baseline gap-1.5 flex-wrap"><span className="text-sm sm:text-base font-black text-cta">{formatCurrency(product.price)}</span><span className="text-[11px] text-muted-foreground line-through">{formatCurrency(product.originalPrice)}</span></div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-slate-100"><div className="flex items-center gap-1"><Star className="w-3 h-3 fill-star text-star" /><span className="font-bold text-slate-700">{product.rating}</span></div><span className="font-medium">Đã bán {product.sold >= 1000 ? `${(product.sold / 1000).toFixed(1)}k` : product.sold}</span></div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400"><MapPin className="w-2.5 h-2.5" /><span className="truncate">{product.location}</span></div>
        </div>
      </div>
      <div className="flex items-center gap-2 p-3 sm:p-3.5 pt-0"><Button variant="gradient-cta" size="sm" className="min-w-0 flex-1 text-xs font-bold rounded-xl h-8.5 px-2">Mua ngay</Button><Button variant="cta-outline" size="icon-sm" className="shrink-0" aria-label="Thêm vào giỏ hàng" title="Thêm vào giỏ hàng"><ShoppingCart className="w-4 h-4" /></Button></div>
    </Link>
  );
}
