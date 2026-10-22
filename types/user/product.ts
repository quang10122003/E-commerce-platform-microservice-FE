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
  // Mức giảm cao nhất trong các variant có sale hợp lệ, không dùng để tính giá card.
  maxDiscountPercent?: number | null;
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

// Tham số đường dẫn của GET chi tiết sản phẩm, không có request body.
export interface UserProductDetailParams {
  productId: number;
}

// Khoảng giá từ GET /api/products/{productId}/price-range, không phải giá khuyến mãi.
export interface ProductPriceRangeResponse {
  productId: number;
  minPrice: number;
  maxPrice: number;
}

// Giá trị thuộc tính để đối chiếu tổ hợp variant bằng ID.
export interface UserProductAttributeValue {
  id: number;
  value: string;
}

// Thuộc tính phân loại và các lựa chọn của sản phẩm.
export interface UserProductAttribute {
  id: number;
  name: string;
  values: UserProductAttributeValue[];
}

// Ảnh riêng của variant, giữ cờ ảnh chính từ backend.
export interface UserProductVariantImage {
  id: number;
  imageUrl: string;
  primary: boolean;
}

// Trạng thái tồn kho của variant, độc lập với quota Flash Sale.
export type UserProductVariantStatus = "AVAILABLE" | "OUT_OF_STOCK";

// Variant công khai chứa giá, tồn kho và ID tổ hợp thuộc tính.
export interface UserProductVariant {
  id: number;
  price: number;
  stockQuantity: number;
  status: UserProductVariantStatus;
  attributeValueIds: number[];
  images: UserProductVariantImage[];
}

// DTO UserProductDetailResponse; sản phẩm không có variant thì defaultVariantId là null.
export interface UserProductDetailResponse {
  id: number;
  shopId: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  status: ProductStatus;
  location: string | null;
  totalSold: number;
  defaultVariantId: number | null;
  attributes: UserProductAttribute[];
  variants: UserProductVariant[];
}

// Tham số đường dẫn để kiểm tra sale của variant thuộc đúng sản phẩm.
export interface VariantSaleParams extends UserProductDetailParams {
  variantId: number;
}

// Ưu đãi đang áp dụng; endsAt là chuỗi ISO có offset từ OffsetDateTime.
export interface VariantSaleOffer {
  discountPercent: number;
  salePrice: number;
  endsAt: string;
}

// DTO VariantSaleResponse; originalPrice luôn là giá hiện tại của variant, sale null khi không có ưu đãi.
export interface VariantSaleResponse {
  variantId: number;
  originalPrice: number;
  sale: VariantSaleOffer | null;
}
