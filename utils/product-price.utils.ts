import { formatCurrency } from "@/lib/utils";
import type { ProductPriceRangeResponse } from "@/types/user/product";

// Gộp khoảng bằng nhau thành một giá; không biến dữ liệu thiếu hoặc sai thành giá 0.
export function formatProductPriceRange(range?: ProductPriceRangeResponse | null): string | null {
  if (!range || !Number.isFinite(range.minPrice) || !Number.isFinite(range.maxPrice)
    || range.minPrice < 0 || range.maxPrice < range.minPrice) return null;
  return range.minPrice === range.maxPrice
    ? formatCurrency(range.minPrice)
    : `${formatCurrency(range.minPrice)} - ${formatCurrency(range.maxPrice)}`;
}
