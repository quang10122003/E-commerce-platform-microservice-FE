"use client";

import type { ReactNode } from "react";
import { useProductDetailLoading } from "@/hooks/user/product-detail/useProductDetailLoading";
import { ProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { ProductDetailUnavailableView } from "./ProductDetailUnavailableView";
import { CartFlightView } from "./CartFlightView";

type ProductDetailLoadingViewProps = {
  productId: number;
  children: ReactNode;
};

// Hiện skeleton trong lúc tải và cung cấp dữ liệu thật cho các phần UI có DTO tương ứng.
export function ProductDetailLoadingView({ productId, children }: ProductDetailLoadingViewProps) {
  const detail = useProductDetailLoading(productId);

  if (detail.isLoading) return <ProductDetailSkeleton />;
  if (!detail.product) return <ProductDetailUnavailableView kind={detail.failureKind} onRetry={detail.retry} />;

  return (
    <ProductDetailContext value={detail}>
      {children}
      {/* Gói hàng dùng chung cho nút thêm giỏ desktop và bảng mobile. */}
      <CartFlightView flightRef={detail.flightRef} />
    </ProductDetailContext>
  );
}
