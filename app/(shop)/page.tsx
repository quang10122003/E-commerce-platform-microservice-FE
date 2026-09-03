import React from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";
import { HeroCarousel } from "@/components/shop/hero-carousel";
import { SuggestedCategories } from "@/components/shop/suggested-categories";
import { PersonalizedSuggestions } from "@/components/shop/personalized-suggestions";

const flashSaleProducts = [
  {
    id: "fs-1",
    title: "Tai nghe True Wireless Chống ồn Chủ động Pro ANC",
    price: 499000,
    originalPrice: 990000,
    discount: 50,
    soldPercent: 82,
    imageBg: "from-indigo-500/15 to-purple-500/10",
  },
  {
    id: "fs-2",
    title: "Pin sạc dự phòng 20.000mAh Sạc nhanh 65W PD 3.0",
    price: 349000,
    originalPrice: 650000,
    discount: 46,
    soldPercent: 94,
    imageBg: "from-cyan-500/15 to-blue-500/10",
  },
  {
    id: "fs-3",
    title: "Bàn phím cơ không dây RGB 3 Mode Hot-swap",
    price: 790000,
    originalPrice: 1290000,
    discount: 39,
    soldPercent: 65,
    imageBg: "from-amber-500/15 to-orange-500/10",
  },
  {
    id: "fs-4",
    title: "Củ sạc GaN 100W 4 Cổng Đa năng Type-C & USB",
    price: 420000,
    originalPrice: 750000,
    discount: 44,
    soldPercent: 78,
    imageBg: "from-emerald-500/15 to-teal-500/10",
  },
];

export default function ShopHomePage() {
  return (
    <div className="space-y-8">
      {/* 1. DYNAMIC HERO BANNER SLIDER */}
      <HeroCarousel />

      {/* 2. SHOPEE-STYLE 2-ROW SUGGESTED CATEGORIES */}
      <SuggestedCategories />

      {/* 3. FLASH SALE SECTION */}
      <Card className="border-cta/20 bg-gradient-to-b from-orange-50/40 via-white to-white overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-orange-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-cta font-black text-lg sm:text-xl">
              <Flame className="w-6 h-6 fill-cta text-cta animate-bounce" />
              <span>FLASH SALE</span>
            </div>
            {/* Countdown Box */}
            <div className="flex items-center gap-1 text-xs font-bold">
              <span className="px-2 py-1 rounded-md bg-slate-900 text-white">02</span>
              <span>:</span>
              <span className="px-2 py-1 rounded-md bg-slate-900 text-white">45</span>
              <span>:</span>
              <span className="px-2 py-1 rounded-md bg-slate-900 text-white">18</span>
            </div>
          </div>

          <Link
            href="/flash-sale"
            className="text-xs font-bold text-cta hover:underline flex items-center gap-1"
          >
            Xem tất cả Flash Sale <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {flashSaleProducts.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-surface-border bg-white p-3 space-y-3 hover:shadow-md hover:border-cta/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Placeholder */}
                <div
                  className={`relative aspect-square w-full rounded-lg bg-gradient-to-br ${item.imageBg} flex items-center justify-center`}
                >
                  <Badge
                    variant="cta-soft"
                    size="sm"
                    className="absolute top-2 right-2"
                  >
                    -{item.discount}%
                  </Badge>
                  <span className="text-xs text-muted-foreground font-semibold">
                    Ảnh 1:1
                  </span>
                </div>

                <div className="space-y-1.5 pt-2">
                  <h4 className="text-sm font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[38px]">
                    {item.title}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-bold text-cta">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-[10px] text-muted-foreground line-through">
                      {formatCurrency(item.originalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-3.5 w-full bg-orange-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-cta rounded-full"
                    style={{ width: `${item.soldPercent}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-white uppercase tracking-tight">
                    ĐÃ BÁN {item.soldPercent}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 4. SHOPEE-STYLE PERSONALIZED SUGGESTIONS WITH TABS ("GỢI Ý HÔM NAY") */}
      <PersonalizedSuggestions />
    </div>
  );
}
