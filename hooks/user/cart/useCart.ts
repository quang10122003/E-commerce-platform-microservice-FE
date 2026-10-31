"use client";

import { CART_QUANTITY_DEBOUNCE_MS } from "@/lib/constants";
import { useCartSalePricing } from "./useCartSalePricing";
import { useCartQuote } from "./useCartQuote";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useRemoveCartItemMutation, useUpdateCartQuantityMutation } from "@/lib/redux/services/cart-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CartItem, CartResponse } from "@/types/user/cart";
import { applyCartQuantityDrafts, getCartQuantityChanges, getCartSummary, groupCartItemsByShop, isCartItemAvailable } from "@/utils/cart.utils";

// Quản lý thao tác giỏ hàng trên client và làm mới dữ liệu server sau khi cập nhật.
export function useCart(initialCart: CartResponse | null) {
  const router = useRouter();
  const [updateQuantity] = useUpdateCartQuantityMutation();
  const [removeItem] = useRemoveCartItemMutation();
  const { notifyError } = useNotification();
  // Lưu số lượng tạm để hiển thị ngay khi người dùng bấm liên tiếp.
  const [draftQuantities, setDraftQuantities] = useState<Record<number, number>>({});
  // Giữ số lượng mới nhất đồng bộ để nhiều lần bấm nhanh không dùng state cũ.
  const draftRef = useRef<Record<number, number>>({});
  // Chờ riêng từng sản phẩm trước khi gửi số lượng cuối cùng lên BE.
  const quantityTimerRef = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  // Theo dõi đồng bộ các sản phẩm đang gửi để chặn request trùng.
  const updatingVariantIdsRef = useRef(new Set<number>());
  // Lưu các sản phẩm cần khóa nút tăng giảm trong lúc gọi API.
  const [updatingVariantIds, setUpdatingVariantIds] = useState(new Set<number>());
  // Lưu thao tác xóa để giữ loading của flow hiện có.
  const [pendingAction, setPendingAction] = useState<"delete" | null>(null);
  // Giữ trạng thái chờ trong lúc Server Component tải lại giỏ hàng.
  const [isRefreshing, startTransition] = useTransition();
  // Mặc định chọn sản phẩm còn hàng; ghi nhớ các dòng người dùng đã bỏ chọn.
  const [unselectedItemIds, setUnselectedItemIds] = useState(new Set<number>());
  const { items: pricedItems, saleExpiryVersion } = useCartSalePricing(initialCart?.item);
  const items = applyCartQuantityDrafts(pricedItems, draftQuantities);
  const availableItems = items.filter(isCartItemAvailable);
  const selectedItems = availableItems.filter((item) => !unselectedItemIds.has(item.cartItemId));
  const selectedItemIds = new Set(selectedItems.map((item) => item.cartItemId));
  const quote = useCartQuote(selectedItems, saleExpiryVersion);

  // Chọn hoặc bỏ chọn theo dòng, shop hoặc toàn bộ giỏ, không tác động dữ liệu BE.
  const toggleSelection = (targetItems: CartItem[]) => {
    if (pendingAction !== null || isRefreshing) return;
    const available = targetItems.filter(isCartItemAvailable);
    if (available.length === 0) return;
    setUnselectedItemIds((previous) => {
      const next = new Set(previous);
      const allSelected = available.every((item) => !previous.has(item.cartItemId));
      for (const item of available) {
        if (allSelected) next.add(item.cartItemId);
        else next.delete(item.cartItemId);
      }
      return next;
    });
  };

  useEffect(() => {
    const timers = quantityTimerRef.current;
    return () => timers.forEach(clearTimeout);
  }, []);

  // Làm mới giỏ hàng từ Server Component, không gọi GET ở client.
  const refreshCart = () => startTransition(() => router.refresh());

  // Gửi số lượng của một biến thể và chỉ khóa nút của biến thể đó.
  const saveQuantity = async (item: CartItem) => {
    const productVariantId = item.productVariantId;
    quantityTimerRef.current.delete(productVariantId);
    const quantity = draftRef.current[productVariantId];
    if (quantity === undefined || quantity === item.quantity || updatingVariantIdsRef.current.has(productVariantId)) return;

    updatingVariantIdsRef.current.add(productVariantId);
    setUpdatingVariantIds(new Set(updatingVariantIdsRef.current));
    try {
      await updateQuantity({ productVariantId, quantity }).unwrap();
    } catch (requestError) {
      notifyError(getApiErrorMessage(requestError, "Không thể cập nhật số lượng. Vui lòng thử lại."));
      delete draftRef.current[productVariantId];
      setDraftQuantities({ ...draftRef.current });
    } finally {
      // Làm mới âm thầm, không dùng trạng thái loading toàn trang.
      router.refresh();
      updatingVariantIdsRef.current.delete(productVariantId);
      setUpdatingVariantIds(new Set(updatingVariantIdsRef.current));
    }
  };

  // Cập nhật UI tức thời và đặt lại thời gian chờ sau mỗi lần bấm.
  const changeQuantity = (item: CartItem, delta: -1 | 1) => {
    if (pendingAction !== null || isRefreshing || updatingVariantIdsRef.current.has(item.productVariantId)) return;
    const quantity = (draftRef.current[item.productVariantId] ?? item.quantity) + delta;
    if (quantity < 1 || (delta === 1 && quantity > item.stockQuantity)) return;

    draftRef.current = { ...draftRef.current, [item.productVariantId]: quantity };
    setDraftQuantities(draftRef.current);
    clearTimeout(quantityTimerRef.current.get(item.productVariantId));
    quantityTimerRef.current.set(item.productVariantId, setTimeout(() => void saveQuantity(item), CART_QUANTITY_DEBOUNCE_MS));
  };

  // Xóa sản phẩm sau khi xử lý các thay đổi số lượng của sản phẩm khác.
  const deleteItem = async (item: CartItem) => {
    if (pendingAction !== null || isRefreshing || updatingVariantIdsRef.current.size > 0) return;
    quantityTimerRef.current.forEach(clearTimeout);
    quantityTimerRef.current.clear();
    setPendingAction("delete");

    try {
      const changes = getCartQuantityChanges(initialCart?.item ?? [], draftRef.current, item.productVariantId);
      for (const change of changes) await updateQuantity(change).unwrap();
      await removeItem(item.productVariantId).unwrap();
    } catch (requestError) {
      notifyError(getApiErrorMessage(requestError, "Không thể cập nhật giỏ hàng. Vui lòng thử lại."));
      draftRef.current = {};
      setDraftQuantities({});
    } finally {
      refreshCart();
      setPendingAction(null);
    }
  };

  return {
    items,
    groups: groupCartItemsByShop(items),
    summary: { ...getCartSummary(selectedItems), total: quote.total, quoteLoading: quote.loading, quoteError: quote.error, onRetryQuote: quote.retry },
    selectedItemIds,
    allSelected: availableItems.length > 0 && selectedItems.length === availableItems.length,
    canSelect: availableItems.length > 0,
    toggleSelection,
    pending: pendingAction !== null || isRefreshing,
    updatingVariantIds,
    loadingLabel: pendingAction === "delete" ? "Đang xóa sản phẩm..." : "Đang cập nhật giỏ hàng...",
    refreshCart,
    changeQuantity,
    deleteItem,
  };
}
