import type { CheckoutPaymentMethod } from "@/types/user/checkout";
import type { OrderStatus } from "@/types/user/order";

export interface ShopOverviewDailyPoint {
  date: string;
  orderCount: number;
  cancelledCount: number;
  revenue: number;
}

export interface ShopOverviewRecentOrder {
  orderId: number;
  recipientName: string | null;
  firstProductName: string | null;
  itemCount: number;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: CheckoutPaymentMethod;
  createdAt: string;
}

// Doanh thu không gồm đơn đã hủy, tính theo ngày đặt đơn.
export interface SellerOrderOverview {
  today: { orderCount: number; revenue: number; cancelledCount: number; yesterdayOrderCount: number; yesterdayRevenue: number };
  ordersByStatus: Record<OrderStatus, number>;
  last7Days: ShopOverviewDailyPoint[];
  reviews: { totalReviews: number; averageRating: number | null; newReviewsLast7Days: number };
  recentOrders: ShopOverviewRecentOrder[];
}
