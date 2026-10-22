"use client";

import { useChatMessageComposer } from "@/hooks/shared/useChatMessageComposer";

// Form xóa ô nhập sau khi tin được đưa vào hàng đợi của bóng chat.
export function useProductChatMessageForm(send: (content: string) => Promise<void>, product: { productId: number; productName: string }) {
  const composer = useChatMessageComposer(send);

  // Gửi tên và link thật; BE vẫn nhận payload text như luồng hiện tại.
  const sendProduct = () => composer.sendText(`Tôi muốn hỏi về sản phẩm: ${product.productName}\n${window.location.origin}/products/${product.productId}`);

  return { ...composer, sendProduct };
}
