"use client";

import { usePersonalizedSuggestions } from "@/hooks/usePersonalizedSuggestions";
import { SuggestedProductCard } from "./suggested-product-card";
import { SuggestionTabs } from "./suggestion-tabs";
import { Button } from "@/components/ui";
import type { ProductCatalogItem } from "@/types/product";

// Các trường chung giữ mock Home đúng cấu trúc response catalog của trang tìm kiếm.
const catalogMockDefaults = {
  description: null,
  categoryId: 1,
  categoryName: "Công nghệ",
  brandId: null,
  brandName: null,
  status: "ACTIVE" as const,
};

const allSuggestedProducts: ProductCatalogItem[] = [
  {
    ...catalogMockDefaults,
    id: 1,
    name: "Tai nghe Bluetooth True Wireless Pro ANC Chống ồn chủ động kép",
    maxPrice: 499000,
    totalSold: 3420,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 2,
    name: "Đồng hồ thông minh AMOLED 5ATM GPS độc lập theo dõi sức khỏe SpO2",
    maxPrice: 1890000,
    totalSold: 1450,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 3,
    name: "Giày Sneaker Thể Thao Nam Nữ Dynamic Runner Đế Bọt Khí",
    maxPrice: 550000,
    totalSold: 4890,
    categoryId: 2,
    categoryName: "Thời trang",
    location: "Đà Nẵng",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 4,
    name: "Bàn phím cơ không dây RGB 3 Chế độ Gasket Mount Hot-swap Pro",
    maxPrice: 790000,
    totalSold: 2100,
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 5,
    name: "Củ sạc nhanh GaN 65W 3 Cổng Type-C PD 3.0 cho Laptop & Điện thoại",
    maxPrice: 320000,
    totalSold: 6720,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 6,
    name: "Kính mát Unisex Phân cực Chống tia UV400 Thiết kế Retro Sang trọng",
    maxPrice: 260000,
    totalSold: 1850,
    categoryId: 2,
    categoryName: "Thời trang",
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 7,
    name: "Chuột Gaming không dây siêu nhẹ 49g cảm biến 26.000 DPI PAW3395",
    maxPrice: 680000,
    totalSold: 1240,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 8,
    name: "Bình giữ nhiệt Inox 316 dung tích 800ml khóa chống tràn giữ nhiệt 24H",
    maxPrice: 249000,
    totalSold: 8900,
    categoryId: 3,
    categoryName: "Nhà cửa",
    location: "Hà Nội",
    imageUrl: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 9,
    name: "Máy ảnh kỹ thuật số Compact 4K Retro bắt nét tự động quay vlog",
    maxPrice: 3450000,
    totalSold: 720,
    location: "TP. Hồ Chí Minh",
    imageUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&auto=format&fit=crop&q=80",
  },
  {
    ...catalogMockDefaults,
    id: 10,
    name: "Serum dưỡng ẩm phục hồi da chuyên sâu B5 Niacinamide 50ml",
    maxPrice: 340000,
    totalSold: 4300,
    categoryId: 4,
    categoryName: "Làm đẹp",
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
