import type { ChatMessage, ChatReadReceipt } from "@/types/user/chat";

// Chấp nhận mốc rỗng khi phía đọc chưa từng nhận tin nào trong room.
export function isChatReadReceipt(value: unknown): value is ChatReadReceipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Partial<ChatReadReceipt>;
  return Number.isSafeInteger(receipt.conversationId) && Number(receipt.conversationId) > 0
    && (receipt.lastReadMessageId === null
      || (Number.isSafeInteger(receipt.lastReadMessageId) && Number(receipt.lastReadMessageId) > 0));
}

// Mốc BE chỉ thuộc các tin cùng người gửi với tin neo, không phải toàn bộ hai chiều.
export function applyChatReadReceipts(messages: ChatMessage[], receiptIds: number[], conversationId: number) {
  const byId = new Map(messages.filter((message) => message.conversationId === conversationId).map((message) => [message.id, message]));
  const senderLimits = new Map<number, number>();
  receiptIds.forEach((id) => {
    const anchor = byId.get(id);
    if (anchor) senderLimits.set(anchor.senderId, Math.max(senderLimits.get(anchor.senderId) ?? 0, id));
  });
  return messages.map((message) => message.conversationId === conversationId
    && message.id > 0 && message.id <= (senderLimits.get(message.senderId) ?? 0)
    ? { ...message, read: true } : message);
}

// Chỉ đếm tin nhận đã lưu ở BE; tin optimistic và tin của chính mình không tính.
export function getChatUnreadMessages(messages: ChatMessage[], conversationId: number, viewerId: number) {
  return messages.filter((message) => message.conversationId === conversationId
    && message.id > 0 && message.senderId !== viewerId && !message.read);
}

// HTTP xác định chắc người đọc nên không cần chờ tin neo xuất hiện trên socket.
export function applyOwnChatReadReceipt(messages: ChatMessage[], conversationId: number, viewerId: number, limit: number) {
  return messages.map((message) => message.conversationId === conversationId
    && message.senderId !== viewerId && message.id > 0 && message.id <= limit
    ? { ...message, read: true } : message);
}
