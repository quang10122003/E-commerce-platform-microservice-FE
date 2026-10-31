import type { ApiResponse } from "@/types/shared/api";
import type { ProductStatus } from "@/types/user/product";

// Giá trị phân loại của biến thể trong giỏ hàng.
export interface CartVariantOption {
  name: string;
  value: string;
}

// Giá ưu đãi của một đơn vị; endsAt giữ nguyên ISO offset từ OffsetDateTime của BE.
export interface CartItemSale {
  salePrice: number;
  endsAt: string;
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
  sale: CartItemSale | null;
}

// Dữ liệu hiển thị đã xác định giá còn hiệu lực, không sửa giá gốc BE trả về.
export interface CartPricedItem extends CartItem {
  effectivePrice: number;
  hasSale: boolean;
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

// Hợp đồng POST /api/cart/quote chỉ nhận biến thể và số lượng đã chọn.
export interface CartQuoteRequest {
  items: { variantId: number; quantity: number }[];
}

export interface CartQuoteResponse {
  totalAmount: number;
}

// Query param của API thêm variant vào giỏ hàng.
export interface AddCartItemParams {
  productVariantId: number;
}

// Body tùy chọn; quantity null hoặc không truyền thì backend thêm một sản phẩm.
export interface AddCartItemRequest {
  quantity?: number | null;
}

// Gộp query và body để Redux gửi đúng hợp đồng CartCotroller.
export interface AddCartItemArgs extends AddCartItemParams {
  request?: AddCartItemRequest;
}

// Backend trả 201 rỗng; BFF có thể giữ envelope ApiResponse với data null.
export type AddCartItemResponse = ApiResponse<null> | null;
