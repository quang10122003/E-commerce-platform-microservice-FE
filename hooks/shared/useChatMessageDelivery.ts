"use client";

import { useCallback, useEffect, useRef } from "react";
import { getApiErrorMessage } from "@/lib/utils";
import { CHAT_MAX_CONTENT_LENGTH, type ChatMessage } from "@/types/user/chat";

interface PendingMessage {
  content: string;
  afterId: number;
  resolve: () => void;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

// Dùng chung luồng gửi và chờ echo cho từng room được key theo tài khoản.
export function useChatMessageDelivery(viewerId?: number) {
  // Chỉ cho một tin chờ xác nhận; ghi nhớ ID đã thấy để không nhận nhầm tin lịch sử.
  const pending = useRef<PendingMessage | null>(null);
  const latestId = useRef(0);

  // Hủy chờ gửi khi socket lỗi hoặc khung chat đã đóng.
  const rejectPending = useCallback((message: string) => {
    if (!pending.current) return;
    clearTimeout(pending.current.timer);
    pending.current.reject(new Error(message));
    pending.current = null;
  }, []);

  // Chỉ echo mới đúng người và nội dung mới xác nhận thao tác gửi.
  const confirm = useCallback((message: ChatMessage) => {
    const waiting = pending.current;
    if (waiting && message.id > waiting.afterId && message.senderId === viewerId && message.content === waiting.content) {
      clearTimeout(waiting.timer);
      waiting.resolve();
      pending.current = null;
    }
    latestId.current = Math.max(latestId.current, message.id);
  }, [viewerId]);

  useEffect(() => () => {
    rejectPending("Đã đóng chat. Hãy kiểm tra lịch sử trước khi gửi lại.");
  }, [rejectPending]);

  // Không optimistic success: giữ nội dung form nếu BE từ chối hoặc thiếu echo.
  const send = useCallback((value: string, publish: (content: string) => void, afterId = 0) => {
    const content = value.trim();
    if (!content || content.length > CHAT_MAX_CONTENT_LENGTH) return Promise.reject(new Error("Tin nhắn phải từ 1 đến 4.000 ký tự."));
    if (pending.current) return Promise.reject(new Error("Đang chờ xác nhận tin nhắn trước."));
    return new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => rejectPending("Chưa nhận được xác nhận. Hãy kiểm tra lịch sử trước khi gửi lại."), 15000);
      pending.current = { content, afterId: Math.max(latestId.current, afterId), resolve, reject, timer };
      try { publish(content); } catch (failure) {
        rejectPending(getApiErrorMessage(failure, "Không gửi được tin nhắn."));
      }
    });
  }, [rejectPending]);

  return { send, confirm, rejectPending };
}
