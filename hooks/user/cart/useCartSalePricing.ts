"use client";

import { useSaleExpiry } from "@/hooks/shared/useSaleExpiry";
import type { CartItem } from "@/types/user/cart";
import { applyCartItemPricing } from "@/utils/cart.utils";

const EMPTY_ITEMS: CartItem[] = [];

// Loại giá sale hết hạn và đồng bộ lại dữ liệu giỏ qua callback của flow hiện có.
export function useCartSalePricing(items: CartItem[] = EMPTY_ITEMS, onExpire?: () => void) {
  const { now, saleExpiryVersion } = useSaleExpiry(items, onExpire);
  return { items: applyCartItemPricing(items, now), saleExpiryVersion };
}
