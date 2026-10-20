import { ShopChatView } from "@/components/shop/chat/shop-chat-view";
import { getShopChatInbox } from "@/lib/service/chatService";
import type { ChatInboxPageProps } from "@/types/shared/chat-inbox";

// Server tải hộp thư theo URL; lịch sử, read và socket vẫn ở client view.
export default async function ShopChatPage({ searchParams }: ChatInboxPageProps) {
  const { page } = await searchParams;
  const inbox = await getShopChatInbox(page);
  return <ShopChatView inbox={inbox} />;
}
