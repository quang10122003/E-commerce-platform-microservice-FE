"use client";

import { useGetProductPriceRangeQuery } from "@/lib/redux/services/product-api";
import { formatProductPriceRange } from "@/utils/product-price.utils";

// Dùng chung khoảng giá sản phẩm cho chat user và shop, không để lỗi giá ảnh hưởng room.
export function useProductPriceRange(productId?: number) {
  const priceQuery = useGetProductPriceRangeQuery({ productId: productId ?? 0 }, {
    skip: !Number.isSafeInteger(productId) || Number(productId) <= 0,
    refetchOnMountOrArgChange: true,
  });
  // currentData không mang giá sản phẩm cũ sang room mới khi chuyển hội thoại.
  const priceRange = !priceQuery.isError && priceQuery.currentData?.success
    && priceQuery.currentData.data?.productId === productId ? priceQuery.currentData.data : null;
  return {
    productPrice: formatProductPriceRange(priceRange),
    priceLoading: priceQuery.isFetching && !priceQuery.currentData,
  };
}
