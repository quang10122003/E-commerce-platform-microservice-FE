"use client";

import { useMemo, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { useProductVariantSale } from "./useProductVariantSale";
import { useProductAddToCart } from "./useProductAddToCart";
import { useProductQuantity } from "./useProductQuantity";
import { useGetShopOverviewQuery, useGetUserProductDetailQuery } from "@/lib/redux/services/product-api";
import { useProductViewBehavior } from "./useProductViewBehavior";
import {
  findSelectedProductVariant,
  getAvailableProductVariants,
  getInitialProductVariant,
  getProductDetailFailureKind,
  getProductTotalStock,
  getProductVariantAttributes,
  getSelectableProductValueIds,
  selectProductAttribute,
} from "@/lib/utils/product-detail.utils";

// Gọi chi tiết qua Redux và chia sẻ tổ hợp khởi tạo giữa gallery, desktop và bảng mobile.
export function useProductDetailLoading(productId: number, initialVariantId?: string) {
  const { currentData, isFetching, isError, isUninitialized, error, refetch } = useGetUserProductDetailQuery(
    { productId },
    { refetchOnMountOrArgChange: true },
  );
  const product = !isError && currentData?.success ? currentData.data : null;
  const attributes = useMemo(() => getProductVariantAttributes(product), [product]);
  const availableVariants = useMemo(() => getAvailableProductVariants(product, attributes), [product, attributes]);
  const initialVariant = getInitialProductVariant(product, initialVariantId);
  const initialSelection = initialVariant?.attributeValueIds ?? [];
  // Lưu lựa chọn của người dùng; null dùng variant từ link sale hoặc defaultVariantId trong response.
  const [selection, setSelection] = useState<number[] | null>(null);
  const selectedAttributeValueIds = selection ?? initialSelection;
  const selectedVariant = selection === null
    ? initialVariant
    : findSelectedProductVariant(product, selectedAttributeValueIds);
  const selectableAttributeValueIds = useMemo(() => getSelectableProductValueIds(attributes, availableVariants,
    selectedAttributeValueIds), [attributes, availableVariants, selectedAttributeValueIds]);
  const pricing = useProductVariantSale(productId, selectedVariant);
  const shopId = product?.shopId;
  const hasShop = !!shopId && Number.isSafeInteger(shopId) && shopId > 0;
  const shopQuery = useGetShopOverviewQuery(hasShop ? shopId : skipToken,
    { refetchOnMountOrArgChange: true });
  const shopOverview = !shopQuery.isError && shopQuery.currentData?.success
    && shopQuery.currentData.data?.shopId === shopId ? shopQuery.currentData.data : null;
  // Chờ cả request phụ thuộc; lỗi chi tiết không thể khởi chạy request shop hoặc variant.
  const hasSettled = !isUninitialized && !isFetching && pricing.hasSettled
    && (!hasShop || (!shopQuery.isUninitialized && !shopQuery.isFetching));
  useProductViewBehavior(productId, hasSettled);
  const { quantity, isQuantityDisabled, canDecrease, canIncrease, handleDecrement, handleIncrement } = useProductQuantity(selectedVariant);
  const cart = useProductAddToCart(selectedVariant, quantity);
  // Chọn value và tự chuyển các thuộc tính phía dưới sang variant còn hàng phù hợp.
  function selectAttribute(attributeId: number, valueId: number) {
    setSelection((previous) => selectProductAttribute(attributes,
      previous ?? initialSelection, attributeId, valueId, availableVariants));
  }

  return {
    ...cart, pricing, product, shopOverview, attributes, selectedAttributeValueIds, selectableAttributeValueIds, selectedVariant, selectAttribute,
    totalStock: getProductTotalStock(product),
    quantity, isQuantityDisabled, canDecrease, canIncrease, handleDecrement, handleIncrement,
    isLoading: isFetching,
    failureKind: getProductDetailFailureKind(error),
    retry: refetch,
  };
}
