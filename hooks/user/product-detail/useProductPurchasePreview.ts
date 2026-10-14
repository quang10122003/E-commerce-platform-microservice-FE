"use client";

import { getProductPurchaseImages, getVariantPrimaryImageIndex } from "@/lib/utils/product-detail.utils";
import { useProductDetailContext } from "./useProductDetailContext";

// Dùng cùng quy tắc ảnh primary với gallery, tự cập nhật khi đổi variant trong bảng mobile.
export function useProductPurchasePreview() {
  const { product, selectedVariant } = useProductDetailContext();
  const images = product ? getProductPurchaseImages(product, selectedVariant) : [];
  const initialImageIndex = Math.max(0, getVariantPrimaryImageIndex(images, selectedVariant));
  const image = images[initialImageIndex] ?? null;

  return { image, images, initialImageIndex, productName: product?.name ?? "Sản phẩm đang chọn" };
}
