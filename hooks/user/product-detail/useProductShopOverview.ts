"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useGetShopOverviewQuery } from "@/lib/redux/services/product-api";
import { useProductDetailContext } from "./useProductDetailContext";

// Chỉ lấy shop của sản phẩm hiện tại; lỗi hoặc thiếu dữ liệu thì ẩn block, không hiện thông báo.
export function useProductShopOverview() {
  const { product } = useProductDetailContext();
  const shopId = product?.shopId;
  const { currentData, isError } = useGetShopOverviewQuery(
    shopId && Number.isSafeInteger(shopId) && shopId > 0 ? shopId : skipToken,
    { refetchOnMountOrArgChange: true },
  );

  return !isError && currentData?.success && currentData.data?.shopId === shopId
    ? currentData.data
    : null;
}
