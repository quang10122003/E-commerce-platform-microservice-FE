"use client";

import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import { useProductImagePreview } from "./useProductImagePreview";
import { getProductGalleryImages, getVariantPrimaryImageIndex } from "@/lib/utils/product-detail.utils";
import { useProductDetailContext } from "./useProductDetailContext";

// Chỉ dùng ảnh sản phẩm và nhãn variant từ API, không thay bằng ảnh demo.
export function useProductImageGallery() {
  const { product, selectedVariant } = useProductDetailContext();
  const productImages = product ? getProductGalleryImages(product) : [];
  const images = productImages;
  // Chỉ số ảnh đang được phóng to, khởi tạo bằng ảnh chính của variant đã chọn.
  const [index, setActiveIndex] = useState(() => Math.max(0, getVariantPrimaryImageIndex(productImages, selectedVariant)));
  const activeIndex = Math.max(0, Math.min(index, images.length - 1));

  // Tham chiếu dải thumbnail để kéo bằng chuột và cuộn ảnh đang chọn vào khung.
  const thumbnailTrackRef = useRef<HTMLDivElement>(null);
  // Chỉ hiển thị trạng thái kéo khi thumbnail thực sự tràn khỏi khung hiện tại.
  const [canDragThumbnails, setCanDragThumbnails] = useState(false);
  // Lưu điểm kéo chuột, không cập nhật React state trên mỗi lần di chuyển.
  const drag = useRef<{ pointerId: number; startX: number; scrollLeft: number; moved: boolean } | null>(null);
  // Bỏ qua click phát sinh sau thao tác kéo để không chọn nhầm thumbnail.
  const suppressClick = useRef(false);

  // Bắt đầu kéo bằng chuột; touch giữ cơ chế vuốt native của trình duyệt.
  function handleThumbnailPointerDown(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    if (event.currentTarget.scrollWidth <= event.currentTarget.clientWidth) return;
    drag.current = { pointerId: event.pointerId, startX: event.clientX, scrollLeft: event.currentTarget.scrollLeft, moved: false };
  }

  // Chỉ chiếm pointer khi thực sự kéo, vẫn giữ click và focus bình thường.
  function handleThumbnailPointerMove(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if ((event.buttons & 1) === 0) {
      drag.current = null;
      return;
    }
    const distance = event.clientX - gesture.startX;
    if (!gesture.moved && Math.abs(distance) < 5) return;
    gesture.moved = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
    const scale = event.currentTarget.getBoundingClientRect().width / event.currentTarget.offsetWidth || 1;
    event.currentTarget.scrollLeft = gesture.scrollLeft - distance / scale;
  }

  // Kết thúc hoặc hủy kéo, giải phóng pointer và ghi nhận click cần bỏ qua.
  function handleThumbnailPointerEnd(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    suppressClick.current = gesture.moved;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  // Click thumbnail chỉ chọn ảnh khi thao tác trước đó không phải kéo dải ảnh.
  function selectThumbnail(nextIndex: number, event: MouseEvent<HTMLButtonElement>) {
    if (suppressClick.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClick.current = false;
      return;
    }
    setActiveIndex(nextIndex);
  }

  // Kiểm tra lại khả năng kéo khi thay đổi số ảnh hoặc kích thước khung responsive.
  useEffect(() => {
    const track = thumbnailTrackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(() => {
      setCanDragThumbnails(track.scrollWidth > track.clientWidth);
    });
    observer.observe(track);
    return () => observer.disconnect();
  }, [images.length]);

  // Chỉ cuộn dải thumbnail, không làm trang nhảy khi ảnh đang chọn ra ngoài khung.
  useEffect(() => {
    const track = thumbnailTrackRef.current;
    const selected = track?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (!track || !selected) return;
    const left = selected.offsetLeft;
    const right = left + selected.offsetWidth;
    const visibleRight = track.scrollLeft + track.clientWidth;
    const target = left < track.scrollLeft ? left : right > visibleRight ? right - track.clientWidth : null;
    if (target === null) return;
    track.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }, [activeIndex, images.length]);
  // Chuyển sang ảnh trước.
  function handlePrev() {
    setActiveIndex((previous) => previous <= 0 ? images.length - 1 : previous - 1);
  }

  // Chuyển sang ảnh tiếp theo.
  function handleNext() {
    setActiveIndex((previous) => previous >= images.length - 1 ? 0 : previous + 1);
  }

  const preview = useProductImagePreview(images.length, activeIndex);

  return { thumbnailTrackRef, canDragThumbnails, handleThumbnailPointerDown, handleThumbnailPointerMove, handleThumbnailPointerEnd, selectThumbnail, preview, images, activeIndex, handlePrev, handleNext, productName: product?.name };
}
