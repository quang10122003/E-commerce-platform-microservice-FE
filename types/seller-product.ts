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
