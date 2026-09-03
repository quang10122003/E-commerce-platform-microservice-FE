"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Truck,
  ShieldCheck,
  Star,
  Tag,
  Loader2,
  Heart,
} from "lucide-react";
import { Card, Button, Badge } from "@/components/ui";
import { formatCurrency } from "@/lib/utils";

interface Product {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  sold: number;
  category: string;
  isOfficial?: boolean;
  isFreeship?: boolean;
  isFlashSale?: boolean;
  imageBg: string;
}

const allSuggestedProducts: Product[] = [
  {
    id: 1,
    title: "Tai nghe Bluetooth True Wireless Pro ANC Chống ồn chủ động kép",
    price: 499000,
    originalPrice: 990000,
    discount: 50,
    rating: 4.9,
    sold: 3420,
    category: "tech",
    isOfficial: true,
    isFreeship: true,
    isFlashSale: true,
    imageBg: "from-indigo-500/15 to-blue-500/10",
  },
  {
    id: 2,
    title: "Đồng hồ thông minh AMOLED 5ATM GPS độc lập theo dõi nhịp tim SpO2",
    price: 1890000,
    originalPrice: 2490000,
    discount: 24,
    rating: 4.8,
    sold: 1450,
    category: "tech",
    isOfficial: true,
    isFreeship: true,
    imageBg: "from-blue-500/15 to-cyan-500/10",
  },
  {
    id: 3,
    title: "Áo khoác gió thể thao nam chống thấm nước 2 lớp cao cấp",
    price: 289000,
    originalPrice: 450000,
    discount: 36,
    rating: 4.7,
    sold: 4890,
    category: "fashion",
    isOfficial: false,
    isFreeship: true,
    imageBg: "from-rose-500/15 to-pink-500/10",
  },
  {
    id: 4,
    title: "Bàn phím cơ không dây RGB 3 Chế độ Gasket Mount Hot-swap",
    price: 790000,
    originalPrice: 1290000,
    discount: 39,
    rating: 5.0,
    sold: 2100,
    category: "tech",
    isOfficial: true,
    isFreeship: true,
    isFlashSale: true,
    imageBg: "from-purple-500/15 to-indigo-500/10",
  },
  {
    id: 5,
    title: "Củ sạc nhanh GaN 65W 3 Cổng Type-C PD 3.0 cho Laptop & Điện thoại",
    price: 320000,
    originalPrice: 590000,
    discount: 46,
    rating: 4.9,
    sold: 6720,
    category: "tech",
    isOfficial: true,
    isFreeship: true,
    imageBg: "from-emerald-500/15 to-teal-500/10",
  },
  {
    id: 6,
    title: "Giày Sneaker nam thể thao đế đệm êm khí thoáng khí chạy bộ",
    price: 450000,
    originalPrice: 750000,
    discount: 40,
    rating: 4.8,
    sold: 1850,
    category: "fashion",
    isOfficial: false,
    isFreeship: true,
    imageBg: "from-orange-500/15 to-amber-500/10",
  },
  {
    id: 7,
    title: "Chuột Gaming không dây siêu nhẹ 49g cảm biến 26.000 DPI PAW3395",
    price: 680000,
    originalPrice: 990000,
    discount: 31,
    rating: 4.9,
    sold: 1240,
    category: "tech",
    isOfficial: true,
    isFreeship: true,
    imageBg: "from-slate-500/15 to-slate-700/10",
  },
  {
    id: 8,
    title: "Bình giữ nhiệt Lock&Lock Inox 316 dung tích 800ml giữ ấm 24H",
    price: 249000,
    originalPrice: 490000,
    discount: 49,
    rating: 4.9,
    sold: 8900,
    category: "home",
    isOfficial: true,
    isFreeship: true,
    isFlashSale: true,
    imageBg: "from-teal-500/15 to-emerald-500/10",
  },
  {
    id: 9,
    title: "Bộ nồi chảo chống dính đá hoa cương đáy từ 3 món cao cấp",
    price: 650000,
    originalPrice: 1100000,
    discount: 41,
    rating: 4.7,
    sold: 950,
    category: "home",
    isOfficial: false,
    isFreeship: true,
    imageBg: "from-amber-500/15 to-orange-500/10",
  },
  {
    id: 10,
    title: "Serum dưỡng ẩm phục hồi da B5 Vitamin C dung tích 50ml",
    price: 340000,
    originalPrice: 520000,
    discount: 35,
    rating: 4.8,
    sold: 4300,
    category: "beauty",
    isOfficial: true,
    isFreeship: true,
    imageBg: "from-pink-500/15 to-rose-500/10",
  },
  {
    id: 11,
    title: "Đèn bàn học chống cận thị bảo vệ mắt 3 chế độ sáng cảm ứng",
    price: 199000,
    originalPrice: 380000,
    discount: 48,
    rating: 4.6,
    sold: 5200,
    category: "home",
    isOfficial: false,
    isFreeship: false,
    imageBg: "from-yellow-500/15 to-amber-500/10",
  },
  {
    id: 12,
    title: "Balo Laptop chống nước 15.6 inch cổng sạc USB đa ngăn tiện dụng",
    price: 279000,
    originalPrice: 420000,
    discount: 34,
    rating: 4.8,
    sold: 3100,
    category: "fashion",
    isOfficial: false,
    isFreeship: true,
    imageBg: "from-blue-500/15 to-indigo-500/10",
  },
];

