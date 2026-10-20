import type { ChatConversationSummary, ChatConversationPage, ChatConversationListQuery } from "@/types/user/chat";

// Metadata hộp thư shop; thời gian ISO có offset, không có toàn bộ lịch sử.
export type ShopChatConversation = ChatConversationSummary<{ userId: number; fullName: string | null }>;
export type ShopChatConversationPage = ChatConversationPage<ShopChatConversation>;
export type ShopChatConversationQuery = ChatConversationListQuery;

// Trạng thái hiển thị của room, tách lỗi lịch sử khỏi mất kết nối realtime.
export type ShopChatUiState = "idle" | "loading" | "connecting" | "reconnecting" | "syncing" | "history-error" | "send-error" | "message-error" | "connected";
