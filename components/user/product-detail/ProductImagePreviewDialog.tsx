"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProductGalleryImage } from "@/lib/utils/product-detail.utils";
import type { useProductImagePreview } from "@/hooks/user/product-detail/useProductImagePreview";

interface ProductImagePreviewDialogProps {
  dialogId: string;
  images: Pick<ProductGalleryImage, "src" | "variantName">[];
  productName: string;
  preview: ReturnType<typeof useProductImagePreview>;
}

// Thư viện ảnh toàn màn hình dùng chung cho gallery và bảng mua hàng.
export function ProductImagePreviewDialog({ dialogId, images, productName, preview }: ProductImagePreviewDialogProps) {
  const {
    imageDialogRef, imageTrackRef, activeImageIndex, changeImage, closeImage, handleCancel,
    handleBackdropClick, handleKeyDown, handleImageScroll,
  } = preview;

  return (
    <>
      {/* Dialog ảnh phủ toàn màn hình; đóng ảnh vẫn giữ nguyên giao diện bên dưới. */}
      <dialog
        id={dialogId}
        ref={imageDialogRef}
        aria-labelledby={`${dialogId}-title`}
        onCancel={handleCancel}
        onKeyDown={handleKeyDown}
        onClick={handleBackdropClick}
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none overflow-hidden rounded-none border-0 bg-black p-0 text-white backdrop:bg-black"
      >
        <div className="absolute right-[max(1rem,env(safe-area-inset-right))] top-[max(1rem,env(safe-area-inset-top))] z-10">
          <h3 id={`${dialogId}-title`} className="sr-only">Ảnh sản phẩm</h3>
          <button
            type="button"
            onClick={closeImage}
            aria-label="Đóng ảnh phóng to"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {/* Giữ các ảnh cạnh nhau để vuốt và chuyển cảnh trượt mượt, không thay src tức thì. */}
        <div
          ref={imageTrackRef}
          onScroll={handleImageScroll}
          className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((galleryImage, index) => (
            <div key={index} className="relative h-full w-full shrink-0 snap-center snap-always">
              <Image
                src={galleryImage.src}
                alt={`${productName} – ảnh phóng to ${index + 1}`}
                fill
                unoptimized
                sizes="100vw"
                draggable={false}
                loading="eager"
                className="select-none object-contain"
              />
            </div>
          ))}
        </div>
        {/* Điều hướng chỉ xuất hiện khi danh sách có nhiều ảnh. */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => changeImage(-1)}
              disabled={activeImageIndex === 0}
              aria-label="Ảnh trước"
              className="absolute left-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => changeImage(1)}
              disabled={activeImageIndex === images.length - 1}
              aria-label="Ảnh tiếp theo"
              className="absolute right-3 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-lg bg-black/60 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
            <p aria-live="polite" aria-atomic="true" className="pointer-events-none absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-sm tabular-nums text-white">
              <span className="sr-only">Ảnh </span>{activeImageIndex + 1} / {images.length}
            </p>
          </>
        )}
      </dialog>
    </>
  );
}
