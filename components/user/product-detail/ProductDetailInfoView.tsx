"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
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
  return <span className="font-semibold text-main">{formatCompactNumber(product?.totalSold ?? 0)}</span>;
}

// Hiển thị địa điểm từ chi tiết sản phẩm, độc lập với địa điểm shop.
export function ProductDetailLocation() {
  const { product } = useProductDetailContext();
  return <span>{product?.location?.trim() || "Đang cập nhật"}</span>;
}

// Mở đúng shop của sản phẩm đang xem.
export function ProductDetailShopLink({ children, className, "aria-label": ariaLabel }: {
  children?: ReactNode;
  className: string;
  "aria-label"?: string;
}) {
  const { shopOverview } = useProductDetailContext();
  if (!shopOverview) return null;
  return <Link href={`/shops/${shopOverview.shopId}`} prefetch={false} className={className} aria-label={ariaLabel}>{children}</Link>;
}

// Nút mở cửa sổ chat với shop trên desktop và tablet.
export function ProductDetailChatButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new CustomEvent("open-shop-chat"))}
      className="flex items-center justify-center gap-1.5 rounded-lg border border-primary/30 bg-primary-light px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary hover:text-white cursor-pointer active:scale-95"
    >
      <MessageCircle className="h-3.5 w-3.5" />
      Chat ngay
    </button>
  );
}
