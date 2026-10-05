"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";
import { useRemoveCartItemMutation, useUpdateCartQuantityMutation } from "@/lib/redux/services/cart-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CartItem, CartResponse } from "@/types/cart";
import { applyCartQuantityDrafts, getCartQuantityChanges, getCartSummary, groupCartItemsByShop } from "@/utils/cart.utils";

const QUANTITY_DEBOUNCE_MS = 500;

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
  // Chờ người dùng dừng bấm trước khi gửi số lượng cuối cùng lên BE.
  const quantityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Lưu thao tác đang gửi để chặn request lặp và chọn nhãn loading phù hợp.
  const [pendingAction, setPendingAction] = useState<"quantity" | "delete" | null>(null);
  // Giữ trạng thái chờ trong lúc Server Component tải lại giỏ hàng.
  const [isRefreshing, startTransition] = useTransition();
  const items = applyCartQuantityDrafts(initialCart?.item ?? [], draftQuantities);

  useEffect(() => () => {
    if (quantityTimerRef.current) clearTimeout(quantityTimerRef.current);
  }, []);

  // Làm mới giỏ hàng từ Server Component, không gọi GET ở client.
  const refreshCart = () => startTransition(() => router.refresh());

  // Gửi từng biến thể một lần với số lượng cuối cùng sau khoảng chờ.
  const saveQuantities = async () => {
    quantityTimerRef.current = null;
    const changes = getCartQuantityChanges(initialCart?.item ?? [], draftRef.current);
    if (changes.length === 0) return;

    setPendingAction("quantity");
    try {
      for (const change of changes) await updateQuantity(change).unwrap();
    } catch (requestError) {
      notifyError(getApiErrorMessage(requestError, "Không thể cập nhật số lượng. Vui lòng thử lại."));
      draftRef.current = {};
      setDraftQuantities({});
    } finally {
      refreshCart();
      setPendingAction(null);
    }
  };

  // Cập nhật UI tức thời và đặt lại thời gian chờ sau mỗi lần bấm.
  const changeQuantity = (item: CartItem, delta: -1 | 1) => {
    if (pendingAction !== null || isRefreshing) return;
    const quantity = (draftRef.current[item.productVariantId] ?? item.quantity) + delta;
    if (quantity < 1 || quantity > item.stockQuantity) return;

    draftRef.current = { ...draftRef.current, [item.productVariantId]: quantity };
    setDraftQuantities(draftRef.current);
    if (quantityTimerRef.current) clearTimeout(quantityTimerRef.current);
    quantityTimerRef.current = setTimeout(() => void saveQuantities(), QUANTITY_DEBOUNCE_MS);
  };

  // Xóa sản phẩm sau khi xử lý các thay đổi số lượng của sản phẩm khác.
  const deleteItem = async (item: CartItem) => {
    if (pendingAction !== null || isRefreshing) return;
    if (quantityTimerRef.current) clearTimeout(quantityTimerRef.current);
    quantityTimerRef.current = null;
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
    summary: getCartSummary(items),
    pending: pendingAction !== null || isRefreshing,
    loadingLabel: pendingAction === "delete" ? "Đang xóa sản phẩm..." : pendingAction === "quantity" ? "Đang cập nhật số lượng..." : "Đang cập nhật giỏ hàng...",
    refreshCart,
    changeQuantity,
    deleteItem,
  };
}
