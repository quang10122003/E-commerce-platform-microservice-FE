import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import type { OrderCancelReason, OrderCancelScope, OrderPaymentStatus, OrderStatus, UserOrder, UserOrderQuery } from "@/types/user/order";

// Tab trạng thái theo đúng enum OrderStatus của BE; null là tab "Tất cả".
export const ORDER_STATUS_TABS: ReadonlyArray<{ status: OrderStatus | null; label: string }> = [
  { status: null, label: "Tất cả" },
  { status: "PENDING_CONFIRMATION", label: "Chờ xác nhận" },
  { status: "PENDING_PICKUP", label: "Chờ lấy hàng" },
  { status: "SHIPPING", label: "Đang giao" },
  { status: "DONE", label: "Hoàn thành" },
  { status: "CANCEL", label: "Đã hủy" },
];

// Nhãn hiển thị của từng trạng thái đơn, lấy lại từ danh sách tab.
export const ORDER_STATUS_LABELS =Object.fromEntries(
  ORDER_STATUS_TABS.filter((tab) => tab.status).map((tab) => [tab.status, tab.label]),
) as Record<OrderStatus, string>;

export const PAYMENT_STATUS_LABELS: Record<OrderPaymentStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PENDING: "Chờ thanh toán",
  DONE: "Đã thanh toán",
  CANCEL: "Thanh toán đã hủy",
};

// Nhãn hiển thị của mọi lý do hủy theo enum OrderCancelReason của BE.
export const CANCEL_REASON_LABELS: Record<OrderCancelReason, string> = {
  CHANGE_MIND: "Tôi muốn đổi ý, không mua nữa",
  WRONG_ADDRESS: "Muốn đổi địa chỉ giao hàng",
  FOUND_CHEAPER: "Tìm thấy nơi khác giá tốt hơn",
  DUPLICATE_ORDER: "Đặt trùng đơn",
  OUT_OF_STOCK: "Sản phẩm đã hết hàng",
  CANNOT_DELIVER: "Không thể giao tới địa chỉ người mua",
  BUYER_UNREACHABLE: "Không liên hệ được người mua",
  PRODUCT_INFO_ERROR: "Sai giá hoặc thông tin sản phẩm",
  OTHER: "Lý do khác",
};

// Lý do mỗi phía được chọn, theo thứ tự hiển thị trong dialog; BE từ chối lý do của phía còn lại.
export const CANCEL_REASONS_BY_SCOPE: Record<OrderCancelScope, OrderCancelReason[]> = {
  user: ["CHANGE_MIND", "WRONG_ADDRESS", "FOUND_CHEAPER", "DUPLICATE_ORDER", "OTHER"],
  shop: ["OUT_OF_STOCK", "CANNOT_DELIVER", "BUYER_UNREACHABLE", "PRODUCT_INFO_ERROR", "OTHER"],
};

// Khớp rule BE cho cả user và shop: chỉ hủy đơn COD trước khi giao cho đơn vị vận chuyển.
export function canCancelOrder(order: Pick<UserOrder, "status" | "payment">): boolean {
  return order.payment.method === "COD" && (order.status === "PENDING_CONFIRMATION" || order.status === "PENDING_PICKUP");
}

// Hiển thị thuộc tính biến thể thành nhãn dễ đọc thay vì chuỗi JSON từ API.
export function formatVariantAttributes(value: string | null): string | null {
  if (!value) return null;

  try {
    const attributes: unknown = JSON.parse(value);
    if (Array.isArray(attributes)) {
      const formatted = attributes.flatMap((attribute) => {
        if (!attribute || typeof attribute !== "object") return [];
        const { name, value: attributeValue } = attribute as Record<string, unknown>;
        return typeof name === "string" && typeof attributeValue === "string" ? [`${name}: ${attributeValue}`] : [];
      }).join(" · ");
      return formatted || null;
    }
  } catch {
    return value;
  }

  return value;
}

// Chuẩn hóa searchParams từ URL; giá trị lạ quay về mặc định để không gửi query sai cho BE.
export function parseOrderQuery(params: { status?: string | string[] }): UserOrderQuery {
  const status = ORDER_STATUS_TABS.find((tab) => tab.status !== null && tab.status === params.status)?.status ?? null;
  return { status };
}

// Dựng URL trang đơn hàng giữ trạng thái đang lọc.
export function getOrdersUrl({ status }: UserOrderQuery): string {
  return status ? `/user/orders?status=${status}` : "/user/orders";
}

// Đổi OffsetDateTime từ BE sang giờ trình duyệt theo định dạng dùng chung; chỉ gọi phía client.
export function formatOrderDate(value: string): string {
  const local = toLocalDateTimeInput(value);
  return local ? `${formatSellerProductDate(local)} · ${local.slice(11)}` : "—";
}

export type OrderTimelineStep = {
  key: string;
  label: string;
  time: string | null;
  state: "done" | "upcoming" | "cancelled";
};

// Dựng dòng thời gian kiểu sàn TMĐT từ các mốc BE trả về; đơn bị hủy dừng ở bước hủy.
export function buildOrderTimeline(
  order: Pick<UserOrder, "status" | "createdAt" | "confirmedAt" | "shippedAt" | "deliveredAt" | "cancelledAt" | "payment">,
): OrderTimelineStep[] {
  const steps: Array<Omit<OrderTimelineStep, "state"> & { reached: boolean }> = [
    { key: "placed", label: "Đặt hàng thành công", time: order.createdAt, reached: true },
  ];
  // Chỉ đơn VNPay có bước thanh toán; COD thu tiền khi giao hàng.
  if (order.payment.method === "VNPAY") {
    steps.push({ key: "paid", label: "Đã thanh toán", time: order.payment.paidAt, reached: order.payment.status === "DONE" });
  }
  const reachedPickup = ["PENDING_PICKUP", "SHIPPING", "DONE"].includes(order.status);
  const reachedShipping = ["SHIPPING", "DONE"].includes(order.status);
  steps.push(
    { key: "confirmed", label: "Shop đã xác nhận", time: order.confirmedAt, reached: reachedPickup || !!order.confirmedAt },
    { key: "shipping", label: "Đã giao cho đơn vị vận chuyển", time: order.shippedAt, reached: reachedShipping || !!order.shippedAt },
    { key: "done", label: "Giao hàng thành công", time: order.deliveredAt, reached: order.status === "DONE" },
  );
  if (order.status !== "CANCEL") {
    return steps.map(({ reached, ...step }) => ({ ...step, state: reached ? "done" : "upcoming" }));
  }
  // Đơn hủy: giữ các bước đã qua rồi thêm bước hủy ở cuối.
  return [
    ...steps.filter((step) => step.reached).map(({ key, label, time }) => ({ key, label, time, state: "done" as const })),
    { key: "cancelled", label: "Đơn hàng đã bị hủy", time: order.cancelledAt, state: "cancelled" },
  ];
}
