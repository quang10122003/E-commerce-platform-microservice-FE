"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Flame,
  Zap,
  Star,
  Heart,
  MapPin,
  ShoppingCart,
} from "lucide-react";
import { Button, Badge } from "@/components/ui";
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
  isMall?: boolean;
  isFreeship?: boolean;
  isFlashSale?: boolean;
  location: string;
  imageUrl: string;
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
    isMall: true,
    isFreeship: true,
    isFlashSale: true,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Đồng hồ thông minh AMOLED 5ATM GPS độc lập theo dõi sức khỏe SpO2",
    price: 1890000,
    originalPrice: 2490000,
    discount: 24,
    rating: 4.8,
    sold: 1450,
    category: "tech",
    isMall: true,
    isFreeship: true,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Giày Sneaker Thể Thao Nam Nữ Dynamic Runner Đế Bọt Khí",
    price: 550000,
    originalPrice: 890000,
    discount: 38,
    rating: 4.9,
    sold: 4890,
    category: "fashion",
    isMall: false,
    isFreeship: true,
    location: "Đà Nẵng",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Bàn phím cơ không dây RGB 3 Chế độ Gasket Mount Hot-swap Pro",
    price: 790000,
    originalPrice: 1290000,
    discount: 39,
    rating: 5.0,
    sold: 2100,
    category: "tech",
    isMall: true,
    isFreeship: true,
    isFlashSale: true,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
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
    isMall: true,
    isFreeship: true,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 6,
    title: "Kính mát Unisex Phân cực Chống tia UV400 Thiết kế Retro Sang trọng",
    price: 260000,
    originalPrice: 450000,
    discount: 42,
    rating: 4.8,
    sold: 1850,
    category: "fashion",
    isMall: false,
    isFreeship: true,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80",
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
    isMall: true,
    isFreeship: true,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 8,
    title: "Bình giữ nhiệt Inox 316 dung tích 800ml khóa chống tràn giữ nhiệt 24H",
    price: 249000,
    originalPrice: 490000,
    discount: 49,
    rating: 4.9,
    sold: 8900,
    category: "home",
    isMall: true,
    isFreeship: true,
    isFlashSale: true,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 9,
    title: "Máy ảnh kỹ thuật số Compact 4K Retro bắt nét tự động quay vlog",
    price: 3450000,
    originalPrice: 4800000,
    discount: 28,
    rating: 4.8,
    sold: 720,
    category: "tech",
    isMall: true,
    isFreeship: true,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80",
  },
  {
    id: 10,
    title: "Serum dưỡng ẩm phục hồi da chuyên sâu B5 Niacinamide 50ml",
    price: 340000,
    originalPrice: 520000,
    discount: 35,
    rating: 4.8,
    sold: 4300,
    category: "beauty",
    isMall: true,
    isFreeship: true,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80",
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
  const [visibleCount, setVisibleCount] = useState(10);
  const [likedProducts, setLikedProducts] = useState<Record<number, boolean>>({});

  const toggleLike = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    setLikedProducts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
      {/* 1. STICKY / INTERACTIVE TAB BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-3d sticky top-[61px] z-20 overflow-hidden">
        <div className="flex items-center overflow-x-auto scrollbar-none divide-x divide-slate-100">
          {suggestionTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[130px] sm:min-w-[160px] py-3.5 px-3 flex flex-col items-center justify-center gap-1 text-center transition-all duration-200 relative cursor-pointer ${
                  isActive
                    ? "bg-primary-light/60 text-primary font-bold shadow-inner"
                    : "text-slate-700 hover:bg-slate-50 font-medium"
                }`}
              >
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-primary fill-primary/20" : tab.color
                    }`}
                  />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </div>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-indigo-600 rounded-t-full animate-fadeIn" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. PRODUCT GRID (5 COLUMNS ON DESKTOP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {filteredProducts.slice(0, visibleCount).map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="rounded-2xl border border-slate-200/90 bg-white shadow-card hover:shadow-3d-hover hover:-translate-y-2 hover:border-indigo-300 transition-all duration-300 overflow-hidden group flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Product Thumbnail with Unsplash Image */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Top Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {product.isMall && (
                    <Badge variant="mall" size="xs">
                      Mall
                    </Badge>
                  )}
                  {product.isFreeship && (
                    <Badge variant="freeship-xtra" size="xs">
                      Freeship Xtra
                    </Badge>
                  )}
                </div>

                {/* Discount Tag */}
                <div className="absolute top-0 right-0 z-10">
                  <span className="bg-gradient-to-b from-amber-400 to-orange-500 text-slate-900 font-black text-[10px] sm:text-xs px-2 py-1 rounded-bl-xl shadow-xs block">
                    -{product.discount}%
                  </span>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => toggleLike(e, product.id)}
                  className={`absolute bottom-2 right-2 p-2 rounded-full backdrop-blur-md shadow-md transition-all duration-200 z-10 ${
                    likedProducts[product.id]
                      ? "bg-rose-50 text-rose-600"
                      : "bg-white/80 hover:bg-white text-slate-500 hover:text-rose-500"
                  }`}
                  aria-label="Yêu thích"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      likedProducts[product.id] ? "fill-rose-600" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-3 sm:p-3.5 space-y-2">
                {/* Title */}
                <h3 className="text-xs sm:text-sm font-semibold text-main line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[38px]">
                  {product.title}
                </h3>

                {/* Price Section */}
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-sm sm:text-base font-black text-cta">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-[11px] text-muted-foreground line-through">
                      {formatCurrency(product.originalPrice)}
                    </span>
                  </div>
                </div>

                {/* Rating & Sold count */}
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-star text-star" />
                    <span className="font-bold text-slate-700">
                      {product.rating}
                    </span>
                  </div>
                  <span className="font-medium">
                    Đã bán{" "}
                    {product.sold >= 1000
                      ? `${(product.sold / 1000).toFixed(1)}k`
                      : product.sold}
                  </span>
                </div>

                {/* Location Tag */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="w-2.5 h-2.5" />
                  <span className="truncate">{product.location}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="p-3 sm:p-3.5 pt-0">
              <Button
                variant="cta-outline"
                size="sm"
                fullWidth
                leftIcon={<ShoppingCart className="w-3.5 h-3.5" />}
                className="text-xs font-bold rounded-xl h-8.5"
              >
                Thêm vào giỏ
              </Button>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. LOAD MORE BUTTON */}
      <div className="text-center pt-5 pb-2">
        <Button
          variant="outline"
          size="lg"
          onClick={handleLoadMore}
          isLoading={isLoadingMore}
          className="rounded-2xl px-10 text-xs sm:text-sm font-bold border-slate-300 text-main hover:border-primary hover:text-primary hover:bg-primary-light/40 shadow-xs"
        >
          Xem Thêm Sản Phẩm Gợi Ý
        </Button>
      </div>
    </div>
  );
}
