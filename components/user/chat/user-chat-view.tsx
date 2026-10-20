"use client";

import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserChat } from "@/hooks/user/chat/useUserChat";
import { UserChatShopList } from "./user-chat-shop-list";
import { UserChatRoom } from "./user-chat-room";
import { UserChatRoomSkeleton } from "./user-chat-room-skeleton";
import type { ChatInboxServerData } from "@/types/shared/chat-inbox";
import type { UserChatConversation } from "@/types/user/chat";

// Giao diện trung tâm tin nhắn trò chuyện của người mua với dữ liệu API thật.
export function UserChatView({ inbox }: { inbox: ChatInboxServerData<UserChatConversation> }) {
  const chat = useUserChat(inbox);
  return (
    <div data-user-chat className="min-h-0 w-full flex-1 overflow-hidden bg-white flex flex-col md:flex-row">
      {/* Cột 1: Danh sách Shop đã nhắn tin. */}
      <div className={cn("h-full min-h-0 w-full shrink-0 md:block md:w-80 lg:w-96", chat.selected && !chat.showMobileList && "hidden")}>
        <UserChatShopList chat={chat} />
      </div>
      {/* Mobile chỉ hiện một vùng; quay lại hộp thư vẫn giữ room nhưng tạm dừng read. */}
      <div className={cn("min-h-0 min-w-0 flex-1 md:h-full", !chat.selected || chat.showMobileList ? "hidden md:block" : "block")}>
        {chat.selected && chat.userId ? (
          <UserChatRoom key={`${chat.userId}:${chat.selected.conversationId}`} conversation={chat.selected} userId={chat.userId} visible={chat.roomVisible} onBack={chat.showConversations} onClose={chat.closeConversation} />
        ) : chat.loading ? <UserChatRoomSkeleton fullRoom /> : (
          <div className="flex h-full flex-col items-center justify-center gap-3 bg-surface-bg p-5 text-center">
            <MessageCircle aria-hidden="true" className="size-9 text-primary" />
            <h2 className="text-sm font-semibold text-main">Trò chuyện với cửa hàng</h2>
            <p className="max-w-xs text-xs leading-5 text-muted-foreground">Chọn một hội thoại để xem lịch sử và tiếp tục trao đổi với shop.</p>
          </div>
        )}
      </div>
    </div>
  );
}
