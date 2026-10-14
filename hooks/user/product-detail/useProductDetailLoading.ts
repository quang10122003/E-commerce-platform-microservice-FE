"use client";

import { useState } from "react";
import { useProductVariantSale } from "./useProductVariantSale";
import { useProductAddToCart } from "./useProductAddToCart";
import { useGetUserProductDetailQuery } from "@/lib/redux/services/product-api";
import {
  findSelectedProductVariant,
  getDefaultProductSelection,
  getDefaultProductVariant,
  getProductDetailFailureKind,
  selectProductAttribute,
} from "@/lib/utils/product-detail.utils";

// Gọi chi tiết qua Redux và chia sẻ tổ hợp mặc định giữa gallery, desktop và bảng mobile.
export function useProductDetailLoading(productId: number) {
  const { currentData, isFetching, isError, error, refetch } = useGetUserProductDetailQuery(
    { productId },
    { refetchOnMountOrArgChange: true },
  );
  const product = !isError && currentData?.success ? currentData.data : null;
  const attributes = product?.attributes ?? [];
  // Lưu lựa chọn của người dùng; null dùng trực tiếp tổ hợp defaultVariantId từ response.
  const [selection, setSelection] = useState<number[] | null>(null);
  const selectedAttributeValueIds = selection ?? getDefaultProductSelection(product);
  const selectedVariant = selection === null
    ? getDefaultProductVariant(product)
    : findSelectedProductVariant(product, selectedAttributeValueIds);
  const pricing = useProductVariantSale(productId, selectedVariant);
  // Số lượng muốn mua, dùng chung cho desktop và bảng mobile.
  const [quantity, setQuantity] = useState(1);
  const cart = useProductAddToCart(selectedVariant, quantity);
  // Chọn một giá trị thuộc tính, giữ nguyên các thuộc tính khác trong tổ hợp.
  function selectAttribute(attributeId: number, valueId: number) {
    setSelection((previous) => selectProductAttribute(attributes,
      previous ?? getDefaultProductSelection(product), attributeId, valueId));
  }

  // Giảm số lượng, không cho xuống dưới 1.
  function handleDecrement() {
    setQuantity((previous) => Math.max(1, previous - 1));
  }

  // Tăng số lượng, giới hạn tối đa 99 theo hành vi hiện có.
  function handleIncrement() {
    setQuantity((previous) => Math.min(99, previous + 1));
  }

  return {
    ...cart, pricing, product, attributes, selectedAttributeValueIds, selectedVariant, selectAttribute,
    quantity, handleDecrement, handleIncrement,
    isLoading: isFetching,
    failureKind: getProductDetailFailureKind(error),
    retry: refetch,
  };
}
