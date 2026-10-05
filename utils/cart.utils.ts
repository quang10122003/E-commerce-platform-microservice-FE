import type { CartItem } from "@/types/cart";

// Trạng thái ngừng bán hoặc không còn tồn kho đều không thể thanh toán.
export function isCartItemAvailable(item: CartItem): boolean {
  return item.status === "ACTIVE" && item.stockQuantity > 0;
}

// Nhóm các dòng giỏ hàng theo cửa hàng, giữ thứ tự BE trả về.
export function groupCartItemsByShop(items: CartItem[]) {
  const groups = new Map<number, { shopId: number; name: string; items: CartItem[] }>();
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

// Tổng kết các sản phẩm hiện có thể thanh toán, không tính dòng ngừng bán.
export function getCartSummary(items: CartItem[]) {
  const availableItems = items.filter(isCartItemAvailable);
  return {
    itemCount: availableItems.length,
    quantity: availableItems.reduce((total, item) => total + item.quantity, 0),
    total: availableItems.reduce((total, item) => total + item.price * item.quantity, 0),
    shopCount: new Set(availableItems.map((item) => item.shopId)).size,
  };
}

// Áp dụng số lượng tạm để giá từng dòng và tổng tiền cập nhật ngay khi bấm.
export function applyCartQuantityDrafts(items: CartItem[], drafts: Record<number, number>): CartItem[] {
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