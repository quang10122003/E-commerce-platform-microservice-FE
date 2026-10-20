// Tin nhắn do backend xác nhận và phát tới các thành viên hội thoại.
export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  content: string;
  read: boolean;
  // Thời gian ISO có offset, được đổi sang múi giờ trình duyệt khi hiển thị.
  createdAt: string;
  updatedAt: string;
}

// API mở room chỉ trả định danh, không kèm lịch sử tin nhắn.
export interface ChatConversation {
  conversationId: number;
}

// Metadata hội thoại dùng chung; mỗi phía nhận thông tin đối tác khác nhau.
export interface ChatConversationSummary<Partner> {
  conversationId: number;
  partner: Partner;
  productId: number;
  productName: string | null;
  productImageUrl: string | null;
  lastMessage: ChatMessage | null;
  lastMessageAt: string | null;
  unreadMessageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversationPage<Conversation> {
  items: Conversation[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ChatConversationListQuery {
  page: number;
  size: number;
  // Chỉ tách cache giữa các tài khoản, không truyền định danh này tới BE.
  viewerId: number;
}

export type UserChatConversation = ChatConversationSummary<{
  shopId: number;
  shopName: string | null;
  shopLogoUrl: string | null;
}>;
export type UserChatConversationPage = ChatConversationPage<UserChatConversation>;

// BE trả cùng payload cho API đọc hội thoại và topic /read, chưa có readerId.
export interface ChatReadReceipt {
  conversationId: number;
  lastReadMessageId: number | null;
}

// Sự kiện hộp thư chỉ báo room thay đổi; danh sách và unread vẫn lấy từ API server.
export interface ChatConversationChangedEvent {
  conversationId: number;
  occurredAt: string;
}

// Vé ngắn hạn dùng một lần, không phải JWT của phiên đăng nhập.
export interface ChatWsTicket {
  ticket: string;
  expiresAt: string;
}

export type ChatConnectionStatus = "connecting" | "connected" | "reconnecting" | "error";
export const CHAT_MAX_CONTENT_LENGTH = 4000;

// Truy vấn lịch sử theo room; viewerId chỉ phân tách dữ liệu giữa các tài khoản.
export interface ChatConversationMessagesQuery {
  conversationId: number;
  viewerId: number;
}

// Tin chờ của hội thoại chỉ có ID âm trong bộ nhớ, không gửi ID này tới BE.
export interface PendingChatMessage extends ChatMessage {
  deliveryStatus: "queued" | "sending" | "failed";
  deliveryError?: string;
  afterId?: number;
  failureReason?: "server" | "timeout";
}

// Giữ identity hiển thị trong phiên để echo BE không thay mới bong bóng optimistic.
export interface ChatMessageRenderIdentity {
  renderKey: number;
  createdAt: string;
}

export type ChatDisplayMessage = ChatMessage & Partial<Pick<PendingChatMessage, "deliveryStatus" | "deliveryError">> & { renderKey?: number; showMetadata?: boolean };

// Giữ tên type cũ cho bóng chat sản phẩm khi dùng hàng đợi chung.
export type PendingProductChatMessage = PendingChatMessage;
export type ProductChatDisplayMessage = ChatDisplayMessage;
export type ChatSocketInterruptionReason = "connection" | "server";



