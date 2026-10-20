"use client";

import { useEffect, useRef, useState } from "react";

interface ChatInboxSelectionOptions<Conversation> {
  conversations: Conversation[];
  viewerId: number | null;
  enabled: boolean;
  page: number;
  pending: boolean;
  error: string;
  navigate: (page: number) => void;
}

// Giữ room độc lập với trang hộp thư để refresh không unmount socket và hàng đợi.
export function useChatInboxSelection<Conversation extends { conversationId: number }>({
  conversations, viewerId, enabled, page, pending, error, navigate,
}: ChatInboxSelectionOptions<Conversation>) {
  // Snapshot chỉ thuộc tài khoản đã chọn room, không dùng lại sau khi đổi phiên.
  const [selection, setSelection] = useState<{ viewerId: number; conversation: Conversation } | null>(null);
  const requestedNavigation = useRef<string | null>(null);

  // Đổi tài khoản phải xóa lựa chọn, kể cả sau đó đăng nhập lại tài khoản cũ.
  if (selection && selection.viewerId !== viewerId) setSelection(null);

  const snapshot = enabled && selection?.viewerId === viewerId ? selection.conversation : null;
  const current = conversations.find((conversation) => conversation.conversationId === snapshot?.conversationId);
  const selected = current ?? snapshot;

  useEffect(() => {
    if (!snapshot || current || page <= 1) {
      requestedNavigation.current = null;
      return;
    }
    if (pending || error) return;
    const key = `${viewerId}:${snapshot.conversationId}:${page}`;
    if (requestedNavigation.current === key) return;
    // Room mới hoạt động đã rời trang cũ: đưa hộp thư về đầu nhưng giữ nguyên room đang mở.
    requestedNavigation.current = key;
    navigate(1);
  }, [snapshot, current, page, pending, error, viewerId, navigate]);

  // Chỉ chọn room có thật trong trang hiện tại của đúng tài khoản.
  const select = (conversationId: number) => {
    const conversation = conversations.find((item) => item.conversationId === conversationId);
    if (!enabled || !viewerId || !conversation) return false;
    setSelection({ viewerId, conversation });
    return true;
  };

  // Đóng chủ động mới bỏ snapshot và kích hoạt cleanup của room.
  const close = () => setSelection(null);

  return { selected, select, close };
}
