"use client";

import { cn } from "@/lib/utils";
import { useShopChat } from "@/hooks/shop/chat/useShopChat";
import { ShopChatConversationList } from "./shop-chat-conversation-list";
import { ShopChatMessageRoom } from "./shop-chat-message-room";
import { ChatEmptyWorkspaceView } from "./chat-empty-workspace-view";
import type { ChatInboxServerData } from "@/types/shared/chat-inbox";
import type { ShopChatConversation } from "@/types/shop/chat";

// Giao diện trung tâm tin nhắn trò chuyện của shop với khách hàng.
export function ShopChatView({ inbox }: { inbox: ChatInboxServerData<ShopChatConversation> }) {
  // Quản lý trạng thái danh sách hội thoại, phòng chat đang chọn và phân trang
  const chat = useShopChat(inbox);

  return (
    // Khung bao phủ toàn bộ diện tích nội dung với nền Slate tinh tế
    <div className="h-full min-h-0 bg-[#EEF2F6] p-2 text-slate-800 selection:bg-indigo-100 sm:p-3 lg:p-4">
      <h1 className="sr-only">Tin nhắn khách hàng của shop</h1>

      {/* Bố cục lưới 2 cột: Cột hộp thư khách hàng và cột phòng chat chi tiết */}
      <div className="grid h-full min-h-0 min-w-0 overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/90 bg-white shadow-card md:grid-cols-[320px_minmax(0,1fr)] lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[380px_minmax(0,1fr)]">
        {/* Cột 1: Danh sách hội thoại khách hàng */}
        <aside
          aria-label="Hộp thư khách hàng"
          className={cn(
            "min-h-0 border-slate-200/90 md:block md:border-r bg-white",
            chat.selected && !chat.showMobileList && "hidden"
          )}
        >
          <ShopChatConversationList chat={chat} />
        </aside>

        {/* Cột 2: Cửa sổ nội dung chat chi tiết hoặc màn hình chờ */}
        <div className={cn("min-h-0 min-w-0 bg-slate-50/70", !chat.selected || chat.showMobileList ? "hidden md:block" : "block")}>
          {chat.selected ? (
            <ShopChatMessageRoom
              key={`${chat.userId}:${chat.selected.conversationId}`}
              conversation={chat.selected}
              userId={chat.userId}
              visible={chat.roomVisible}
              onBack={chat.showConversations}
              onClose={chat.closeConversation}
            />
          ) : (
            <ChatEmptyWorkspaceView />
          )}
        </div>
      </div>
    </div>
  );
}
