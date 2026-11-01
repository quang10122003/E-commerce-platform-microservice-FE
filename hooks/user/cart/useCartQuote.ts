"use client";

import { CART_QUOTE_MAX_ITEMS, PRICE_PREVIEW_DEBOUNCE_MS } from "@/lib/constants";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGetCartQuoteQuery } from "@/lib/redux/services/cart-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CartPricedItem } from "@/types/user/cart";

// Tính tổng qua BE sau khi lựa chọn ổn định; không hiển thị kết quả của lựa chọn trước.
export function useCartQuote(items: CartPricedItem[], saleExpiryVersion: number) {
  const request = { items: items.map((item) => ({ variantId: item.productVariantId, quantity: item.quantity })) };
  const requestKey = JSON.stringify(request);
  const pricingKey = JSON.stringify({ prices: items.map((item) => [item.effectivePrice, item.price, item.saleQuantity, item.regularQuantity]), saleExpiryVersion });
  const stableKey = useDebouncedValue(`${requestKey}|${pricingKey}`, PRICE_PREVIEW_DEBOUNCE_MS);
  const waiting = stableKey !== `${requestKey}|${pricingKey}`;
  const empty = items.length === 0;
  const tooManyItems = items.length > CART_QUOTE_MAX_ITEMS;
  const query = useGetCartQuoteQuery(
    { request, pricingKey },
    { skip: empty || tooManyItems || waiting, refetchOnMountOrArgChange: true },
  );
  const response = query.currentData;
  const amount = response?.data?.totalAmount;
  const valid = response?.success && typeof amount === "number" && Number.isFinite(amount) && amount >= 0;
  const loading = !empty && !tooManyItems && (waiting || query.isFetching || query.isUninitialized);
  const error = empty || loading ? null : tooManyItems
    ? `Chỉ có thể tính giá tối đa ${CART_QUOTE_MAX_ITEMS} sản phẩm mỗi lần. Vui lòng chọn ít sản phẩm hơn.`
    : query.error ? getApiErrorMessage(query.error, "Không thể tính tổng tiền. Vui lòng thử lại.")
      : !valid ? (!response?.success && response?.message) || "Không thể tính tổng tiền. Vui lòng thử lại." : null;

  // Thử lại đúng báo giá hiện tại, không dùng tổng tiền tính tại frontend.
  const retry = () => { if (!empty && !tooManyItems && !waiting) void query.refetch(); };

  return { total: empty ? 0 : loading || error ? null : amount ?? null, loading, error, retry };
}
