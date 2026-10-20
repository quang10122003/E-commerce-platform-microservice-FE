"use client";

import { ChatScrollToLatestView } from "@/components/shared/chat/ChatScrollToLatestView";
import { ProductChatDeliveryView } from "./ProductChatDeliveryView";
import { Loader2, Send } from "lucide-react";
import { useProductChatRoom } from "@/hooks/user/product-detail/useProductChatRoom";
import { useProductChatMessageForm } from "@/hooks/user/product-detail/useProductChatMessageForm";
import { cn } from "@/lib/utils";
import { formatChatTime, isChatProductReference } from "@/utils/chat.utils";
import { CHAT_MAX_CONTENT_LENGTH } from "@/types/user/chat";
import { ProductChatProductView, type ChatProductPreview } from "./ProductChatProductView";

interface ProductChatRoomViewProps {
  product: ChatProductPreview;
  userId: number;
  visible: boolean;
  onUnreadCountChange: (count: number) => void;
}

// Render lịch sử thật và composer; các thao tác mạng được hook quản lý.
export function ProductChatRoomView({ product, userId, visible, onUnreadCountChange }: ProductChatRoomViewProps) {
  const room = useProductChatRoom(product.productId, userId, visible, onUnreadCountChange);
  const { form, field, onSubmit, sendText, sendProduct, historyRef, historyContentRef, hasNewMessages, scrollToLatest } = useProductChatMessageForm(room.send, room.messages.length, visible, product);
  const sending = form.formState.isSubmitting;
  const inputError = form.formState.errors.content?.message;
  const disabled = !room.canSend || sending;

  return (
    <>
      {/* Ghim thông tin sản phẩm và nút gửi ở đúng vị trí của UI mock. */}
      <ProductChatProductView product={product} onSend={sendProduct} disabled={disabled} />
      {room.error && <div role="alert" className="shrink-0 border-b border-slate-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
        <p>{room.error}</p>
        {!room.loading && <button type="button" onClick={room.retry} className="mt-1 font-semibold underline underline-offset-2 cursor-pointer">Tải lại lịch sử</button>}
      </div>}
      {/* Cuộn nội bộ tránh kéo theo toàn bộ trang chi tiết sản phẩm. */}
      <div className="relative min-h-0 flex-1">
        <div ref={historyRef} role="log" aria-label="Lịch sử trò chuyện" aria-live="polite" aria-relevant="additions" aria-busy={room.loading} className="h-full min-h-0 overflow-y-auto overscroll-contain p-3.5 bg-slate-50">
          <div ref={historyContentRef} className="space-y-2.5">
            {room.loading && <p role="status" className="py-6 text-center text-xs text-slate-500">Đang tải hội thoại…</p>}
            {!room.loading && room.status !== "connected" && <p role="status" className="text-center text-xs text-slate-500">{room.status === "reconnecting" ? "Đang kết nối lại…" : "Đang kết nối chat…"}</p>}
            {!room.loading && !room.messages.length && <p className="py-6 text-center text-xs text-slate-500">Chưa có tin nhắn. Hãy gửi câu hỏi đầu tiên cho shop.</p>}
            {/* Chia ngày theo múi giờ trình duyệt, dùng chung logic với hộp thư shop. */}
            {room.groups.map((group) => (
              <div key={group.key} className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-slate-200" />
                  <span className="text-[10px] text-slate-500">{group.date}</span>
                  <span className="h-px flex-1 bg-slate-200" />
                </div>
                {group.messages.map((message) => (
                  <div key={message.renderKey ?? message.id} className={cn("flex flex-col", message.senderId === userId ? "items-end" : "items-start")}>
                    {isChatProductReference(message.content, product.productId) ? (
                      <ProductChatProductView product={product} shared sharedLabel={message.deliveryStatus ? "Thông tin sản phẩm — chưa xác nhận gửi" : undefined} />
                    ) : (
                      <p className={cn("max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-3 py-2 text-xs leading-relaxed [overflow-wrap:anywhere]", message.senderId === userId ? "bg-primary text-white rounded-br-xs" : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-xs")}>{message.content}</p>
                    )}
                    {message.showMetadata && <time dateTime={message.createdAt} className="mt-1 text-[9px] text-slate-400 px-1">{formatChatTime(message.createdAt)}</time>}
                    {(message.showMetadata || message.deliveryStatus === "failed") && <ProductChatDeliveryView message={message} outgoing={message.senderId === userId} canRetry={message.deliveryStatus === "failed" && message.id === room.pendingHeadId} onRetry={room.retryQueuedMessage} />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <ChatScrollToLatestView visible={hasNewMessages} onClick={scrollToLatest} />
      </div>
      {/* Gợi ý câu hỏi nhanh của UI mock, gửi qua cùng luồng API/socket thật. */}
      <div className="flex shrink-0 gap-1.5 overflow-x-auto px-3 py-2 bg-white border-t border-slate-100">
        {["Còn hàng không shop?", "Thời gian giao hàng?", "Có được xem hàng không?"].map((text) => (
          <button key={text} type="button" disabled={disabled} onClick={() => sendText(text)} className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-600 hover:border-primary hover:text-primary transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">{text}</button>
        ))}
      </div>
      {room.showQueueNotice && <p className="shrink-0 bg-amber-50 px-3 py-1.5 text-[10px] text-amber-900">{room.pendingCount} tin chưa xác nhận. Đóng chat hoặc tải lại trang sẽ mất tin đang chờ.</p>}
      {/* Validation tại field; xóa ô nhập sau khi tin được thêm vào hàng đợi. */}
      <form onSubmit={onSubmit} className="shrink-0 border-t border-slate-100 bg-white p-2.5">
        <div className="flex items-center gap-2">
          <input {...field} type="text" aria-label="Tin nhắn" aria-invalid={!!inputError} aria-describedby={inputError ? "chat-content-error" : undefined} disabled={sending} maxLength={CHAT_MAX_CONTENT_LENGTH} autoComplete="off" placeholder="Nhập tin nhắn..." className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs outline-none focus:border-primary focus:bg-white transition disabled:opacity-60" />
          <button type="submit" disabled={disabled} aria-label={sending ? "Đang gửi tin nhắn" : "Gửi tin nhắn"} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary text-white disabled:opacity-40 hover:bg-primary-hover active:scale-95 transition disabled:cursor-not-allowed cursor-pointer">
            {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          </button>
        </div>
        {inputError && <p id="chat-content-error" role="alert" className="mt-2 text-xs text-destructive">{inputError}</p>}
      </form>
    </>
  );
}





