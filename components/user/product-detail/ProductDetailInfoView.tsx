"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";
import { formatCompactNumber } from "@/lib/utils";

// Hiển thị tên từ API, không dùng tiêu đề sản phẩm demo.
export function ProductDetailName() {
  const { product } = useProductDetailContext();
  return <h1 className="text-lg font-bold leading-snug text-main sm:text-xl">{product?.name}</h1>;
}

// Hiển thị tổng đã bán từ product, không thay đổi số sao hay lượt đánh giá mock.
export function ProductDetailSold() {
  const { product } = useProductDetailContext();
  return <span className="font-semibold text-main underline decoration-dotted">{formatCompactNumber(product?.totalSold ?? 0)}</span>;
}

// Hiển thị địa điểm backend; dữ liệu thiếu hoặc trống dùng thông báo cập nhật.
export function ProductDetailLocation() {
  const { product } = useProductDetailContext();
  return <span>{product?.location?.trim() || "Đang cập nhật"}</span>;
}
// Mở đúng shop của product; tên và thông tin shop chưa có API vẫn giữ mock.
export function ProductDetailShopLink({ children, className, "aria-label": ariaLabel }: {
  children?: ReactNode;
  className: string;
  "aria-label"?: string;
}) {
  const { product } = useProductDetailContext();
  return <Link href={`/shops/${product?.shopId ?? 1}`} prefetch={false} className={className} aria-label={ariaLabel}>{children}</Link>;
}
