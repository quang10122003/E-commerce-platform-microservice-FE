"use client";

import { useRef, useState } from "react";
import { useRemoveShopFlashSaleItemMutation } from "@/lib/redux/services/flash-sale-api";
import { useNotification } from "@/hooks/shared/useNotification";
import { getApiErrorMessage } from "@/lib/utils";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";

// Quản lý xác nhận xóa; chỉnh sửa được thực hiện trực tiếp trên dòng.
export function useShopFlashSaleItemActions(campaignId: string) {
  const [removeItem] = useRemoveShopFlashSaleItemMutation();
  const { notifySuccess, notifyError } = useNotification();
  // Giữ mã dòng đang xóa để khóa thao tác và hiển thị tiến trình.
  const [deletingItemId, setDeletingItemId] = useState<number | null>(null);
  // Chặn request lặp ngay lập tức, trước khi React cập nhật giao diện.
  const deletingRef = useRef(false);

  // Xác nhận bằng hộp thoại trình duyệt; mutation tự tải lại danh sách khi thành công.
  const requestDelete = async (item: ShopFlashSaleItem) => {
    if (deletingRef.current) return;
    const options = item.options.map(option => `${option.name}: ${option.value}`).join(" · ");
    if (!window.confirm(`Xóa đăng ký Flash Sale của "${item.productName}"${options ? ` (${options})` : ""}?`)) return;
    deletingRef.current = true;
    setDeletingItemId(item.itemId);
    try {
      await removeItem({ campaignId, itemId: item.itemId }).unwrap();
      notifySuccess("Xóa đăng ký Flash Sale thành công.");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể xóa đăng ký Flash Sale. Vui lòng thử lại."));
    } finally {
      deletingRef.current = false;
      setDeletingItemId(null);
    }
  };

  return { deletingItemId, requestDelete };
}
