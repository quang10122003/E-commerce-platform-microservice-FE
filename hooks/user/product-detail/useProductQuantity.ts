import { useState } from "react";
import { getProductQuantityControls } from "@/lib/utils/product-detail.utils";
import type { UserProductVariant } from "@/types/user/product";

// Quản lý số lượng mua dùng chung cho desktop/mobile, reset ngay khi đổi variant.
export function useProductQuantity(variant: UserProductVariant | null) {
  const variantId = variant?.id ?? null;
  // Gắn số lượng với variant để không gửi số cũ trong lượt render vừa đổi phân loại.
  const [purchase, setPurchase] = useState({ variantId, quantity: 1 });
  const controls = getProductQuantityControls(variant, purchase.variantId === variantId ? purchase.quantity : 1);

  // Đồng bộ có điều kiện để reset variant và hạ số lượng khi BE cập nhật tồn kho.
  if (purchase.variantId !== variantId || purchase.quantity !== controls.quantity) {
    setPurchase({ variantId, quantity: controls.quantity });
  }

  // Kiểm tra lại từng cập nhật để bấm nhanh liên tiếp cũng không vượt tồn kho.
  function changeQuantity(delta: -1 | 1) {
    if (delta === 1 ? !controls.canIncrease : !controls.canDecrease) return;
    setPurchase((previous) => ({
      variantId,
      quantity: getProductQuantityControls(variant,
        (previous.variantId === variantId ? previous.quantity : 1) + delta).quantity,
    }));
  }

  // Giảm số lượng, không cho xuống dưới 1.
  function handleDecrement() { changeQuantity(-1); }

  // Tăng số lượng, không vượt tồn kho của variant đang chọn.
  function handleIncrement() { changeQuantity(1); }

  return { ...controls, handleDecrement, handleIncrement };
}
