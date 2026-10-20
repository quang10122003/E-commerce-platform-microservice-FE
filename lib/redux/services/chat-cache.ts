import { invalidateChatInbox } from "@/lib/redux/slices/chat-inbox-slice";
import type { AppDispatch } from "@/lib/redux/store";
import type { ChatMessage, ChatReadReceipt } from "@/types/user/chat";

// Receipt chưa có readerId nên lấy lại unread từ server, không tự đặt về 0.
export const syncChatReadPreview = (receipt: ChatReadReceipt, viewerId: number) =>
  (dispatch: AppDispatch) => {
    if (receipt.conversationId > 0) dispatch(invalidateChatInbox(viewerId));
  };

// Room ẩn trên mobile vẫn báo thay đổi để server cập nhật preview và số chưa đọc.
export const syncChatMessagePreview = (message: ChatMessage, viewerId: number) =>
  (dispatch: AppDispatch) => {
    if (message.conversationId > 0) dispatch(invalidateChatInbox(viewerId));
  };
