"use client";

import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { requestProductConversation } from "@/lib/redux/services/chat-api";
import { useChatMessages } from "@/hooks/shared/useChatMessages";
import { getApiErrorMessage } from "@/lib/utils";

// Mở room trước, sau đó dùng chung lịch sử cursor, read, hàng đợi và socket với hộp thư.
export function useProductChatRoom(productId: number, userId: number, visible: boolean, onUnreadCountChange: (count: number) => void) {
  const dispatch = useAppDispatch();
  // Room chỉ sống trong lần mở chat của tài khoản hiện tại.
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [openError, setOpenError] = useState("");
  const [opening, setOpening] = useState(true);
  const [reload, setReload] = useState(0);
  const openedRoom = useRef<number | null>(null);
  const history = useChatMessages(conversationId ?? undefined, userId, visible, false);

  useEffect(() => { onUnreadCountChange(history.unreadCount); }, [history.unreadCount, onUnreadCountChange]);

  useEffect(() => {
    let cancelled = false;
    let request: ReturnType<ReturnType<typeof requestProductConversation>> | undefined;
    // POST chỉ lấy hoặc tạo room; không đọc messages từ response này nữa.
    const openConversation = async () => {
      setOpening(true);
      try {
        request = dispatch(requestProductConversation(productId));
        const response = await request.unwrap();
        if (cancelled) return;
        const roomId = response.data?.conversationId;
        if (!response.success || !roomId || !Number.isSafeInteger(roomId) || roomId <= 0) throw new Error(response.message || "Không mở được hội thoại.");
        openedRoom.current = roomId;
        setConversationId(roomId);
        setOpenError("");
      } catch (failure) {
        if (!cancelled) setOpenError(getApiErrorMessage(failure, "Không mở được hội thoại. Vui lòng thử lại."));
      } finally {
        if (!cancelled) setOpening(false);
      }
    };
    // Bỏ lượt mở room nếu effect đã cleanup trước khi microtask chạy.
    void Promise.resolve().then(() => { if (!cancelled && !openedRoom.current) void openConversation(); });
    return () => { cancelled = true; request?.abort(); };
  }, [dispatch, productId, reload]);

  // Room đã có thì chỉ tải lại lịch sử, không gọi POST tạo/lấy room lần nữa.
  const retry = () => {
    if (conversationId) history.reload();
    else setReload((value) => value + 1);
  };

  return { ...history, loading: opening || history.loading, error: openError || history.error, status: history.connectionStatus, retry };
}
