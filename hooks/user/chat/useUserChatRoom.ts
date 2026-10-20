"use client";

import { useChatMessages } from "@/hooks/shared/useChatMessages";
import { useChatMessageComposer } from "@/hooks/shared/useChatMessageComposer";
import { useProductPriceRange } from "@/hooks/shared/useProductPriceRange";

// Quản lý form và giá sản phẩm, tin nhắn đi qua hàng đợi/socket dùng chung.
export function useUserChatRoom(conversationId: number, userId: number, productId: number, visible = true) {
  const history = useChatMessages(conversationId, userId, visible, false);
  const composer = useChatMessageComposer(history.send, history.canSend);
  const price = useProductPriceRange(productId);
  return { ...history, ...composer, ...price };
}
