import type { CheckoutPaymentMethod } from "@/types/user/checkout";
import type { OrderStatus, UserOrder } from "@/types/user/order";

// Đơn của shop có đủ trường như đơn của user, thêm snapshot người mua lấy từ checkout.
export interface ShopOrder extends UserOrder {
  buyer: { recipientName: string | null; email: string; shippingAddress: string; phone: string | null; note: string | null };
}

// Tab trạng thái lọc ngay trên danh sách đã tải để số đếm mỗi tab luôn đúng.
export type ShopOrderTab = OrderStatus | "ALL";

// Bộ lọc gửi lên BE qua URL; from/to là thời điểm có offset của trình duyệt.
export interface ShopOrderQuery {
  paymentMethod?: CheckoutPaymentMethod;
  keyword?: string;
  from?: string;
  to?: string;
}
