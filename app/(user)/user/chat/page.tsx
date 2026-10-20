import type { Metadata } from "next";
import { UserChatView } from "@/components/user/chat/user-chat-view";
import { getUserChatInbox } from "@/lib/service/chatService";
import type { ChatInboxPageProps } from "@/types/shared/chat-inbox";

export const metadata: Metadata = {
  title: "Tin nhắn | ModernShop",
  description: "Trò chuyện và nhận tư vấn trực tiếp từ các cửa hàng trên ModernShop",
};

// Trang trò chuyện của người mua (User) với các Shop
export default async function UserChatPage({ searchParams }: ChatInboxPageProps) {
  const { page } = await searchParams;
  const inbox = await getUserChatInbox(page);
  return <UserChatView inbox={inbox} />;
}

