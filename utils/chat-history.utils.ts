import type { ScrollResponse } from "@/types/shared/api";
import type { ChatMessage } from "@/types/user/chat";
import { isChatMessage } from "@/utils/chat.utils";

// Kiểm tra batch và scope trước khi nhập lịch sử; không chấp nhận response mảng cũ.
export function isChatMessagePage(value: unknown, conversationId: number): value is ScrollResponse<ChatMessage> {
  if (!value || typeof value !== "object") return false;
  const page = value as Partial<ScrollResponse<ChatMessage>>;
  return Array.isArray(page.items) && page.items.every((message) => isChatMessage(message) && message.conversationId === conversationId)
    && typeof page.hasNext === "boolean"
    && (page.hasNext ? typeof page.nextCursor === "string" && page.nextCursor.length > 0 : page.nextCursor === null);
}

// Cursor sai được phục hồi từ batch đầu, không tự tạo hoặc giải mã cursor.
export function isChatCursorInvalid(error: unknown) {
  if (!error || typeof error !== "object" || !("data" in error)) return false;
  const data = error.data as { error?: { code?: string }; code?: string } | null;
  return data?.error?.code === "CHAT_CURSOR_INVALID" || data?.code === "CHAT_CURSOR_INVALID";
}
