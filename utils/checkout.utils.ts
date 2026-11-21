import type { CheckoutItem, CheckoutItemsRequest, CheckoutShopGroup, CheckoutPaymentMethod, CreateCheckoutRequest, CheckoutFailedResponse, CheckoutSucceededResponse, CreateCheckoutResponse } from "@/types/user/checkout";

// Chỉ giữ mã biến thể và số lượng trên URL, không mang theo giá hoặc phân bổ sale cũ.
export function getCheckoutUrl(items: CheckoutItemsRequest["items"]): string {
  const params = new URLSearchParams({ items: items.map((item) => `${item.variantId}:${item.quantity}`).join(",") });
  return `/checkout?${params}`;
}

// Từ chối toàn bộ lựa chọn sai để không âm thầm giảm số lượng người mua đã chọn.
export function parseCheckoutItems(value: string | string[] | undefined): CheckoutItemsRequest | null {
  if (typeof value !== "string" || !value) return null;
  const entries = value.split(",");
  if (entries.length > 50) return null;
  const items: CheckoutItemsRequest["items"] = [];
  const ids = new Set<number>();
  for (const entry of entries) {
    if (!/^[1-9]\d*:[1-9]\d*$/.test(entry)) return null;
    const [variantId, quantity] = entry.split(":").map(Number);
    if (!Number.isSafeInteger(variantId) || !Number.isSafeInteger(quantity) || quantity > 2_147_483_647 || ids.has(variantId)) return null;
    ids.add(variantId);
    items.push({ variantId, quantity });
  }
  return { items };
}

// Nhóm theo shop, giữ mỗi biến thể cùng phân bổ sale và thường trong một dòng.
export function groupCheckoutItems(items: CheckoutItem[]): CheckoutShopGroup[] {
  const groups = new Map<number, CheckoutShopGroup>();
  for (const item of items) {
    let group = groups.get(item.shopId);
    if (!group) {
      group = { shopId: item.shopId, shopName: item.shopName, items: [] };
      groups.set(item.shopId, group);
    }
    group.items.push(item);
  }
  return Array.from(groups.values());
}

// Giữ nguyên phân bổ và tổng tiền đang hiển thị, không tính lại giá hoặc sale khi đặt hàng.
export function buildCreateCheckoutRequest(items: CheckoutItem[], totalAmount: number, shippingAddress: string, recipientName: string, phone: string, paymentMethod: CheckoutPaymentMethod, note: string): CreateCheckoutRequest {
  return {
    items: items.flatMap((item) => {
      const lines: CreateCheckoutRequest["items"] = [];
      if (item.saleQuantity > 0) lines.push({ variantId: item.variantId, quantity: item.saleQuantity, sale: true });
      if (item.regularQuantity > 0) lines.push({ variantId: item.variantId, quantity: item.regularQuantity, sale: false });
      return lines;
    }),
    totalAmount, shippingAddress, recipientName, phone, paymentMethod,
    ...(note.trim() ? { note: note.trim() } : {}),
  };
}

// Chỉ tiếp nhận kết quả đúng checkout và đúng kiểu dữ liệu trước khi cập nhật nghiệp vụ.
export function isCheckoutStreamResult(value: unknown, checkoutId: number): value is CheckoutFailedResponse | CheckoutSucceededResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  if (data.checkoutId !== checkoutId || typeof data.checkoutStatus !== "string" || typeof data.occurredAt !== "string" || !Number.isFinite(Date.parse(data.occurredAt))) return false;
  if ("reason" in data) return typeof data.reason === "string" && typeof data.reasonCode === "string";
  return ["COD", "VNPAY"].includes(String(data.paymentMethod)) && Array.isArray(data.orderIds)
    && data.orderIds.every((id: unknown) => typeof id === "number" && Number.isSafeInteger(id) && id > 0)
    && typeof data.totalAmount === "number" && Number.isFinite(data.totalAmount) && data.totalAmount >= 0
    && (data.urlPayment === null || typeof data.urlPayment === "string");
}

export function isCheckoutResultResponse(value: unknown, checkoutId: number): value is CreateCheckoutResponse {
  if (!value || typeof value !== "object") return false;
  const data = value as Record<string, unknown>;
  return data.checkoutId === checkoutId && ["PROCESSING", "DONE", "CANCEL"].includes(String(data.status))
    && (data.paymentMethod === null || ["COD", "VNPAY"].includes(String(data.paymentMethod)))
    && Array.isArray(data.orderIds) && data.orderIds.every((id: unknown) => typeof id === "number" && Number.isSafeInteger(id) && id > 0)
    && (data.urlPayment === null || typeof data.urlPayment === "string") && (data.reason === null || typeof data.reason === "string");
}

// Chỉ cho phép URL thanh toán HTTP(S), giữ nguyên query đã được backend ký.
export function getCheckoutPaymentUrl(value: string | null): string | null {
  if (!value?.trim()) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) && !url.username && !url.password ? value.trim() : null;
  } catch {
    return null;
  }
}
