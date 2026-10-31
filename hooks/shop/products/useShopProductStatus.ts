"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUpdateProductStatusMutation } from "@/lib/redux/services/product-api";
import { useNotification } from "@/hooks/shared/useNotification";
import { getApiErrorMessage } from "@/lib/utils";
import type { SellerProductItem, UpdateProductStatusRequest } from "@/types/shop/product";

// Đổi trạng thái qua BFF rồi tải lại danh sách và overview theo bộ lọc hiện tại.
export function useShopProductStatus(product: Pick<SellerProductItem, "id" | "status">) {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [updateStatus, { isLoading }] = useUpdateProductStatusMutation();
  const [refreshing, startTransition] = useTransition();
  // Chặn hai lần bấm xảy ra trước khi trạng thái loading được render.
  const submitting = useRef(false);

  // Trạng thái hết hàng do dữ liệu kho quyết định, không được gửi vào API bật/tắt.
  const toggle = async () => {
    if (product.status === "OUT_OF_STOCK" || submitting.current || refreshing) return;
    const status: UpdateProductStatusRequest["status"] = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    submitting.current = true;
    try {
      await updateStatus({ productId: product.id, request: { status } }).unwrap();
      notifySuccess(status === "ACTIVE" ? "Đã bật bán sản phẩm." : "Đã ẩn sản phẩm.");
      startTransition(() => router.refresh());
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể cập nhật trạng thái sản phẩm. Vui lòng thử lại."));
    } finally {
      submitting.current = false;
    }
  };

  return { active: product.status === "ACTIVE", pending: isLoading || refreshing, toggle };
}
