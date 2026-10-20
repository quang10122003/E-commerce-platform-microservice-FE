"use client";

import type { ReactNode } from "react";
import { useProductDetailLoading } from "@/hooks/user/product-detail/useProductDetailLoading";
import { ProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";
import { ProductDetailSkeleton } from "./ProductDetailSkeleton";
import { ProductDetailUnavailableView } from "./ProductDetailUnavailableView";
import { CartFlightView } from "./CartFlightView";
import { ProductSoldOutModal } from "./ProductSoldOutModal";
import { ProductShopChatWindow } from "./ProductShopChatWindow";

type ProductDetailLoadingViewProps = {
  productId: number;
  initialVariantId?: string;
  children: ReactNode;
};

// Hiện skeleton trong lúc tải và cung cấp dữ liệu thật cho các phần UI có DTO tương ứng.
export function ProductDetailLoadingView({ productId, initialVariantId, children }: ProductDetailLoadingViewProps) {
  const detail = useProductDetailLoading(productId, initialVariantId);

  if (detail.isLoading) return <ProductDetailSkeleton />;
  if (!detail.product) return <ProductDetailUnavailableView kind={detail.failureKind} onRetry={detail.retry} />;

  return (
    <ProductDetailContext value={detail}>
      {children}
      {/* Gói hàng dùng chung cho nút thêm giỏ desktop và bảng mobile. */}
      <CartFlightView flightRef={detail.flightRef} />
      {/* Thông báo hết hàng dựa trên tổng variant, không phụ thuộc variant đang chọn. */}
      <ProductSoldOutModal isSoldOut={detail.totalStock === 0} />
      {/* Cửa sổ chat realtime với shop của sản phẩm đang xem. */}
      <ProductShopChatWindow />
    </ProductDetailContext>
  );
}
