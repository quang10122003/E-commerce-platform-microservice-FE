"use client";

import { useProductDetailContext } from "./useProductDetailContext";

// Chỉ lấy shop của sản phẩm hiện tại; lỗi hoặc thiếu dữ liệu thì ẩn block, không hiện thông báo.
export function useProductShopOverview() {
  return useProductDetailContext().shopOverview;
}
