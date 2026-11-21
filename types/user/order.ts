import type { CheckoutPaymentMethod } from "@/types/user/checkout";

export type OrderStatus = "PENDING_CONFIRMATION" | "PENDING_PICKUP" | "SHIPPING" | "DONE" | "CANCEL";
export type OrderPaymentStatus = "UNPAID" | "PENDING" | "DONE" | "CANCEL";
export type OrderCancelReason = "CHANGE_MIND" | "WRONG_ADDRESS" | "FOUND_CHEAPER" | "DUPLICATE_ORDER"
  | "OUT_OF_STOCK" | "CANNOT_DELIVER" | "BUYER_UNREACHABLE" | "PRODUCT_INFO_ERROR" | "OTHER";
// Phía hủy đơn: user và shop có danh sách lý do riêng, khớp rule allowedFor của BE.
export type OrderCancelScope = "user" | "shop";

export interface UserOrderItem {
  orderItemId: number;
  productId: number;
  variantId: number | null;
  productName: string;
  variantAttributes: string | null;
  imageUrl: string | null;
  quantity: number;
  originalUnitPrice: number;
  unitPrice: number;
  totalAmount: number;
  // Món này đã được người mua đánh giá chưa.
  reviewed: boolean;
}

export interface UserOrder {
  orderId: number;
  checkoutId: number;
  status: OrderStatus;
  shop: { shopId: number; shopName: string; shopLogoUrl: string | null };
  priceType: "NORMAL" | "SALE";
  totalAmount: number;
  // BE chỉ trả paymentUrl khi đơn VNPay còn hạn thanh toán.
  payment: { method: CheckoutPaymentMethod; status: OrderPaymentStatus; paymentUrl: string | null; expiresAt: string | null; paidAt: string | null };
  items: UserOrderItem[];
  // Tác nhân hủy đơn, không phải lý do lỗi thanh toán.
  cancelledBy: "USER" | "SHOP" | "SYSTEM" | null;
  // Lý do user/shop chọn khi hủy; null khi hệ thống tự hủy.
  cancelReason: OrderCancelReason | null;
  cancelledAt: string | null;
  // Mốc shop (hoặc hệ thống với VNPay) xác nhận và mốc giao cho đơn vị vận chuyển.
  confirmedAt: string | null;
  shippedAt: string | null;
  // Mốc job tự chuyển đơn sang hoàn thành.
  deliveredAt: string | null;
  createdAt: string;
  // Đơn đã giao thành công và còn trong 7 ngày để đánh giá, BE tính theo giờ server.
  reviewable: boolean;
}

// Dữ liệu form hủy đơn gửi lên BFF.
export interface CancelOrderForm {
  reason: OrderCancelReason | "";
}

export interface UserOrderQuery {
  status: OrderStatus | null;
  keyword: string | null;
  page: number;
}

export interface UserOrderPage {
  items: UserOrder[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
