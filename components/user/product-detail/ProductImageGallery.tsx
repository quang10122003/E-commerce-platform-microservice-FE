"use client";

import { useProductImageGallery } from "@/hooks/user/product-detail/useProductImageGallery";
import Image from "next/image";
import { ProductImagePreviewDialog } from "./ProductImagePreviewDialog";
import { useProductDetailContext } from "@/hooks/user/product-detail/useProductDetailContext";
import { ChevronLeft, ChevronRight, PackageSearch } from "lucide-react";

// Hiển thị nhãn ở góc ảnh riêng; ảnh chung không có nhãn.
function ProductImageVariantLabel({
  name,
  compact = false,
}: {
  name: string | null;
  compact?: boolean;
}) {
  if (!name) return null;

  return (
    <span
      title={name}
      className={`pointer-events-none absolute z-10 rounded-sm bg-primary font-semibold text-primary-foreground ${
        compact
          ? "left-1 top-1 max-w-[calc(100%-0.5rem)] px-1 py-0.5 text-[10px] leading-tight"
          : "left-3 top-3 max-w-[calc(100%-1.5rem)] px-3 py-1.5 text-xs sm:text-sm"
      }`}
    >
      <span className="line-clamp-2 wrap-anywhere">{name}</span>
    </span>
  );
}

// Gallery ảnh sản phẩm có thumbnail và nút điều hướng trái/phải.
export function ProductImageGallery() {
  const { selectedVariant } = useProductDetailContext();

  // Đổi variant thì reset gallery về ảnh primary, không cần effect chuyển ảnh sau render.
  return <ProductImageGalleryContent key={selectedVariant?.id ?? "unmatched-variant"} />;
}

// Giữ thao tác chọn thumbnail và điều hướng trong gallery của variant hiện tại.
function ProductImageGalleryContent() {
  const {
    images, activeIndex, handlePrev, handleNext, productName, preview, thumbnailTrackRef, canDragThumbnails,
    handleThumbnailPointerDown, handleThumbnailPointerMove, handleThumbnailPointerEnd, selectThumbnail,
  } = useProductImageGallery();

  // Thiếu ảnh thật thì báo rõ ràng, không mở thư viện rỗng hoặc hiển thị ảnh sản phẩm khác.
  if (!images.length) {
    return (
      <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-xl bg-surface-subtle text-muted-foreground">
        <PackageSearch className="h-12 w-12 text-primary/60" aria-hidden="true" />
        <p className="text-sm">Ảnh sản phẩm đang cập nhật</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:max-lg:mx-auto sm:max-lg:max-w-sm">
      {/* Ảnh chính phóng to với nút điều hướng hai bên. */}
      <button
        type="button"
        onClick={preview.openImage}
        aria-label="Mở thư viện ảnh sản phẩm"
        aria-haspopup="dialog"
        aria-controls="product-gallery-image-preview"
        className="relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <Image
          src={images[activeIndex].src}
          alt={`${productName ?? "Ảnh sản phẩm"} ${activeIndex + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {/* Nhãn phân loại tương ứng ảnh đang xem. */}
        <ProductImageVariantLabel name={images[activeIndex].variantName} />

        {/* Chỉ số ảnh hiện tại. */}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {activeIndex + 1} / {images.length}
        </span>
      </button>

      {/* Thumbnail nhỏ để chọn nhanh. */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={handlePrev}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary active:scale-95"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div
          ref={thumbnailTrackRef}
          onPointerDown={handleThumbnailPointerDown}
          onPointerMove={handleThumbnailPointerMove}
          onPointerUp={handleThumbnailPointerEnd}
          onPointerCancel={handleThumbnailPointerEnd}
          className={`relative flex min-w-0 flex-initial select-none gap-2 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${canDragThumbnails ? "cursor-grab active:cursor-grabbing" : "cursor-default"}`}
        >
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={(event) => selectThumbnail(idx, event)}
              className={`relative h-20 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-md border-2 transition-colors duration-200 ${canDragThumbnails ? "active:cursor-grabbing" : ""} ${
                activeIndex === idx
                  ? "border-primary"
                  : "border-transparent hover:border-slate-300"
              }`}
              aria-label={`Xem ảnh ${idx + 1}${image.variantName ? `: ${image.variantName}` : ""}`}
              aria-pressed={activeIndex === idx}
            >
              <Image
                src={image.src}
                alt={`Thumbnail ${idx + 1}`}
                draggable={false}
                fill
                unoptimized
                sizes="80px"
                className="object-cover"
              />
              {/* Nhãn góc thumbnail giúp nhận biết ảnh thuộc phân loại nào. */}
              <ProductImageVariantLabel name={image.variantName} compact />
            </button>
          ))}
        </div>
        <button
          onClick={handleNext}
          className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary active:scale-95"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <ProductImagePreviewDialog dialogId="product-gallery-image-preview" images={images} productName={productName ?? "Ảnh sản phẩm"} preview={preview} />
    </div>
  );
}
