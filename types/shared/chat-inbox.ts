import type { ChatConversationPage } from "@/types/user/chat";

export interface ChatInboxServerData<Conversation> {
  data: ChatConversationPage<Conversation>;
  viewerId: number | null;
  error: string;
}

export interface ChatInboxPageProps {
  searchParams: Promise<{ page?: string | string[] }>;
}
