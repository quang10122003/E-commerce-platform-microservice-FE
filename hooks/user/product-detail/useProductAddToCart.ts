"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useNotification } from "@/hooks/shared/useNotification";
import { useCartFlight } from "./useCartFlight";
import { useAddCartItemMutation } from "@/lib/redux/services/cart-api";
import { getApiErrorMessage } from "@/lib/utils";
import { getProductCartValidationMessage } from "@/lib/utils/product-detail.utils";
import type { UserProductVariant } from "@/types/user/product";

// Thêm variant và số lượng đang chọn qua Redux, dùng chung giữa desktop và bảng mobile.
export function useProductAddToCart(variant: UserProductVariant | null, quantity: number) {
  const [addCartItem] = useAddCartItemMutation();
  const { notifyError, notifySuccess } = useNotification();
  const { flightRef, flyToCart } = useCartFlight();
  // Giữ nút loading đến khi cả API và hiệu ứng hoàn tất.
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Khóa đồng bộ để hai lần bấm nhanh không gửi hai request trước lượt render tiếp theo.
  const pending = useRef(false);
  // Không phát thông báo của trang cũ sau khi người dùng đã điều hướng đi.
  const mounted = useRef(false);
  const validationMessage = getProductCartValidationMessage(variant, quantity);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Giữ nguyên lựa chọn và bảng mua hàng, thông báo kết quả sau khi backend xử lý.
  async function handleAddToCart(event: MouseEvent<HTMLButtonElement>) {
    if (pending.current) return;
    if (validationMessage || !variant) {
      notifyError(validationMessage ?? "Vui lòng chọn phân loại sản phẩm.");
      return;
    }
    pending.current = true;
    setIsAddingToCart(true);
    try {
      // Chạy API song song với hiệu ứng; chỉ báo kết quả khi gói hàng bay xong.
      const [result] = await Promise.allSettled([
        addCartItem({ productVariantId: variant.id, request: { quantity } }).unwrap(),
        flyToCart(event.currentTarget),
      ]);
      if (!mounted.current) return;
      if (result.status === "rejected") throw result.reason;
      const response = result.value;
      if (response && !response.success) {
        notifyError(getApiErrorMessage(response, "Không thể thêm sản phẩm vào giỏ hàng."));
        return;
      }
      notifySuccess("Đã thêm vào giỏ hàng.");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại."));
    } finally {
      pending.current = false;
      if (mounted.current) setIsAddingToCart(false);
    }
  }

  return { handleAddToCart, isAddingToCart, flightRef, cartValidationMessage: validationMessage };
}
