"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { requestReadChatConversation } from "@/lib/redux/services/chat-api";
import { syncChatReadPreview } from "@/lib/redux/services/chat-cache";
import { applyChatReadReceipts, applyOwnChatReadReceipt, getChatUnreadMessages, isChatReadReceipt } from "@/utils/chat-read.utils";
import type { ChatMessage, ChatReadReceipt } from "@/types/user/chat";

// Dùng chung quy tắc mở room là đọc hết, không phụ thuộc vị trí cuộn từng tin.
export function useChatReadState(conversationId: number | null, viewerId: number, messages: ChatMessage[], visible: boolean, ready: boolean) {
  const dispatch = useAppDispatch();
  // Giữ các mốc xác nhận, kể cả sự kiện tới trước tin neo hoặc lịch sử REST.
  const [receiptIds, setReceiptIds] = useState<number[]>([]);
  // Mốc HTTP thuộc chính người xem, vẫn áp dụng được nếu tin neo chưa tải về.
  const [ownReadLimit, setOwnReadLimit] = useState(0);
  // Thao tác tiếp theo cho phép thử lại im lặng, không tự lặp khi API lỗi.
  const [retryVersion, setRetryVersion] = useState(0);
  // Tab ẩn không được tự đọc tin dù room vẫn giữ kết nối.
  const [tabVisible, setTabVisible] = useState(false);
  const alive = useRef(false);
  const requests = useRef(new Set<{ abort: () => void }>());

  useEffect(() => {
    alive.current = true;
    const update = () => setTabVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    const activeRequests = requests.current;
    return () => {
      alive.current = false;
      document.removeEventListener("visibilitychange", update);
      activeRequests.forEach((request) => request.abort());
      activeRequests.clear();
    };
  }, []);

  // Socket và HTTP đều dùng cùng mốc, không suy đoán bên đọc khi thiếu tin neo.
  const receiveRead = useCallback((receipt: ChatReadReceipt) => {
    if (receipt.conversationId !== conversationId) return;
    if (receipt.lastReadMessageId !== null) {
      const id = receipt.lastReadMessageId;
      setReceiptIds((current) => current.includes(id) ? current : [...current, id]);
    }
    dispatch(syncChatReadPreview(receipt, viewerId));
  }, [conversationId, viewerId, dispatch]);
  const acceptResponse = useEffectEvent((receipt: ChatReadReceipt) => {
    receiveRead(receipt);
    const limit = receipt.lastReadMessageId;
    if (limit !== null) setOwnReadLimit((current) => Math.max(current, limit));
  });
  const readMessages = applyOwnChatReadReceipt(
    applyChatReadReceipts(messages, receiptIds, conversationId ?? 0), conversationId ?? 0, viewerId, ownReadLimit,
  );
  const unreadMessages = getChatUnreadMessages(readMessages, conversationId ?? 0, viewerId);
  const newestUnreadId = unreadMessages.reduce((latest, message) => Math.max(latest, message.id), 0);

  useEffect(() => {
    if (!conversationId || !viewerId || !ready || !visible || !tabVisible || !newestUnreadId) return;
    // Gộp cụm tin đến liên tiếp; chỉ xóa unread sau xác nhận thành công của BE.
    const timer = setTimeout(async () => {
      const request = dispatch(requestReadChatConversation(conversationId));
      requests.current.add(request);
      try {
        const response = await request.unwrap();
        if (!alive.current) return;
        if (!response.success || !isChatReadReceipt(response.data) || response.data.conversationId !== conversationId) {
          throw new Error(response.message || "Phản hồi đánh dấu đã đọc không hợp lệ.");
        }
        acceptResponse(response.data);
      } catch {
        // Chấp nhận lệch trạng thái tạm thời; lần tương tác tiếp theo sẽ thử lại.
      } finally {
        requests.current.delete(request);
      }
    }, 180);
    return () => clearTimeout(timer);
  }, [conversationId, viewerId, ready, visible, tabVisible, newestUnreadId, retryVersion, dispatch]);

  const retryRead = useCallback(() => setRetryVersion((version) => version + 1), []);

  return {
    messages: readMessages, unreadCount: unreadMessages.length, receiveRead, retryRead,
  };
}