const suggestionTabs = [
  { id: "all", label: "Gợi Ý Cho Bạn", icon: Flame, color: "text-cta" },
  { id: "sale", label: "Sale Giảm Sốc", icon: Zap, color: "text-cta" },
  { id: "bestseller", label: "Top Bán Chạy", icon: Star, color: "text-amber-500" },
];

export function PersonalizedSuggestions() {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(15);

  // Filter products based on selected Tab (3 options)
  const filteredProducts = allSuggestedProducts.filter((product) => {
    if (activeTab === "all") return true;
    if (activeTab === "sale") return product.discount >= 35 || product.isFlashSale;
    if (activeTab === "bestseller") return product.sold >= 2000;
    return true;
  });

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 5);
      setIsLoadingMore(false);
    }, 600);
  };

  return (
    <div className="space-y-4">
      {/* 1. STICKY / INTERACTIVE TAB BAR (SHOPEE STYLE) */}
      <div className="bg-white rounded-xl border border-surface-border shadow-2xs sticky top-[61px] z-20 overflow-hidden">
        <div className="flex items-center overflow-x-auto scrollbar-none divide-x divide-surface-border/60">
          {suggestionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[150px] py-3.5 px-3 flex flex-col items-center justify-center gap-1 text-center transition-all duration-200 relative ${
                  isActive
                    ? "bg-primary-light/40 text-primary font-bold"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs sm:text-sm">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-primary fill-primary/20" : tab.color
                    }`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </div>

                {/* Bottom Active Indicator Line */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-md animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRODUCT GRID (EXACT 5 COLUMNS ON DESKTOP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <Card
            key={product.id}
            hoverEffect
            className="overflow-hidden group flex flex-col justify-between border-surface-border/70"
          >
            <div>
              {/* Product Thumbnail */}
              <div
                className={`relative aspect-square w-full bg-gradient-to-br ${product.imageBg} flex items-center justify-center p-3`}
              >
                {/* Top Badges */}
                {product.isOfficial && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="primary" size="sm">
                      Chính hãng
                    </Badge>
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant="cta-soft" size="sm">
                    -{product.discount}%
                  </Badge>
                </div>

                {/* Like Button */}
                <button
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white text-slate-400 hover:text-rose-500 shadow-2xs transition-colors"
                  aria-label="Yêu thích"
                >
                  <Heart className="w-3.5 h-3.5" />
                </button>

                <span className="text-[11px] font-semibold text-muted-foreground/60 select-none">
                  Ảnh 1:1
                </span>
              </div>

              {/* Product Info */}
              <div className="p-3.5 sm:p-4 space-y-2">
                {product.isFreeship && (
                  <Badge variant="perk-soft" size="sm">
                    Freeship Extra
                  </Badge>
                )}

                <h3 className="text-sm sm:text-[15px] font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[42px]">
                  {product.title}
                </h3>

                {/* Price */}
                <div className="flex items-baseline gap-2 pt-0.5">
                  <span className="text-base sm:text-lg font-black text-cta">
                    {formatCurrency(product.price)}
                  </span>
                  <span className="text-xs text-muted-foreground line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                </div>

                {/* Rating & Sold count */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-0.5">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-star text-star" />
                    <span className="font-bold text-main">
                      {product.rating}
                    </span>
                  </div>
                  <span>
                    Đã bán{" "}
                    {product.sold >= 1000
                      ? `${(product.sold / 1000).toFixed(1)}k`
                      : product.sold}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="p-3.5 sm:p-4 pt-0">
              <Button variant="cta" size="sm" fullWidth className="text-xs sm:text-sm h-9 font-semibold rounded-lg">
                Mua ngay
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* 3. LOAD MORE BUTTON */}
      <div className="text-center pt-4 pb-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleLoadMore}
          isLoading={isLoadingMore}
          className="rounded-xl px-10 text-xs sm:text-sm font-semibold border-slate-300 text-main hover:border-primary hover:text-primary hover:bg-primary-light/30 shadow-xs"
        >
          Xem Thêm Sản Phẩm Gợi Ý
        </Button>
      </div>
    </div>
  );
}

