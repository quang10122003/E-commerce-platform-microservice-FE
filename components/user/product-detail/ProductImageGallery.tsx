"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Danh sách ảnh cứng và nhãn phân loại minh họa cho gallery sản phẩm demo.
const PRODUCT_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    variantName: null,
  },
  {
    src: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=600&q=80",
    variantName: "Bạc ánh kim",
  },
  {
    src: "https://images.unsplash.com/photo-1610820270236-3118408a09c2?w=600&auto=format&fit=crop&q=80",
    variantName: "Xanh navy",
  },
  {
    src: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80",
    variantName: "Đen huyền",
  },
  {
    src: "https://images.unsplash.com/photo-1434056886845-dac89ffe9b56?w=600&q=80",
    variantName: null,
  },
];

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
  // Chỉ số ảnh đang được phóng to hiển thị chính.
  const [activeIndex, setActiveIndex] = useState(0);

  // Chuyển sang ảnh trước.
  function handlePrev() {
    setActiveIndex((prev) => (prev === 0 ? PRODUCT_IMAGES.length - 1 : prev - 1));
  }

  // Chuyển sang ảnh tiếp theo.
  function handleNext() {
    setActiveIndex((prev) => (prev === PRODUCT_IMAGES.length - 1 ? 0 : prev + 1));
  }

  return (
    <div className="flex flex-col gap-3 sm:max-lg:mx-auto sm:max-lg:max-w-sm">
      {/* Ảnh chính phóng to với nút điều hướng hai bên. */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={PRODUCT_IMAGES[activeIndex].src}
          alt={`Ảnh sản phẩm ${activeIndex + 1}`}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {/* Nhãn phân loại của ảnh đang xem, không gắn với lựa chọn mua hàng. */}
        <ProductImageVariantLabel name={PRODUCT_IMAGES[activeIndex].variantName} />

        {/* Chỉ số ảnh hiện tại. */}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
          {activeIndex + 1} / {PRODUCT_IMAGES.length}
        </span>
      </div>

      {/* Thumbnail nhỏ để chọn nhanh. */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={handlePrev}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary active:scale-95"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1">
          {PRODUCT_IMAGES.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors duration-200 ${
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
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 transition hover:border-primary hover:text-primary active:scale-95"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
