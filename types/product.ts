// DTO gửi lên backend khi tạo sản phẩm mới (khớp với CreateProductRequest.java).
export interface CreateProductRequest {
  categoryId: number;
  brandId: number | null;
  name: string;
  description: string;
  attributes: ProductAttributeRequest[];
  variants: ProductVariantRequest[];
}

// Thuộc tính phân loại của sản phẩm (ví dụ: Màu sắc, Kích cỡ).
export interface ProductAttributeRequest {
  name: string;
  values: string[];
}

// Chỉ mục chọn giá trị thuộc tính cho từng biến thể.
export interface AttributeSelection {
  attributeIndex: number;
  valueIndex: number;
}

// Thông tin ảnh của từng biến thể.
export interface VariantImageRequest {
  primary: boolean;
}

// Chi tiết 1 biến thể sản phẩm gửi trong request tạo sản phẩm.
export interface ProductVariantRequest {
  price: number;
  stockQuantity: number;
  attributeSelections: AttributeSelection[];
  images: VariantImageRequest[];
}

// Metadata ánh xạ file ảnh biến thể với vị trí trong mảng variants (khớp với VariantImageMeta.java).
export interface VariantImageMeta {
  variantIndex: number;
  imageIndex: number;
}

// DTO phản hồi chi tiết 1 biến thể sản phẩm từ backend (ProductResponse.VariantResponse).
export interface VariantResponse {
  id: number;
  sku: string;
  price: number;
  stockQuantity: number;
}

// DTO phản hồi khi tạo sản phẩm hoặc xem chi tiết sản phẩm từ backend (ProductResponse.java).
export interface ProductResponse {
  id: number;
  categoryId: number;
  brandId?: number | null;
  name: string;
  description?: string;
  imageUrl: string;
  active: boolean;
  totalSold: number;
  variants: VariantResponse[];
}

// Kiểu dữ liệu sản phẩm hiển thị trong bảng danh sách sản phẩm của người bán.
export interface SellerProductListItem {
  id: number;
  name: string;
  categoryName: string;
  categoryId: number;
  imageUrl: string;
  minPrice: number;
  maxPrice: number;
  totalStock: number;
  variantCount: number;
  status: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
  createdAt: string;
}

// Danh mục ngành hàng dùng trong dropdown chọn danh mục.
export interface ProductCategoryOption {
  id: number;
  name: string;
  icon?: string;
}

// Thương hiệu dùng trong dropdown chọn thương hiệu.
export interface ProductBrandOption {
  id: number;
  name: string;
}

// Trạng thái hiển thị của sản phẩm trong catalog công khai.
export type ProductStatus = "ACTIVE" | "INACTIVE";

// Sản phẩm rút gọn được Elasticsearch trả về cho trang tìm kiếm.
export interface ProductCatalogItem {
  id: number;
  name: string;
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
