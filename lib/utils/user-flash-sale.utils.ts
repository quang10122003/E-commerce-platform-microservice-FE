import { TIME } from "@/lib/constants";
import type { FlashSaleSort, UserFlashSaleItem } from "@/types/user/flash-sale";

// Tính đồng hồ theo offset ISO backend, không phụ thuộc múi giờ trình duyệt.
export function getSaleCountdown(endsAt: string | null, now: number) {
  const end = endsAt ? Date.parse(endsAt) : NaN;
  const remaining = Number.isFinite(end) ? Math.max(0, end - now) : 0;
  const seconds = Math.floor(remaining / TIME.SECOND_MS);
  return {
    expired: Number.isFinite(end) && remaining === 0,
    parts: [Math.floor(seconds / 3600), Math.floor(seconds % 3600 / 60), seconds % 60]
      .map((part) => String(part).padStart(2, "0")),
  };
}

// Lọc và sắp xếp bản sao, không thay đổi cache RTK Query.
export function selectSaleItems(items: UserFlashSaleItem[], sort: FlashSaleSort, availableOnly: boolean) {
  const selected = items.filter((item) => !availableOnly || item.availability === "AVAILABLE");
  if (sort === "PRICE_ASC") selected.sort((a, b) => a.salePrice - b.salePrice);
  if (sort === "PRICE_DESC") selected.sort((a, b) => b.salePrice - a.salePrice);
  if (sort === "DISCOUNT_DESC") selected.sort((a, b) => b.discountPercent - a.discountPercent);
  return selected;
}

// Số còn lại gồm giới hạn tồn kho nên không thể suy ra số lượng đã bán.
export function getSaleQuotaPercent(item: UserFlashSaleItem) {
  return item.registeredQuantity > 0
    ? Math.min(100, Math.max(0, item.remainingQuantity / item.registeredQuantity * 100)) : 0;
}

// Chỉ nhận categoryId nguyên dương an toàn từ URL trước khi gọi backend.
export function parseSaleCategoryId(value?: string | string[]): number | undefined {
  if (typeof value !== "string" || !/^\d+$/.test(value)) return undefined;
  const categoryId = Number(value);
  return Number.isSafeInteger(categoryId) && categoryId > 0 ? categoryId : undefined;
}