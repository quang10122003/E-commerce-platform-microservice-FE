"use client";

import { createContext, use } from "react";
import type { useProductDetailLoading } from "./useProductDetailLoading";

export const ProductDetailContext = createContext<ReturnType<typeof useProductDetailLoading> | null>(null);

// Đọc dữ liệu và lựa chọn chung của trang mà không tạo thêm request sản phẩm.
export function useProductDetailContext() {
  const detail = use(ProductDetailContext);
  if (!detail) throw new Error("Phần chi tiết sản phẩm cần nằm trong ProductDetailContext.");
  return detail;
}
