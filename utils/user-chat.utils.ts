import type { UserChatConversation } from "@/types/user/chat";
import { formatChatPreviewTime } from "@/utils/chat.utils";

// Chuyển dữ liệu API sang UI, không bổ sung tên hoặc ảnh sản phẩm giả.
export function getUserChatViewModel(conversation: UserChatConversation) {
  // Ưu tiên updatedAt của tin cuối, helper chung đổi offset sang giờ trình duyệt.
  const lastUpdatedAt = conversation.lastMessage?.updatedAt ?? conversation.lastMessage?.createdAt ?? conversation.lastMessageAt ?? "";
  return {
    ...conversation,
    id: String(conversation.conversationId),
    shopName: getUserChatShopName(conversation),
    shopAvatar: conversation.partner.shopLogoUrl || null,
    unreadCount: conversation.unreadMessageCount,
    lastUpdatedAt,
    lastTime: formatChatPreviewTime(lastUpdatedAt),
    previewText: conversation.lastMessage?.content ?? "Chưa có tin nhắn.",
    pinnedProduct: {
      id: conversation.productId,
      name: conversation.productName || `Sản phẩm #${conversation.productId}`,
      image: conversation.productImageUrl || null,
    },
  };
}

export type UserChatViewModel = ReturnType<typeof getUserChatViewModel>;

// Dùng định danh thật khi shop chưa có tên hoặc metadata đã bị xóa.
export function getUserChatShopName(conversation: UserChatConversation) {
  return conversation.partner.shopName || `Shop #${conversation.partner.shopId}`;
}

// API chỉ phân trang, tìm kiếm và lọc chưa đọc áp dụng trong trang đã tải.
export function filterUserChatConversations(conversations: UserChatConversation[], keyword: string, unreadOnly: boolean) {
  const search = keyword.trim().toLocaleLowerCase("vi-VN");
  return conversations.filter((conversation) => {
    if (unreadOnly && conversation.unreadMessageCount <= 0) return false;
    return [getUserChatShopName(conversation), conversation.productName, conversation.lastMessage?.content]
      .some((value) => value?.toLocaleLowerCase("vi-VN").includes(search));
  });
}
