"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type SyntheticEvent } from "react";

// Mở thư viện ảnh native, giữ focus và trạng thái của giao diện bên dưới.
export function useProductImagePreview(imageCount: number, initialImageIndex: number, mobileOnly = false) {
  // Tham chiếu dialog xem ảnh, không tạo state trùng với trạng thái open của trình duyệt.
  const imageDialogRef = useRef<HTMLDialogElement>(null);

  // Lưu vị trí ảnh đang xem trong thư viện.
  const [activeImageIndex, setActiveImageIndex] = useState(initialImageIndex);
  // Tham chiếu vùng cuộn chứa các ảnh để giữ cả hai ảnh trong lúc trượt.
  const imageTrackRef = useRef<HTMLDivElement>(null);

  // Giữ kiểu cuộn trước khi mở để không phá scroll lock của bảng mua hàng.
  const previousOverflow = useRef<string | null>(null);

  // Khôi phục khả năng cuộn khi đóng hoặc gỡ dialog khỏi giao diện.
  function restoreScroll() {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  }

  // Trượt đến ảnh liền kề; tôn trọng cài đặt giảm chuyển động của người dùng.
  function changeImage(direction: number) {
    const track = imageTrackRef.current;
    if (!track || imageCount < 2) return;
    const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
    const nextIndex = Math.max(0, Math.min(imageCount - 1, currentIndex + direction));
    track.scrollTo({
      left: nextIndex * track.clientWidth,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  // Đồng bộ số thứ tự và nút điều hướng sau thao tác vuốt hoặc trượt ảnh.
  function handleImageScroll() {
    const track = imageTrackRef.current;
    if (track?.clientWidth) setActiveImageIndex(Math.round(track.scrollLeft / track.clientWidth));
  }
  // Hỗ trợ chuyển ảnh bằng phím mũi tên trong dialog.
  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    changeImage(event.key === "ArrowRight" ? 1 : -1);
  }

  // Hiện ảnh lớn mà không đóng bảng chọn thuộc tính bên dưới.
  function openImage() {
    const dialog = imageDialogRef.current;
    if (dialog && !dialog.open) {
      setActiveImageIndex(initialImageIndex);
      previousOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      dialog.showModal();
      const track = imageTrackRef.current;
      track?.scrollTo({ left: initialImageIndex * track.clientWidth, behavior: "instant" });
    }
  }

  // Đóng ảnh lớn và trả focus về nút đã mở thư viện.
  function closeImage() {
    imageDialogRef.current?.close();
    restoreScroll();
  }

  // Escape chỉ đóng ảnh, không truyền sự kiện đóng sang bảng mua hàng.
  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    event.stopPropagation();
    closeImage();
  }

  // Bấm nền quanh ảnh để đóng, không đóng khi bấm nội dung hoặc chính ảnh.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    event.stopPropagation();
    if (event.target === event.currentTarget) closeImage();
  }

  // Đồng bộ việc đóng dialog với breakpoint của bảng mua hàng mobile.
  useEffect(() => {
    const dialog = imageDialogRef.current;
    const desktopQuery = window.matchMedia("(min-width: 640px)");
    const handleViewportChange = () => {
      if (mobileOnly && desktopQuery.matches) dialog?.close();
    };
    dialog?.addEventListener("close", restoreScroll);
    desktopQuery.addEventListener("change", handleViewportChange);
    return () => {
      dialog?.close();
      restoreScroll();
      dialog?.removeEventListener("close", restoreScroll);
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, [mobileOnly]);

  return { imageDialogRef, imageTrackRef, activeImageIndex, changeImage, openImage, closeImage, handleCancel, handleBackdropClick, handleKeyDown, handleImageScroll };
}
