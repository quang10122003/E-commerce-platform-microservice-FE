import type { OrderCancelReason, OrderStatus, UserOrder } from "@/types/user/order";

// Khoảng thời gian thống kê; from/to là thời điểm có offset của trình duyệt.
export interface ShopAnalyticsQuery {
  from: string;
  to: string;
}

export interface AnalyticsMoney {
  orderCount: number;
  amount: number;
}

// Mỗi nhóm tiền tính theo mốc thời gian riêng: đặt, thanh toán, giao xong hoặc hủy.
export interface AnalyticsOverview {
  placed: AnalyticsMoney;
  received: AnalyticsMoney;
  held: AnalyticsMoney;
  expectedCod: AnalyticsMoney;
  awaitingPayment: AnalyticsMoney;
  lost: AnalyticsMoney;
  refundDue: AnalyticsMoney;
  buyerCount: number;
}

export interface AnalyticsDailyPoint {
  bucketStart: string;
  placedOrders: number;
  placedAmount: number;
  receivedAmount: number;
  paidOnlineAmount: number;
  cancelledAmount: number;
}

export interface AnalyticsSlice<Key extends string = string> {
  key: Key;
  orderCount: number;
  amount: number;
}

export interface AnalyticsCancelSlice {
  cancelledBy: NonNullable<UserOrder["cancelledBy"]>;
  reason: OrderCancelReason | null;
  orderCount: number;
  amount: number;
}

export interface AnalyticsTopProduct {
  productId: number | null;
  productName: string;
  imageUrl: string | null;
  quantity: number;
  revenue: number;
}

export interface ShopAnalytics {
  from: string;
  to: string;
  overview: AnalyticsOverview;
  previousOverview: AnalyticsOverview;
  saleDiscount: number;
  timeline: AnalyticsDailyPoint[];
  ordersByHour: number[];
  byStatus: AnalyticsSlice<OrderStatus>[];
  byPaymentMethod: AnalyticsSlice<"COD" | "VNPAY">[];
  byPriceType: AnalyticsSlice<"NORMAL" | "SALE">[];
  cancellations: AnalyticsCancelSlice[];
  processingTime: { confirmMinutes: number | null; handoverMinutes: number | null; deliveryMinutes: number | null };
  topProducts: AnalyticsTopProduct[];
}
