"use client";

import { cn } from "@/lib/utils";
import { useShopChatMessages } from "@/hooks/shop/chat/useShopChatMessages";
import type { ShopChatConversation } from "@/types/shop/chat";
import { formatChatTime } from "@/utils/chat.utils";
import { getChatCustomerName } from "@/utils/shop-chat.utils";
import { ShopChatRoomHeaderView } from "./shop-chat-room-header-view";
import { ShopChatMessageComposer } from "./shop-chat-message-composer";
import { ChatScrollToLatestView } from "@/components/shared/chat/ChatScrollToLatestView";
import { ChatMessageDeliveryView } from "@/components/shared/chat/ChatMessageDeliveryView";
import { ChatMessageSkeletonView } from "@/components/shared/chat/ChatMessageSkeletonView";
import { ChatHistoryLoadMoreView } from "@/components/shared/chat/ChatHistoryLoadMoreView";

interface ShopChatMessageRoomProps {
  conversation: ShopChatConversation | null;
  userId?: number;
  visible: boolean;
  onBack: () => void;
  onClose: () => void;
}

// Khung cửa sổ trò chuyện chi tiết với khách hàng, quản lý luồng tin nhắn và socket.
export function ShopChatMessageRoom({
  conversation,
  userId,
  visible,
  onBack,
  onClose,
}: ShopChatMessageRoomProps) {
  // Quản lý tin nhắn, socket kết nối và hàng đợi gửi tin
  const { historyRef, historyContentRef, ...history } = useShopChatMessages(
    conversation?.conversationId,
    userId,
    visible
  );
  const customerName = conversation ? getChatCustomerName(conversation) : "Chưa chọn hội thoại";
  
  // Hiển thị skeleton khi đang tải lịch sử lần đầu
  const showMessageSkeleton = history.loading || (history.uiState === "syncing" && !history.count);

  return (
    // Bố cục khung chat chiếm trọn chiều cao với nền Slate nhẹ chống mỏi mắt
    <section aria-label={`Hội thoại với ${customerName}`} className="flex h-full min-h-0 min-w-0 flex-col bg-slate-50/70">
      {/* Thanh tiêu đề hiển thị thông tin đối tác và sản phẩm */}
      <ShopChatRoomHeaderView
        customerName={customerName}
        conversation={conversation}
        onBack={onBack}
        onClose={onClose}
      />

      {/* Chỉ báo lỗi tải lịch sử; mất socket và reconnect chạy ngầm. */}
      {history.historyError && (
        <p role="alert" className="shrink-0 px-4 py-2 text-xs text-danger sm:px-5">
          Không tải được lịch sử tin nhắn.
          <button type="button" onClick={history.reload} disabled={history.refreshing} className="ml-2 cursor-pointer underline disabled:opacity-40">Thử lại</button>
        </p>
      )}

      {/* Vùng cuộn lịch sử tin nhắn trò chuyện */}
      <div className="relative min-h-0 flex-1">
        <div
          ref={historyRef}
          role="log"
          aria-label="Lịch sử trò chuyện"
          aria-busy={showMessageSkeleton}
          className="flex h-full min-h-0 flex-col-reverse overflow-y-auto overscroll-contain [overflow-anchor:none] [scroll-behavior:auto] px-3 py-4 sm:px-5 md:px-6"
        >
          <div ref={historyContentRef} className="mx-auto w-full max-w-3xl space-y-4">
            <ChatHistoryLoadMoreView hasOlder={history.hasOlder} loading={history.olderLoading} error={history.olderError} onLoad={history.loadEarlier} />
            {showMessageSkeleton ? (
              <ChatMessageSkeletonView />
            ) : !history.historyError && !history.count ? (
              // Trạng thái khi chưa có tin nhắn trong cuộc trò chuyện
              <div role="status" className="py-12 text-center">
                <p className="text-xs text-slate-500">
                  {conversation ? "Cuộc trò chuyện chưa có tin nhắn nào. Hãy gửi lời chào đến khách hàng!" : "Chọn hội thoại để xem tin nhắn."}
                </p>
              </div>
            ) : (
              // Duyệt qua từng nhóm ngày tin nhắn
              history.groups.map((group) => (
                <div key={group.key} className="space-y-3.5">
                  {/* Dải phân cách ngày gửi tin nhắn */}
                  <div className="my-3 flex items-center justify-center">
                    <span className="rounded-full bg-slate-200/80 px-3 py-0.5 text-[10px] font-semibold text-slate-600 shadow-2xs">
                      {group.date}
                    </span>
                  </div>

                  {/* Danh sách các tin nhắn trong nhóm */}
                  {group.messages.map((message) => {
                    const isShopSender = message.senderId === userId;
                    return (
                      <div
                        key={message.renderKey ?? message.id}
                        data-chat-message-id={message.renderKey ?? message.id}
                        className={cn("flex flex-col gap-1", isShopSender ? "items-end" : "items-start")}
                      >
                        {/* Bong bóng tin nhắn với màu sắc tương phản nổi bật */}
                        <div
                          className={cn(
                            "max-w-[82%] sm:max-w-[76%] whitespace-pre-wrap break-words px-3.5 py-2.5 text-xs sm:text-[13px] leading-relaxed shadow-2xs [overflow-wrap:anywhere]",
                            isShopSender
                              ? message.deliveryStatus === "failed"
                                ? "rounded-2xl rounded-br-xs border border-rose-300 bg-rose-50 text-rose-900"
                                : "rounded-2xl rounded-br-xs bg-gradient-to-r from-primary to-indigo-600 text-white font-normal"
                              : "rounded-2xl rounded-bl-xs border border-slate-200/90 bg-white text-slate-800"
                          )}
                        >
                          {message.content}
                        </div>

                        {/* Thời gian gửi tin nhắn */}
                        {message.showMetadata && (
                          <div className={cn("flex items-center gap-1 px-1 text-[10px] text-slate-400 font-medium", isShopSender ? "justify-end" : "justify-start")}>
                            <time dateTime={message.createdAt}>{formatChatTime(message.createdAt)}</time>
                          </div>
                        )}

                        {/* Trạng thái xác nhận gửi hoặc nút gửi lại khi gặp lỗi */}
                        {(message.showMetadata || message.deliveryStatus) && (
                          <ChatMessageDeliveryView
                            message={message}
                            outgoing={isShopSender}
                            canRetry={message.deliveryStatus === "failed" && message.id === history.pendingHeadId}
                            onRetry={history.retryQueuedMessage}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Nút cuộn nhanh xuống tin nhắn mới nhất */}
        <ChatScrollToLatestView visible={history.hasNewMessages} onClick={history.scrollToLatest} />
      </div>

      {/* Khung soạn thảo tin nhắn gửi khách hàng */}
      <ShopChatMessageComposer
        send={history.send}
        canSend={history.canSend}
        hasConversation={!!conversation}
      />
    </section>
  );
}
