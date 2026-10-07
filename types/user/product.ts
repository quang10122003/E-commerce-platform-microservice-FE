import type { ProductBrandOption } from "@/types/shared/product";

// Trạng thái hiển thị của sản phẩm trong catalog công khai.
export type ProductStatus = "ACTIVE" | "INACTIVE";

// Sản phẩm rút gọn được Elasticsearch trả về cho trang tìm kiếm.
export interface ProductCatalogItem {
  id: number;
  name: string;
  location: string | null;
  description: string | null;
  categoryId: number;
  categoryName: string;
  brandId: number | null;
  brandName: string | null;
  status: ProductStatus;
  imageUrl: string | null;
  maxPrice: number;
  totalSold: number;
}

// Cách sắp xếp kết quả catalog công khai.
export type ProductSortOption = "RELEVANCE" | "MOST_SOLD";

// Điều kiện lọc và cursor dùng để tải thêm kết quả tìm kiếm.
export interface ProductCatalogQuery {
  keyword?: string;
  categoryId?: number;
  brandIds?: number[];
  locations?: string[];
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSortOption;
  cursor?: string;
  size?: number;
}

// Một batch kết quả tìm kiếm kèm cursor cho batch tiếp theo.
export interface ProductCatalogPage {
  items: ProductCatalogItem[];
  nextCursor: string | null;
  hasNext: boolean;
  brands: ProductBrandOption[];
}
