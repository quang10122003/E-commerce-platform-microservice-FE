"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

// Quản lý bảng chọn thuộc tính trượt từ đáy màn hình trên mobile.
export function useProductPurchaseSection() {
  // Thao tác đang chọn quyết định nút mua trong bảng thuộc tính.
  const [purchaseAction, setPurchaseAction] = useState<"cart" | "buy" | null>(null);
  // Dialog native giữ focus trong bảng và hỗ trợ đóng bằng Escape.
  const purchaseDialogRef = useRef<HTMLDialogElement>(null);

  // Đóng bảng mà không thay đổi vị trí cuộn của trang sản phẩm.
  function closePurchase() {
    setPurchaseAction(null);
  }

  // Khóa cuộn nền khi mở bảng và tự đóng khi chuyển sang màn hình lớn.
  useEffect(() => {
    const dialog = purchaseDialogRef.current;
    if (!purchaseAction || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 640px)");
    const handleViewportChange = () => {
      if (desktopQuery.matches) closePurchase();
    };
    document.body.style.overflow = "hidden";
    dialog.showModal();
    desktopQuery.addEventListener("change", handleViewportChange);

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      desktopQuery.removeEventListener("change", handleViewportChange);
    };
  }, [purchaseAction]);

  // Chỉ đóng khi bấm nền bên ngoài bảng, không đóng khi chọn thuộc tính.
  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom
    ) closePurchase();
  }

  return {
    purchaseAction,
    purchaseDialogRef,
    openPurchase: setPurchaseAction,
    closePurchase,
    handleBackdropClick,
  };
}
