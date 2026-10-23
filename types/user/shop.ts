import type { ProductCatalogItem } from "@/types/user/product";

export type ShopStorefrontTab = "home" | "products" | "about";

// Tổng quan shop công khai; productCount chỉ đếm sản phẩm ACTIVE, không đếm variant.
export interface ShopOverviewResponse {
  shopId: number;
  shopName: string | null;
  shopLogoUrl: string | null;
  shopDescription: string | null;
  productCount: number;
  // Thời điểm tạo shop dạng ISO có offset; null khi backend chưa có dữ liệu.
  shopCreatedAt: string | null;
}
// Các cách sắp xếp được GET /api/products/shops/{shopId}/products hỗ trợ.
export type ShopProductSortOption = "RELEVANCE" | "NEWEST" | "MOST_SOLD";

export interface ShopProductQuery {
  page: number;
  size: number;
  keyword?: string;
  categoryId?: number;
  sort: ShopProductSortOption;
}

// Phân trang đánh số từ 1 theo PageResponse của backend, không dùng cursor catalog.
export interface ShopProductPage {
  items: ProductCatalogItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
