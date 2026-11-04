import type { CheckoutItem, CheckoutItemsRequest, CheckoutShopGroup, CheckoutPaymentMethod, CreateCheckoutRequest } from "@/types/user/checkout";

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
export function buildCreateCheckoutRequest(items: CheckoutItem[], totalAmount: number, shippingAddress: string, paymentMethod: CheckoutPaymentMethod, note: string): CreateCheckoutRequest {
  return {
    items: items.flatMap((item) => {
      const lines: CreateCheckoutRequest["items"] = [];
      if (item.saleQuantity > 0) lines.push({ variantId: item.variantId, quantity: item.saleQuantity, sale: true });
      if (item.regularQuantity > 0) lines.push({ variantId: item.variantId, quantity: item.regularQuantity, sale: false });
      return lines;
    }),
    totalAmount, shippingAddress, paymentMethod,
    ...(note.trim() ? { note: note.trim() } : {}),
  };
}
