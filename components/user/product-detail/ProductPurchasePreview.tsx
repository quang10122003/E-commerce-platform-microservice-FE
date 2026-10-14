"use client";

import Image from "next/image";
import { ProductImagePreviewDialog } from "./ProductImagePreviewDialog";
import { PackageSearch, ZoomIn } from "lucide-react";
import { useProductImagePreview } from "@/hooks/user/product-detail/useProductImagePreview";
import { useProductPurchasePreview } from "@/hooks/user/product-detail/useProductPurchasePreview";

// Hiện ảnh và tên sản phẩm ở đầu bảng chọn thuộc tính cho cả thêm giỏ và mua hàng.
export function ProductPurchasePreview() {
  const { image, images, initialImageIndex, productName } = useProductPurchasePreview();
  const preview = useProductImagePreview(images.length, initialImageIndex, true);

  return (
    <>
      <div className="flex items-start gap-3">
        {/* Ảnh chính của variant đang chọn; chưa có ảnh thì hiển thị thông báo rõ ràng. */}
        <button
          type="button"
          onClick={preview.openImage}
          disabled={!image}
          aria-label="Xem ảnh sản phẩm phóng to"
          aria-haspopup="dialog"
          aria-controls="product-purchase-image-preview"
          className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-surface-subtle transition-colors hover:border-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-default"
        >
          {image ? (
            <Image
              src={image.src}
              alt={`${productName} – ảnh phân loại đang chọn`}
              fill
              unoptimized
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-muted-foreground">
              <PackageSearch className="h-6 w-6" aria-hidden="true" />
              <span className="text-xs">Chưa có ảnh</span>
            </div>
          )}
          {image && (
            <span className="absolute bottom-1 right-1 rounded bg-main/70 p-1 text-white" aria-hidden="true">
              <ZoomIn className="h-3.5 w-3.5" />
            </span>
          )}
        </button>

        {/* Tên và nhãn phân loại đồng bộ với ảnh, không thay đổi giá hoặc sale mock. */}
        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <p className="line-clamp-2 text-sm font-semibold leading-relaxed text-main">{productName}</p>
          {image?.variantName && (
            <p className="wrap-anywhere text-xs leading-relaxed text-primary">{image.variantName}</p>
          )}
        </div>
      </div>

      <ProductImagePreviewDialog dialogId="product-purchase-image-preview" images={images} productName={productName} preview={preview} />
    </>
  );
}
