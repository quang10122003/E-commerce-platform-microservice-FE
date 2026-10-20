"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Search, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserChatState } from "@/hooks/user/chat/useUserChat";
import { UserChatShopListSkeleton } from "./user-chat-shop-list-skeleton";

// Giữ giao diện danh sách shop cũ, nhận dữ liệu và handler từ hook API.
export function UserChatShopList({ chat }: { chat: UserChatState }) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-white border-b border-slate-200 md:border-r md:border-b-0">
      {/* Header danh sách shop và thanh tìm kiếm */}
      <div className="shrink-0 p-3.5 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-800 tracking-tight">Trò chuyện</h2>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{chat.totalItems} cuộc trò chuyện</span>
        </div>
        {/* Thanh tìm kiếm shop */}
        <div className="relative">
          <Search aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" aria-label="Tìm theo tên shop hoặc tin nhắn" value={chat.keyword} onChange={(event) => chat.setKeyword(event.target.value)} placeholder="Tìm theo tên shop hoặc tin nhắn..." className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-primary focus:bg-white transition" />
        </div>
        {/* Tab lọc nhanh */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <button type="button" aria-pressed={!chat.unreadOnly} onClick={() => chat.setUnreadOnly(false)} className={cn("px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer", !chat.unreadOnly ? "bg-primary text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>Tất cả</button>
          <button type="button" aria-pressed={chat.unreadOnly} onClick={() => chat.setUnreadOnly(true)} className={cn("px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer flex items-center gap-1.5", chat.unreadOnly ? "bg-primary text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
            <span>Chưa đọc</span><span title="Hội thoại chưa đọc trong trang hiện tại" className="text-[10px] px-1.5 py-0.2 rounded-full bg-cta text-white font-bold">{chat.unreadRoomsInPage}</span>
          </button>
        </div>
      </div>
      {/* Danh sách các Shop */}
      <div aria-busy={chat.loading} className="flex-1 min-h-0 overflow-y-auto overscroll-contain divide-y divide-slate-100">
        {chat.loading && !chat.conversations.length && <UserChatShopListSkeleton />}
        {chat.error && <div role="alert" className="p-4 text-xs text-danger"><p>{chat.error}</p>{chat.canAccess && <button type="button" onClick={chat.retry} className="mt-2 cursor-pointer font-semibold underline">Thử lại</button>}</div>}
        {!chat.loading && !chat.error && !chat.conversations.length && <p className="p-4 text-center text-xs text-slate-500">Không có hội thoại phù hợp.</p>}
        {chat.conversations.map((shop) => {
          const isSelected = shop.conversationId === chat.selected?.conversationId;
          return (
            <button key={shop.id} type="button" onClick={() => chat.select(shop.conversationId)} aria-current={isSelected ? "true" : undefined} className={cn("w-full text-left p-3.5 flex items-start gap-3 transition-colors cursor-pointer", isSelected ? "bg-indigo-50/60 border-l-4 border-primary" : "hover:bg-slate-50 border-l-4 border-transparent")}>
              {/* Avatar Shop */}
              <div className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
                {shop.shopAvatar ? <Image src={shop.shopAvatar} alt={shop.shopName} fill unoptimized sizes="44px" className="rounded-full object-cover border border-slate-200" /> : <Store aria-hidden="true" className="size-5" />}
              </div>
              {/* Thông tin hội thoại tóm tắt */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={cn("text-xs font-bold truncate", isSelected ? "text-primary" : "text-slate-800")}>{shop.shopName}</span>
                  </div>
                </div>
                <p title={shop.previewText} className={cn("text-xs truncate mb-1", shop.unreadCount > 0 ? "font-bold text-slate-900" : "text-slate-500")}>{shop.previewText}</p>
                <div className="flex items-center justify-between">
                  <time dateTime={shop.lastUpdatedAt || undefined} className="text-[10px] text-slate-400">{shop.lastTime}</time>
                  {shop.unreadCount > 0 && <span role="status" className="h-4 min-w-4 px-1 rounded-full bg-cta text-white text-[10px] font-bold flex items-center justify-center"><span aria-hidden="true">{shop.unreadCount > 99 ? "99+" : shop.unreadCount}</span><span className="sr-only">{shop.unreadCount} tin nhắn chưa đọc</span></span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {chat.totalPages > 1 && <nav aria-label="Phân trang hộp thư" className="flex shrink-0 items-center justify-between border-t border-slate-100 px-3 py-1 text-xs text-slate-500">
        <button type="button" aria-label="Trang trước" onClick={chat.previousPage} disabled={chat.page <= 1 || chat.refreshing} className="flex size-9 cursor-pointer items-center justify-center disabled:opacity-40"><ChevronLeft className="size-4" /></button>
        <span>{chat.page}/{chat.totalPages}</span>
        <button type="button" aria-label="Trang sau" onClick={chat.nextPage} disabled={chat.page >= chat.totalPages || chat.refreshing} className="flex size-9 cursor-pointer items-center justify-center disabled:opacity-40"><ChevronRight className="size-4" /></button>
      </nav>}
    </div>
  );
}
