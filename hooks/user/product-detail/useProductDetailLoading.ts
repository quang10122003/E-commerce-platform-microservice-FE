"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getCheckoutUrl } from "@/utils/checkout.utils";
import { useProductVariantSale } from "./useProductVariantSale";
import { useProductAddToCart } from "./useProductAddToCart";
import { useProductQuantity } from "./useProductQuantity";
import { useGetProductShopOverviewQuery, useGetUserProductDetailQuery } from "@/lib/redux/services/product-api";
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
  const router = useRouter();
  const { currentData, isFetching, isError, isUninitialized, error, refetch } = useGetUserProductDetailQuery(
    { productId },
    { refetchOnMountOrArgChange: true },
  );
  const detailProduct = !isError && currentData?.success ? currentData.data : null;
  const shopLocked = detailProduct?.shopLocked === true;
  // Không cấp dữ liệu cho mua hàng hoặc tải sale khi shop bị khóa.
  const product = shopLocked ? null : detailProduct;
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
  const shopQuery = useGetProductShopOverviewQuery(productId,
    { refetchOnMountOrArgChange: true });
  const shopOverview = !shopQuery.isError && shopQuery.currentData?.success
    ? shopQuery.currentData.data : null;
  // Chờ chi tiết, shop và giá trước khi ghi nhận lượt xem.
  const hasSettled = !shopLocked && !isUninitialized && !isFetching && pricing.hasSettled
    && !shopQuery.isUninitialized && !shopQuery.isFetching;
  useProductViewBehavior(productId, hasSettled);
  const { quantity, isQuantityDisabled, canDecrease, canIncrease, handleDecrement, handleIncrement } = useProductQuantity(selectedVariant);
  const cart = useProductAddToCart(selectedVariant, quantity);
  // Mua trực tiếp bằng lựa chọn hiện tại; checkout tự lấy lại thông tin và phân bổ sale.
  function handleBuyNow() {
    if (cart.cartValidationMessage || !selectedVariant) return;
    router.push(getCheckoutUrl([{ variantId: selectedVariant.id, quantity }]));
  }
  // Chọn value và tự chuyển các thuộc tính phía dưới sang variant còn hàng phù hợp.
  function selectAttribute(attributeId: number, valueId: number) {
    setSelection((previous) => selectProductAttribute(attributes,
      previous ?? initialSelection, attributeId, valueId, availableVariants));
  }

  return {
    ...cart, handleBuyNow, pricing, product, shopOverview, attributes, selectedAttributeValueIds, selectableAttributeValueIds, selectedVariant, selectAttribute,
    totalStock: getProductTotalStock(product),
    quantity, isQuantityDisabled, canDecrease, canIncrease, handleDecrement, handleIncrement,
    isLoading: isFetching,
    failureKind: getProductDetailFailureKind(error, shopLocked),
    retry: refetch,
  };
}
