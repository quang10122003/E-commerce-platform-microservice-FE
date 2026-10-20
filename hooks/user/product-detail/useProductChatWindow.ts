"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { useProductDetailContext } from "./useProductDetailContext";

// Giữ trạng thái cửa sổ theo sự kiện mở chat sẵn có trên trang sản phẩm.
export function useProductChatWindow() {
  const { product, pricing, selectedVariant } = useProductDetailContext();
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);
  // Đóng hoặc thu nhỏ không làm thay đổi lựa chọn variant của trang.
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  // Số tin chưa đọc xác nhận từ room, tách riêng theo tài khoản và sản phẩm.
  const [unread, setUnread] = useState({ roomKey: "", count: 0 });
  const roomKey = `${user?.userId}:${product?.id}`;
  const unreadCount = unread.roomKey === roomKey ? unread.count : 0;

  // Room đếm từ lịch sử và socket, chỉ giảm sau khi BE xác nhận đã đọc.
  const updateUnreadCount = useCallback((count: number) => {
    setUnread((current) => current.roomKey === roomKey && current.count === count ? current : { roomKey, count });
  }, [roomKey]);

  // Mở lại UI; hook room chịu trách nhiệm gọi API và cập nhật badge.
  const restore = () => setIsMinimized(false);

  useEffect(() => {
    const open = () => { setIsOpen(true); setIsMinimized(false); };
    window.addEventListener("open-shop-chat", open);
    return () => window.removeEventListener("open-shop-chat", open);
  }, []);

  return {
    product, user, isCheckingAuth, isOpen, isMinimized, loginOpen, unreadCount, updateUnreadCount,
    image: selectedVariant?.images?.[0]?.imageUrl || product?.imageUrl,
    price: pricing?.price ?? pricing?.originalPrice ?? selectedVariant?.price ?? 0,
    minimize: () => setIsMinimized(true),
    restore,
    close: () => { setIsOpen(false); setLoginOpen(false); setUnread({ roomKey: "", count: 0 }); },
    openLogin: () => setLoginOpen(true),
    closeLogin: () => setLoginOpen(false),
  };
}
