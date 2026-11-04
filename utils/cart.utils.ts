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

// Tạo lỗi theo từng dòng để người mua chỉnh đúng sản phẩm thiếu tồn kho.
export function getCartStockErrors(items: CartItem[]): Record<number, string> {
  return Object.fromEntries(items
    .filter((item) => isCartItemAvailable(item) && item.quantity > item.stockQuantity)
    .map((item) => [item.cartItemId, `Chỉ còn ${item.stockQuantity} sản phẩm trong kho. Vui lòng giảm số lượng trước khi mua hàng.`]));
}

// Tổng kết số lượng sản phẩm có thể thanh toán; tổng tiền do API quote quyết định.
export function getCartSummary(items: CartPricedItem[]) {
  const availableItems = items.filter(isCartItemAvailable);
  return {
    stockError: Object.values(getCartStockErrors(availableItems))[0] ?? null,
    itemCount: availableItems.length,
    quantity: availableItems.reduce((total, item) => total + item.quantity, 0),
    shopCount: new Set(availableItems.map((item) => item.shopId)).size,
  };
}

// Chờ BE phân bổ lại ưu đãi khi số lượng tạm khác số lượng đã được báo giá.
export function applyCartQuantityDrafts(items: CartPricedItem[], drafts: Record<number, number>): CartPricedItem[] {
  return items.map((item) => {
    const quantity = drafts[item.productVariantId];
    return quantity === undefined ? item : { ...item, quantity, pricingPending: quantity !== item.quantity };
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
    const hasSale = !!sale && item.saleQuantity > 0 && Number.isFinite(Date.parse(sale.endsAt))
      && !getSaleCountdown(sale.endsAt, now).expired
      && Number.isFinite(sale.salePrice) && sale.salePrice >= 0 && sale.salePrice < item.price;
    const saleQuantity = hasSale ? item.saleQuantity : 0;
    const regularQuantity = hasSale ? item.regularQuantity : item.quantity;
    const effectivePrice = hasSale && sale ? sale.salePrice : item.price;
    return {
      ...item, saleQuantity, regularQuantity, effectivePrice, hasSale,
      lineTotal: effectivePrice * saleQuantity + item.price * regularQuantity,
      pricingPending: false,
    };
  });
}
