"use client";

import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import { SuggestedProductCard, type SuggestedProduct } from "./suggested-product-card";
import { SuggestionTabs } from "./suggestion-tabs";
import { Button } from "@/components/ui";

const allSuggestedProducts: SuggestedProduct[] = [
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

export function PersonalizedSuggestions() {
  const {
    activeTab,
    filteredProducts,
    handleLoadMore,
    isLoadingMore,
    setActiveTab,
    visibleCount,
  } = usePersonalizedSuggestions(allSuggestedProducts);

  return (
    <div className="space-y-4">
      <SuggestionTabs activeTab={activeTab} onSelect={setActiveTab} />

      {/* 2. PRODUCT GRID (5-6 CỘT TRÊN DESKTOP) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-3.5 sm:gap-4">
        {filteredProducts.slice(0, visibleCount).map((product) => <SuggestedProductCard key={product.id} product={product} />)}
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
