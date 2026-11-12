import { PAYMENT_STATUS_LABELS } from "@/lib/utils/order.utils";
import { parseOffsetDateTime } from "@/utils/date-time.utils";
import type { ShopOrder, ShopOrderQuery, ShopOrderTab } from "@/types/shop/order";

const KEYWORD_MAX_LENGTH = 100;

// Nội dung hủy nhìn từ phía shop theo tác nhân hủy.
export const SHOP_CANCELLED_BY_LABELS: Record<NonNullable<ShopOrder["cancelledBy"]>, string> = {
  USER: "Khách hàng đã hủy đơn",
  SHOP: "Shop đã hủy đơn",
  SYSTEM: "Hệ thống tự hủy do thanh toán không thành công",
};

// Chuẩn hóa searchParams của trang; giá trị sai bị bỏ để không gửi query lỗi cho BE.
export function parseShopOrderQuery(params: Record<string, string | string[] | undefined>): ShopOrderQuery {
  const read = (key: string) => (typeof params[key] === "string" ? (params[key] as string).trim() : "");
  const paymentMethod = read("paymentMethod");
  const keyword = read("keyword").slice(0, KEYWORD_MAX_LENGTH);
  const from = parseOffsetDateTime(read("from")) ? read("from") : undefined;
  const to = parseOffsetDateTime(read("to")) ? read("to") : undefined;
  // Khoảng ngược thì bỏ cả hai mốc thay vì để BE trả lỗi 400.
  const validRange = !from || !to || Date.parse(from) <= Date.parse(to);
  return {
    paymentMethod: paymentMethod === "COD" || paymentMethod === "VNPAY" ? paymentMethod : undefined,
    keyword: keyword || undefined,
    from: validRange ? from : undefined,
    to: validRange ? to : undefined,
  };
}

// Dựng query string dùng chung cho URL trang và request tới BE.
export function toShopOrderSearchParams(query: ShopOrderQuery): URLSearchParams {
  const params = new URLSearchParams();
  for (const key of ["paymentMethod", "keyword", "from", "to"] as const) {
    if (query[key]) params.set(key, query[key]);
  }
  return params;
}

export function getShopOrdersUrl(query: ShopOrderQuery): string {
  const params = toShopOrderSearchParams(query).toString();
  return params ? `/shop/orders?${params}` : "/shop/orders";
}

// Đếm số đơn của từng tab trên danh sách BE đã lọc theo thanh toán, từ khóa và thời gian.
export function countShopOrdersByTab(orders: readonly ShopOrder[]): Record<ShopOrderTab, number> {
  const counts: Record<ShopOrderTab, number> = {
    ALL: orders.length, PENDING_CONFIRMATION: 0, PENDING_PICKUP: 0, SHIPPING: 0, DONE: 0, CANCEL: 0,
  };
  for (const order of orders) counts[order.status] += 1;
  return counts;
}

// Tiền hàng theo giá gốc và phần giảm nhờ Flash Sale; tổng thanh toán lấy totalAmount của BE.
export function getShopOrderPriceSummary(order: Pick<ShopOrder, "items" | "totalAmount">) {
  const originalTotal = order.items.reduce((sum, item) => sum + item.originalUnitPrice * item.quantity, 0);
  return { originalTotal, saleDiscount: Math.max(0, originalTotal - order.totalAmount), totalAmount: order.totalAmount };
}

// Trạng thái tiền của đơn với shop: COD chỉ thu khi giao xong, VNPay theo trạng thái payment.
export function getShopPaymentState(order: Pick<ShopOrder, "status" | "payment">): { label: string; paid: boolean } {
  if (order.payment.method === "COD") {
    if (order.status === "DONE") return { label: "Đã thu tiền COD", paid: true };
    return { label: order.status === "CANCEL" ? "Không thu tiền" : "Thu hộ COD", paid: false };
  }
  return { label: PAYMENT_STATUS_LABELS[order.payment.status] ?? "Chưa thanh toán", paid: order.payment.status === "DONE" };
}

// Hành động kế tiếp shop được làm, khớp rule BE: COD xác nhận tay, VNPay tự xác nhận khi thanh toán; SHIPPING trở đi do job.
export function getShopNextAction(order: Pick<ShopOrder, "status" | "payment">): string | null {
  if (order.status === "PENDING_CONFIRMATION") return order.payment.method === "COD" ? "Xác nhận đơn" : null;
  if (order.status === "PENDING_PICKUP") return "Đã giao cho ĐVVC";
  return null;
}
