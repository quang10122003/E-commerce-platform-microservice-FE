import { ChevronLeft, ChevronRight, MessageSquareText, Package, Search, SearchX, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShopChatState } from "@/hooks/shop/chat/useShopChat";
import { formatChatPreviewTime } from "@/utils/chat.utils";
import { getChatCustomerName } from "@/utils/shop-chat.utils";
import { ChatCustomerAvatarView } from "./chat-customer-avatar-view";

// Cột danh sách hội thoại khách hàng với bộ lọc tìm kiếm và phân trang từ API.
export function ShopChatConversationList({ chat }: { chat: ShopChatState }) {
  return (
    // Khung chứa toàn bộ cột hội thoại với nền trắng và đường viền phân tách
    <div className="flex h-full min-h-0 flex-col bg-white">
      {/* Header và ô tìm kiếm khách hàng */}
      <header className="shrink-0 border-b border-slate-200/90 bg-white p-3.5 space-y-3">
        {/* Hàng tiêu đề với số lượng hội thoại */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-indigo-50 text-primary">
              <MessageSquareText className="size-4" aria-hidden="true" />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-slate-800">Hộp thư</h2>
            <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-bold tabular-nums text-primary border border-indigo-100">
              {chat.totalItems}
            </span>
          </div>

        </div>

        {/* Ô tìm kiếm khách hàng hoặc sản phẩm */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" aria-hidden="true" />
          <input
            type="text"
            aria-label="Tìm hội thoại trong trang"
            placeholder="Tìm khách hàng, sản phẩm..."
            value={chat.keyword}
            onChange={(event) => chat.setKeyword(event.target.value)}
            className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-9 pr-8 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
          />
          {/* Nút xóa nhanh từ khóa tìm kiếm */}
          {chat.keyword && (
            <button
              type="button"
              onClick={() => chat.setKeyword("")}
              aria-label="Xóa từ khóa"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          )}
        </div>
        {/* Bộ lọc chưa đọc chỉ áp dụng các hội thoại trong trang đã tải. */}
        <div className="flex items-center gap-1.5">
          <button type="button" aria-pressed={!chat.unreadOnly} onClick={() => chat.setUnreadOnly(false)} className={cn("cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-colors", !chat.unreadOnly ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>Tất cả</button>
          <button type="button" aria-pressed={chat.unreadOnly} onClick={() => chat.setUnreadOnly(true)} className={cn("flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-colors", chat.unreadOnly ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200")}>
            <span>Chưa đọc</span><span title="Hội thoại chưa đọc trong trang hiện tại" className="rounded-full bg-cta px-1.5 text-[10px] font-bold text-white">{chat.unreadRoomsInPage}</span>
          </button>
        </div>
      </header>

      {/* Vùng danh sách cuộc trò chuyện cuộn độc lập */}
      <div aria-busy={chat.loading} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-slate-50/50 p-2 sm:p-2.5 space-y-2">
        {/* Skeleton loading khi đang tải dữ liệu lần đầu */}
        {chat.loading && !chat.conversations.length && (
          <div role="status" aria-label="Đang tải hội thoại" className="space-y-2 p-1">
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} aria-hidden="true" className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3 shadow-2xs">
                <div className="skeleton-shimmer size-10 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2 py-0.5">
                  <div className="flex justify-between gap-2">
                    <div className="skeleton-shimmer h-3.5 w-1/2 rounded" />
                    <div className="skeleton-shimmer h-3 w-12 rounded" />
                  </div>
                  <div className="skeleton-shimmer h-3 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Thông báo lỗi khi không thể tải danh sách */}
        {chat.error && (
          <div role="alert" className="m-1 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs leading-relaxed text-rose-800">
            <p className="font-semibold">{chat.error}</p>
            {chat.canAccess && (
              <button
                type="button"
                onClick={chat.retry}
                className="mt-2 inline-flex items-center gap-1 font-semibold text-rose-700 underline underline-offset-2 hover:text-rose-900 cursor-pointer"
              >
                Thử lại ngay
              </button>
            )}
          </div>
        )}

        {/* Trạng thái trống khi không có cuộc trò chuyện */}
        {!chat.loading && !chat.error && !chat.conversations.length && (
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              {chat.keyword ? <SearchX className="size-6" aria-hidden="true" /> : <MessageSquareText className="size-6 text-primary" aria-hidden="true" />}
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {chat.keyword ? "Không tìm thấy hội thoại" : "Chưa có hội thoại nào"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500 max-w-[200px]">
              {chat.keyword ? "Thử tìm bằng tên khách hàng hoặc mã sản phẩm khác." : "Tin nhắn từ khách hàng sẽ xuất hiện tại danh sách này."}
            </p>
            {chat.keyword && (
              <button
                type="button"
                onClick={() => chat.setKeyword("")}
                className="mt-3 inline-flex items-center text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>
        )}

        {/* Danh sách các thẻ hội thoại khách hàng */}
        <ul aria-label="Danh sách hội thoại" className="space-y-1.5">
          {chat.conversations.map((conv) => {
            const isSelected = chat.selected?.conversationId === conv.conversationId;
            return (
              <li key={conv.conversationId}>
                <button
                  type="button"
                  onClick={() => chat.select(conv.conversationId)}
                  aria-current={isSelected ? "true" : undefined}
                  className={cn(
                    "group flex w-full gap-3 rounded-xl border p-2.5 text-left transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-primary",
                    isSelected
                      ? "border-l-4 border-l-primary border-y-slate-200/90 border-r-slate-200/90 bg-indigo-50/70 shadow-2xs"
                      : "border-l-4 border-l-transparent border-y-transparent border-r-transparent bg-white hover:border-slate-200 hover:bg-slate-50/90 shadow-2xs"
                  )}
                >
                  {/* Avatar khách hàng đại diện */}
                  <ChatCustomerAvatarView className="size-10" />

                  {/* Thông tin khách hàng và tóm tắt tin nhắn */}
                  <div className="min-w-0 flex-1">
                    {/* Dòng 1: Tên khách hàng và thời gian tin nhắn cuối */}
                    <div className="flex items-center justify-between gap-1.5">
                      <h3 className={cn("truncate text-xs font-bold leading-5", isSelected ? "text-primary" : "text-slate-800")}>
                        {getChatCustomerName(conv)}
                      </h3>
                      <time
                        dateTime={conv.lastMessage?.updatedAt ?? conv.lastMessage?.createdAt ?? conv.lastMessageAt ?? undefined}
                        className={cn("shrink-0 text-[10px] tabular-nums font-medium", isSelected ? "text-primary" : "text-slate-400")}
                      >
                        {formatChatPreviewTime(conv.lastMessage?.updatedAt ?? conv.lastMessage?.createdAt ?? conv.lastMessageAt ?? "")}
                      </time>
                    </div>

                    {/* Dòng 2: Nhãn sản phẩm liên kết (nếu có) */}
                    {conv.productName && (
                      <div className="mt-0.5 flex items-center gap-1">
                        <span className="inline-flex max-w-full items-center gap-1 rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 truncate">
                          <Package className="size-2.5 shrink-0 text-slate-400" aria-hidden="true" />
                          <span className="truncate">{conv.productName}</span>
                        </span>
                      </div>
                    )}

                    {/* Dòng 3: Nội dung tin nhắn cuối cùng và badge tin chưa đọc */}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className={cn("min-w-0 flex-1 truncate text-xs leading-4", conv.unreadMessageCount > 0 ? "font-semibold text-slate-900" : "text-slate-500")}>
                        {conv.lastMessage?.content ?? "Chưa có tin nhắn."}
                      </p>

                      {/* Badge số lượng tin nhắn chưa đọc */}
                      {conv.unreadMessageCount > 0 && (
                        <span
                          role="status"
                          className="flex h-4.5 min-w-4.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-cta to-rose-500 px-1.5 text-[10px] font-bold tabular-nums text-white shadow-xs"
                        >
                          <span aria-hidden="true">{conv.unreadMessageCount > 99 ? "99+" : conv.unreadMessageCount}</span>
                          <span className="sr-only">{conv.unreadMessageCount} tin nhắn chưa đọc</span>
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Điều hướng phân trang hội thoại */}
      <nav aria-label="Phân trang hội thoại" className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200/90 bg-white px-3.5 py-2.5 text-xs text-slate-600">
        <span className="tabular-nums text-slate-500 text-[11px]">
          {chat.totalItems ? (chat.page - 1) * chat.pageSize + 1 : 0}–{Math.min(chat.page * chat.pageSize, chat.totalItems)} / {chat.totalItems}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={chat.previousPage}
            disabled={chat.loading || chat.page <= 1}
            aria-label="Trang trước"
            className="flex size-7.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="min-w-6 text-center tabular-nums text-[11px] font-semibold text-slate-700">
            {chat.totalPages ? chat.page : 0}/{chat.totalPages}
          </span>
          <button
            type="button"
            onClick={chat.nextPage}
            disabled={chat.loading || chat.page >= chat.totalPages}
            aria-label="Trang sau"
            className="flex size-7.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </nav>
    </div>
  );
}
