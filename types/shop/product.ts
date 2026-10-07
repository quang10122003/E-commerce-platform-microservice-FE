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

// Dữ liệu chi tiết GET /api/products/shop/{productId} để giữ đúng ID khi cập nhật.
export interface ShopProductDetail {
  id: number;
  categoryId: number;
  brandId: number | null;
  name: string;
  description: string | null;
  imageUrl: string | null;
  attributes: ShopProductAttribute[];
  variants: ShopProductVariant[];
}

export interface ShopProductAttribute {
  id: number;
  name: string;
  values: { id: number; value: string }[];
}

export interface ShopProductVariant {
  id: number;
  sku: string;
  price: number;
  stockQuantity: number;
  attributeSelections: AttributeSelection[];
  images: { id: number; imageUrl: string; primary: boolean }[];
}

// JSON của PUT chỉ gửi ID bản ghi cần giữ; SKU được backend tự sinh lại.
export interface UpdateProductRequest {
  categoryId: number;
  brandId: number | null;
  name: string;
  description: string;
  attributes: UpdateProductAttribute[];
  variants: UpdateProductVariant[];
}

export interface UpdateProductAttribute {
  id?: number;
  name: string;
  values: { id?: number; value: string }[];
}

export interface UpdateProductVariant {
  id?: number;
  price: number;
  stockQuantity: number;
  attributeSelections: AttributeSelection[];
  images: { id?: number; primary: boolean }[];
}

// Trạng thái hiển thị và lọc sản phẩm của người bán.
export type SellerProductStatus = "ACTIVE" | "OUT_OF_STOCK" | "INACTIVE";

// Thuộc tính đã chọn của một phân loại.
export interface SellerVariantAttribute {
  attributeId: number;
  name: string;
  value: string;
}

// Phân loại sản phẩm do API quản lý shop trả về.
export interface SellerProductVariant {
  id: number;
  sku: string;
  price: number;
  stockQuantity: number;
  attributes: SellerVariantAttribute[];
}

// Một sản phẩm trong trang quản lý shop.
export interface SellerProductItem {
  id: number;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  categoryId: number;
  categoryName: string;
  status: SellerProductStatus;
  variants: SellerProductVariant[];
}

// Kết quả phân trang của API quản lý sản phẩm.
export interface SellerProductPage {
  items: SellerProductItem[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

// Điều kiện lọc được truyền qua URL và API.
export interface SellerProductQuery {
  page: number;
  size: number;
  categoryId?: number;
  status?: SellerProductStatus;
  keyword?: string;
}
