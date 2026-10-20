"use client";

import { useCallback } from "react";
import { useChatSocketConnection } from "@/hooks/shared/useChatSocketConnection";
import { isChatReadReceipt } from "@/utils/chat-read.utils";
import { isChatMessage } from "@/utils/chat.utils";
import type { ChatMessage, ChatReadReceipt, ChatSocketInterruptionReason } from "@/types/user/chat";

interface ChatSocketOptions {
  conversationId: number | null;
  onMessage: (message: ChatMessage) => void;
  onRead?: (receipt: ChatReadReceipt) => void;
  onReady: () => void;
  onInterrupted: (message: string, reason: ChatSocketInterruptionReason) => void;
}

// Quản lý topic của một room, dùng chung vòng đời kết nối với socket hộp thư.
export function useChatRoomSocket({ conversationId, onMessage, onRead, onReady, onInterrupted }: ChatSocketOptions) {
  const { publish: send, ...connection } = useChatSocketConnection({
    connectionId: conversationId,
    onInterrupted,
    onConnected: (client, isCurrent, setError) => {
      client.subscribe(`/topic/chat/conversations/${conversationId}`, (frame) => {
        if (!isCurrent()) return;
        try {
          const message: unknown = JSON.parse(frame.body);
          if (isChatMessage(message) && message.conversationId === conversationId) {
            setError("");
            onMessage(message);
          }
        } catch { setError("Không đọc được tin nhắn mới. Vui lòng mở lại chat."); }
      });
      // Tách topic đã đọc để không nhập nhầm receipt thành tin nhắn.
      client.subscribe(`/topic/chat/conversations/${conversationId}/read`, (frame) => {
        if (!isCurrent()) return;
        try {
          const receipt: unknown = JSON.parse(frame.body);
          if (isChatReadReceipt(receipt) && receipt.conversationId === conversationId) onRead?.(receipt);
        } catch { setError("Không cập nhật được trạng thái đã xem. Vui lòng tải lại lịch sử."); }
      });
      client.subscribe("/user/queue/chat/errors", () => {
        if (!isCurrent()) return;
        const message = "Không gửi được tin nhắn. Vui lòng kiểm tra và thử lại.";
        setError(message);
        onInterrupted(message, "server");
      });

      onReady();
    },
  });

  // Chỉ publish vào room đã xác thực; senderId được BE lấy từ Principal.
  const publish = useCallback((content: string) => {
    if (!conversationId) throw new Error("Chat chưa kết nối. Vui lòng thử lại sau.");
    send({ destination: `/app/chat/rooms/${conversationId}/send`, body: JSON.stringify({ content }) });
  }, [conversationId, send]);

  return { ...connection, publish };
}
