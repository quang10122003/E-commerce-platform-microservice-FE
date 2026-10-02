"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useNotification } from "@/hooks/useNotification";
import { useDeleteProductMutation, useDeleteProductVariantMutation } from "@/lib/redux/services/product-api";
import { getApiErrorMessage } from "@/lib/utils";

// Xác nhận và xóa sản phẩm hoặc phân loại qua BFF, sau đó làm mới danh sách.
export function useDeleteSellerProduct() {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [deleteProduct] = useDeleteProductMutation();
  const [deleteProductVariant] = useDeleteProductVariantMutation();
  // Lưu ID sản phẩm đang gửi yêu cầu xóa để chặn thao tác lặp.
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  // Lưu ID phân loại đang xóa để hiển thị loading và chặn thao tác lặp.
  const [deletingVariantId, setDeletingVariantId] = useState<number | null>(null);

  // Chỉ gửi yêu cầu xóa sau khi người bán xác nhận thao tác không thể hoàn tác.
  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (deletingProductId !== null || deletingVariantId !== null) return;
    if (!window.confirm(`Xóa sản phẩm "${productName}" cùng toàn bộ phân loại? Thao tác này không thể hoàn tác.`)) return;

    setDeletingProductId(productId);
    try {
      const response = await deleteProduct(productId).unwrap();
      if (!response.success) {
        notifyError(response.message || "Không thể xóa sản phẩm.");
        return;
      }

      notifySuccess("Đã xóa sản phẩm. Hình ảnh sẽ được dọn sau.");
      router.refresh();
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Xóa sản phẩm thất bại. Vui lòng thử lại."));
    } finally {
      setDeletingProductId(null);
    }
  };

  // Xóa đúng phân loại sau khi xác nhận và làm mới dữ liệu từ server.
  const handleDeleteVariant = async (productId: number, variantId: number, variantLabel: string) => {
    if (deletingProductId !== null || deletingVariantId !== null) return;
    if (!window.confirm(`Xóa phân loại "${variantLabel}"? Thao tác này không thể hoàn tác.`)) return;

    setDeletingVariantId(variantId);
    try {
      const response = await deleteProductVariant({ productId, variantId }).unwrap();
      if (!response.success) {
        notifyError(response.message || "Không thể xóa phân loại.");
        return;
      }

      notifySuccess("Đã xóa phân loại. Hình ảnh sẽ được dọn sau.");
      router.refresh();
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Xóa phân loại thất bại. Vui lòng thử lại."));
    } finally {
      setDeletingVariantId(null);
    }
  };

  return { deletingProductId, deletingVariantId, handleDeleteProduct, handleDeleteVariant };
}
