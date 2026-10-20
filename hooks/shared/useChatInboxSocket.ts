"use client";

import { useAppDispatch } from "@/lib/redux/hooks";
import { invalidateChatInbox } from "@/lib/redux/slices/chat-inbox-slice";
import { useChatSocketConnection } from "@/hooks/shared/useChatSocketConnection";
import { isChatConversationChangedEvent } from "@/utils/chat.utils";

// Hộp thư giữ kết nối độc lập với room; không có room đang mở vẫn nhận cập nhật.
export function useChatInboxSocket(viewerId: number | null) {
  const dispatch = useAppDispatch();
  useChatSocketConnection({
    connectionId: viewerId,
    onInterrupted: () => {},
    onConnected: (client, isCurrent) => {
      client.subscribe("/user/queue/chat/conversations", (frame) => {
        if (!isCurrent() || !viewerId) return;
        try {
          const event: unknown = JSON.parse(frame.body);
          if (isChatConversationChangedEvent(event)) dispatch(invalidateChatInbox(viewerId));
        } catch {
          // Payload lỗi không làm đứt subscription hoặc hiện thông báo trên giao diện.
        }
      });
      // Subscribe trước rồi tải bù để không bỏ sót thay đổi lúc vào trang hoặc reconnect.
      if (viewerId) dispatch(invalidateChatInbox(viewerId));
    },
  });
}
