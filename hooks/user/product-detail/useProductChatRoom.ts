"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { requestProductConversation, requestChatConversationMessages } from "@/lib/redux/services/chat-api";
import { useChatReadState } from "@/hooks/shared/useChatReadState";
import { useChatRoomSocket } from "@/hooks/shared/useChatRoomSocket";
import { getApiErrorMessage } from "@/lib/utils";
import { mergeChatMessages } from "@/utils/chat.utils";
import { groupShopChatMessages } from "@/utils/shop-chat.utils";
import type { ChatMessage } from "@/types/user/chat";
import { useProductChatQueue } from "./useProductChatQueue";
import { getProductChatDisplayMessages } from "@/utils/product-chat.utils";

// Mở room trước, sau đó tải lịch sử theo conversationId và nhận/gửi qua socket.
export function useProductChatRoom(productId: number, userId: number, visible: boolean, onUnreadCountChange: (count: number) => void) {
  const dispatch = useAppDispatch();
  // Room và lịch sử chỉ sống trong lần mở chat của tài khoản hiện tại.
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);
  const { pending, identities, enqueue, observe, interrupt, resume, pause, retry: retryQueued } = useProductChatQueue(userId);
  const requests = useRef(new Set<{ abort: () => void; unsubscribe?: () => void }>());
  const alive = useRef(false);
  const read = useChatReadState(conversationId, userId, messages, visible, !loading && !error);

  useEffect(() => {
    onUnreadCountChange(read.unreadCount);
  }, [read.unreadCount, onUnreadCountChange]);

  // Gộp tin REST và socket, đối chiếu tin đầu hàng đợi trước khi chuyển sang tin kế tiếp.
  const receive = useCallback((incoming: ChatMessage[], roomId: number) => {
    observe(incoming.filter((message) => message.conversationId === roomId));
    setMessages((current) => mergeChatMessages(current, incoming, roomId));
  }, [observe]);

  // Lấy lịch sử bằng roomId, đồng thời tải bù sau subscribe hoặc reconnect.
  const loadHistory = useCallback(async (roomId: number) => {
    if (!alive.current) return;
    setLoading(true);
    const request = dispatch(requestChatConversationMessages({ conversationId: roomId, viewerId: userId }));
    requests.current.add(request);
    try {
      const response = await request.unwrap();
      if (!alive.current) return;
      if (!response?.success || !Array.isArray(response.data)) throw new Error(response?.message || "Không tải được tin nhắn. Vui lòng thử lại.");
      receive(response.data, roomId);
      setError("");
      return true;
    } catch (failure) {
      pause();
      if (alive.current) setError(getApiErrorMessage(failure, "Không tải được tin nhắn. Vui lòng thử lại."));
      return false;
    } finally {
      request.unsubscribe();
      requests.current.delete(request);
      if (alive.current) setLoading(false);
    }
  }, [dispatch, userId, receive, pause]);

  // POST chỉ lấy hoặc tạo room; không đọc messages từ response này nữa.
  const openConversation = useCallback(async () => {
    if (!alive.current) return;
    setLoading(true);
    const request = dispatch(requestProductConversation(productId));
    requests.current.add(request);
    try {
      const response = await request.unwrap();
      if (!alive.current) return;
      const roomId = response?.data?.conversationId;
      if (!response?.success || !roomId || !Number.isSafeInteger(roomId) || roomId <= 0) {
        throw new Error(response?.message || "Không mở được hội thoại.");
      }
      setConversationId(roomId);
      await loadHistory(roomId);
    } catch (failure) {
      if (alive.current) {
        setError(getApiErrorMessage(failure, "Không mở được hội thoại. Vui lòng thử lại."));
        setLoading(false);
      }
    } finally {
      requests.current.delete(request);
    }
  }, [dispatch, productId, loadHistory]);

  useEffect(() => {
    alive.current = true;
    // Bỏ lượt mở room nếu effect đã cleanup trước khi microtask chạy.
    let cancelled = false;
    void Promise.resolve().then(() => { if (!cancelled) void openConversation(); });
    const activeRequests = requests.current;
    return () => {
      cancelled = true;
      alive.current = false;
      activeRequests.forEach((request) => { request.abort(); request.unsubscribe?.(); });
      activeRequests.clear();
    };
  }, [openConversation, reload]);

  const { publish, status, error: socketError } = useChatRoomSocket({
    conversationId,
    onMessage: (message) => {
      receive([message], message.conversationId);
    },
    onRead: read.receiveRead,
    onReady: () => {
      pause();
      if (conversationId) void loadHistory(conversationId).then((synced) => { if (synced) resume(publish); });
    },
    onInterrupted: interrupt,
  });

  // Ghi nhận vào hàng đợi ngay; socket mất kết nối vẫn cho người dùng tiếp tục gửi.
  const { retryRead } = read;
  const send = useCallback((value: string) => {
    retryRead();
    return enqueue(value, conversationId);
  }, [enqueue, conversationId, retryRead]);

  // Room đã có thì chỉ tải lại lịch sử, không gọi POST tạo/lấy room lần nữa.
  const retry = () => {
    retryRead();
    if (conversationId) void loadHistory(conversationId).then((synced) => { if (synced && status === "connected") resume(publish); });
    else setReload((value) => value + 1);
  };

  const displayMessages = getProductChatDisplayMessages(read.messages, pending, identities);
  return {
    messages: displayMessages, groups: groupShopChatMessages(displayMessages), loading, error: error || socketError,
    status: conversationId ? status : "connecting" as const,
    canSend: !!conversationId,
    pendingHeadId: pending[0]?.id, pendingCount: pending.length, retryQueuedMessage: retryQueued,
    showQueueNotice: pending.length > 0 && (status !== "connected" || pending[0]?.deliveryStatus === "failed" || !!error),
    send, retry, unreadCount: read.unreadCount,
  };
}


