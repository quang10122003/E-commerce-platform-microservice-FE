import type { CartItem, CartPricedItem } from "@/types/user/cart";
import { getSaleCountdown } from "@/lib/utils/user-flash-sale.utils";

// Trạng thái ngừng bán hoặc không còn tồn kho đều không thể thanh toán.
export function isCartItemAvailable(item: CartItem): boolean {
  return item.status === "ACTIVE" && item.stockQuantity > 0;
}

// Nhóm các dòng giỏ hàng theo cửa hàng, giữ thứ tự BE trả về.
export function groupCartItemsByShop<T extends CartItem>(items: T[]) {
  const groups = new Map<number, { shopId: number; name: string; items: T[] }>();
  for (const item of items) {
    const group = groups.get(item.shopId);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(item.shopId, { shopId: item.shopId, name: item.shopName || "Cửa hàng", items: [item] });
    }
  }
  return Array.from(groups.values());
}

// Tổng kết số lượng sản phẩm có thể thanh toán; tổng tiền do API quote quyết định.
export function getCartSummary(items: CartPricedItem[]) {
  const availableItems = items.filter(isCartItemAvailable);
  return {
    itemCount: availableItems.length,
    quantity: availableItems.reduce((total, item) => total + item.quantity, 0),
    shopCount: new Set(availableItems.map((item) => item.shopId)).size,
  };
}

// Áp dụng số lượng tạm để giá từng dòng và tổng tiền cập nhật ngay khi bấm.
export function applyCartQuantityDrafts<T extends CartItem>(items: T[], drafts: Record<number, number>): T[] {
  return items.map((item) => {
    const quantity = drafts[item.productVariantId];
    return quantity === undefined ? item : { ...item, quantity };
  });
}
// Chỉ gửi các số lượng khác dữ liệu BE, bỏ qua dòng sắp bị xóa.
export function getCartQuantityChanges(items: CartItem[], drafts: Record<number, number>, excludedVariantId?: number) {
  return items.flatMap((item) => {
    const quantity = drafts[item.productVariantId];
    return quantity !== undefined && quantity !== item.quantity && item.productVariantId !== excludedVariantId
      ? [{ productVariantId: item.productVariantId, quantity }]
      : [];
  });
}
// Chỉ áp dụng giá giảm hợp lệ trước deadline; helper hiện có xử lý ISO có offset.
export function applyCartItemPricing(items: CartItem[], now: number): CartPricedItem[] {
  return items.map((item) => {
    const sale = item.sale;
    const hasSale = !!sale && Number.isFinite(Date.parse(sale.endsAt))
      && !getSaleCountdown(sale.endsAt, now).expired
      && Number.isFinite(sale.salePrice) && sale.salePrice >= 0 && sale.salePrice < item.price;
    return { ...item, effectivePrice: hasSale && sale ? sale.salePrice : item.price, hasSale };
  });
}

// Tìm deadline gần nhất để cả giỏ chỉ cần một timer, không cập nhật countdown mỗi giây.
export function getNextCartSaleExpiry(items: CartItem[], now: number): number | null {
  const deadlines = items.flatMap((item) => {
    const deadline = item.sale ? Date.parse(item.sale.endsAt) : NaN;
    return Number.isFinite(deadline) && deadline > now ? [deadline] : [];
  });
  return deadlines.length ? Math.min(...deadlines) : null;
}
