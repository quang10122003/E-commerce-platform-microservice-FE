import type { ProductStatus } from "@/types/product";

// Giá trị phân loại của biến thể trong giỏ hàng.
export interface CartVariantOption {
  name: string;
  value: string;
}

// Một dòng sản phẩm trong response giỏ hàng của BE.
export interface CartItem {
  cartItemId: number;
  productId: number;
  productVariantId: number;
  shopId: number;
  shopName: string | null;
  productName: string;
  imageUrl: string | null;
  hasOption: boolean;
  variantOptions: CartVariantOption[];
  price: number;
  quantity: number;
  stockQuantity: number;
  status: ProductStatus;
}

// Response GET /api/cart; giữ nguyên tên CartId theo BE.
export interface CartResponse {
  CartId: number | null;
  totalItems: number;
  totalQuantity: number;
  item: CartItem[];
}

// Dữ liệu gửi khi cập nhật số lượng tuyệt đối của một biến thể.
export interface UpdateCartQuantityRequest {
  productVariantId: number;
  quantity: number;
}
