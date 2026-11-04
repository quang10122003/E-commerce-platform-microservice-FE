"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetCheckoutItemsQuery, useGetCheckoutQuoteQuery } from "@/lib/redux/services/checkout-api";
import { getApiErrorMessage } from "@/lib/utils";
import { groupCheckoutItems, parseCheckoutItems } from "@/utils/checkout.utils";
import type { CheckoutItem } from "@/types/user/checkout";

const EMPTY_ITEMS: CheckoutItem[] = [];

// Tải lại sản phẩm và tổng tiền theo lựa chọn trên URL, không dùng dữ liệu của URL trước.
export function useCheckout(itemsParam: string | string[] | undefined) {
  const request = parseCheckoutItems(itemsParam);
  const itemsQuery = useGetCheckoutItemsQuery(request ?? skipToken, { refetchOnMountOrArgChange: true });
  const quoteQuery = useGetCheckoutQuoteQuery(request ?? skipToken, { refetchOnMountOrArgChange: true });
  const itemsResponse = itemsQuery.currentData;
  const quoteResponse = quoteQuery.currentData;
  const items = itemsResponse?.success ? itemsResponse.data?.items : undefined;
  const amount = quoteResponse?.success ? quoteResponse.data?.totalAmount : undefined;
  const loading = !!request && (itemsQuery.isFetching || itemsQuery.isUninitialized);
  const quoteLoading = !!request && (quoteQuery.isFetching || quoteQuery.isUninitialized);
  const error = !request ? "Danh sách sản phẩm trên URL không hợp lệ. Vui lòng chọn lại từ giỏ hàng."
    : loading ? null
      : itemsQuery.error ? getApiErrorMessage(itemsQuery.error, "Không thể tải sản phẩm thanh toán. Vui lòng thử lại.")
        : !items?.length ? itemsResponse?.message || "Không có sản phẩm để thanh toán." : null;
  const quoteError = !request || quoteLoading ? null
    : quoteQuery.error ? getApiErrorMessage(quoteQuery.error, "Không thể tính tổng tiền. Vui lòng thử lại.")
      : typeof amount !== "number" || !Number.isFinite(amount) || amount < 0
        ? quoteResponse?.message || "Không thể tính tổng tiền. Vui lòng thử lại." : null;

  // Thử lại cả hai nguồn để thông tin sale và tổng tiền được cập nhật cùng lựa chọn.
  const retry = () => {
    if (!request) return;
    void itemsQuery.refetch();
    void quoteQuery.refetch();
  };

  return {
    items: loading || error ? EMPTY_ITEMS : items ?? EMPTY_ITEMS,
    groups: groupCheckoutItems(loading || error ? EMPTY_ITEMS : items ?? EMPTY_ITEMS),
    itemCount: request?.items.length ?? 0,
    total: !request || quoteLoading || quoteError ? null : amount ?? null,
    loading, error, quoteLoading, quoteError, retry,
    canRetry: !!request,
  };
}
