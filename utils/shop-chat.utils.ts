import type { ChatMessage, ChatConnectionStatus } from "@/types/user/chat";
import { isChatMessage } from "@/utils/chat.utils";
import type { ShopChatConversation, ShopChatUiState } from "@/types/shop/chat";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";

// Lọc trong trang đã tải vì API chưa hỗ trợ tìm kiếm trên toàn hộp thư.
export function filterShopChatConversations(conversations: ShopChatConversation[], keyword: string, unreadOnly = false) {
  const search = keyword.trim().toLocaleLowerCase("vi-VN");
  return conversations.filter((conversation) => (!unreadOnly || conversation.unreadMessageCount > 0) &&
    [conversation.partner.fullName, conversation.productName, String(conversation.partner.userId)]
      .some((value) => value?.toLocaleLowerCase("vi-VN").includes(search)));
}

// Giữ room hiển thị được khi metadata tài khoản đã bị xóa.
export function getChatCustomerName(conversation: ShopChatConversation) {
  return conversation.partner.fullName || `Khách #${conversation.partner.userId}`;
}

// Ngày hiển thị dùng cùng múi giờ trình duyệt với giờ của tin nhắn.
export function formatShopChatDate(value: string) {
  return toLocalDateTimeInput(value).slice(0, 10).split("-").reverse().join("/");
}

// BE trả mới nhất trước; đảo bản sao để hiển thị tin cũ trên, tin mới dưới.
export function prepareShopChatMessages(messages: ChatMessage[], conversationId: number) {
  return messages.filter(isChatMessage).filter((message) => message.conversationId === conversationId).reverse();
}

// Chia ngày theo giờ trình duyệt để không gộp nhầm tin nhắn quanh thời điểm nửa đêm.
export function groupShopChatMessages<T extends ChatMessage>(messages: T[]) {
  const groups: { key: string; date: string; messages: T[] }[] = [];
  const occurrences = new Map<string, number>();
  for (const message of messages) {
    const date = formatShopChatDate(message.createdAt);
    const lastGroup = groups.at(-1);
    if (lastGroup?.date === date) lastGroup.messages.push(message);
    else {
      // Tin chờ có thể thuộc ngày cũ nhưng vẫn nằm cuối; tránh trùng key giữa các khối ngày.
      const occurrence = occurrences.get(date) ?? 0;
      occurrences.set(date, occurrence + 1);
      groups.push({ key: `${date}:${occurrence}`, date, messages: [message] });
    }
  }
  return groups;
}

interface ShopChatUiStateOptions {
  enabled: boolean;
  loading: boolean;
  connectionStatus: ChatConnectionStatus;
  refreshing: boolean;
  historyError: string;
  socketError: string;
  hasFailedMessage: boolean;
}

// Ưu tiên sự cố kết nối trước; không nhầm lỗi gửi tin với trạng thái mất socket.
export function getShopChatUiState(options: ShopChatUiStateOptions): ShopChatUiState {
  if (!options.enabled) return "idle";
  if (options.loading) return "loading";
  if (options.connectionStatus === "reconnecting" || options.connectionStatus === "error") return "reconnecting";
  if (options.historyError) return "history-error";
  if (options.connectionStatus === "connecting") return "connecting";
  if (options.refreshing) return "syncing";
  if (options.hasFailedMessage) return "send-error";
  if (options.socketError) return "message-error";
  return "connected";
}


