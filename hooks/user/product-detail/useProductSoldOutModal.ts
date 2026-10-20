import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Mở thông báo hết hàng theo tổng stock, dùng dialog native để giữ focus và hỗ trợ Escape.
export function useProductSoldOutModal(isSoldOut: boolean) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isSoldOut || !dialog) return;

    const previousOverflow = document.body.style.overflow;
    // Khôi phục cuộn cả khi đóng bằng nút lẫn phím Escape.
    const restoreScroll = () => {
      if (!dialog.open) document.body.style.overflow = previousOverflow;
    };
    dialog.addEventListener("close", restoreScroll);
    document.body.style.overflow = "hidden";
    dialog.showModal();

    return () => {
      dialog.removeEventListener("close", restoreScroll);
      dialog.close();
      restoreScroll();
    };
  }, [isSoldOut]);

  // Đóng thông báo nhưng không thay đổi tồn kho hoặc mở khóa thao tác mua.
  function closeModal() { dialogRef.current?.close(); }

  // Quay lại trang người dùng vừa xem; truy cập trực tiếp không có lịch sử thì về trang chủ.
  function handleAcknowledge() {
    closeModal();
    if (window.history.length > 1) router.back();
    else router.replace("/");
  }

  return { dialogRef, closeModal, handleAcknowledge };
}
