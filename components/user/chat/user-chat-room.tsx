"use client";

import Image from "next/image";
import Link from "next/link";
import { Send, Store, Package, Check, CheckCheck, Loader2, X, ArrowLeft } from "lucide-react";
import { useUserChatRoom } from "@/hooks/user/chat/useUserChatRoom";
import { formatChatTime } from "@/utils/chat.utils";
import type { UserChatViewModel } from "@/utils/user-chat.utils";
import { CHAT_MAX_CONTENT_LENGTH } from "@/types/user/chat";
import { UserChatRoomSkeleton } from "./user-chat-room-skeleton";
import { ChatProductPriceView } from "@/components/shared/chat/ChatProductPriceView";
import { ChatHistoryLoadMoreView } from "@/components/shared/chat/ChatHistoryLoadMoreView";

interface UserChatRoomProps {
  conversation: UserChatViewModel;
  userId: number;
  visible: boolean;
  onBack: () => void;
  onClose: () => void;
}

// Giữ UI trò chuyện cũ; lịch sử và thao tác gửi dùng API/socket thật.
export function UserChatRoom({ conversation, userId, visible, onBack, onClose }: UserChatRoomProps) {
  const { historyRef, historyContentRef, ...room } = useUserChatRoom(conversation.conversationId, userId, conversation.productId, visible);
  const product = conversation.pinnedProduct;
  const inputError = room.form.formState.errors.content?.message;
  const sending = room.form.formState.isSubmitting;

  return (
    <div className="flex flex-col h-full min-h-0 overflow-hidden bg-[#F8FAFC]">
      {/* Header thông tin Shop */}
      <div className="flex shrink-0 items-center justify-between gap-3 px-3 sm:px-5 py-3 border-b border-slate-200 bg-white shadow-2xs">
        <div className="flex min-w-0 items-center gap-3">
          {/* Quay lại hộp thư mobile mà không hủy kết nối và tin đang chờ gửi. */}
          <button type="button" onClick={onBack} aria-label="Quay lại hộp thư" className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-2 focus-visible:outline-primary md:hidden"><ArrowLeft aria-hidden="true" className="size-5" /></button>
          <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary">
            {conversation.shopAvatar ? <Image src={conversation.shopAvatar} alt={conversation.shopName} fill unoptimized sizes="40px" className="rounded-full object-cover border border-slate-200" /> : <Store aria-hidden="true" className="size-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-bold text-slate-800">{conversation.shopName}</h3>
            </div>
          </div>
        </div>
        {/* Đóng hội thoại trả về khung trống; không tự mở lại room đầu tiên. */}
        <div className="flex shrink-0 items-center gap-1.5">
          <Link href={`/shops/${conversation.partner.shopId}`} aria-label="Xem Shop" className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition"><Store className="w-3.5 h-3.5 text-primary" /><span className="hidden sm:inline">Xem Shop</span></Link>
          <button type="button" onClick={onClose} aria-label="Đóng hội thoại" title="Đóng hội thoại" className="flex size-10 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-primary focus-visible:outline-2 focus-visible:outline-primary active:scale-95"><X aria-hidden="true" className="size-[18px]" /></button>
        </div>
      </div>
      {/* Ghim sản phẩm đang hỏi / vừa xem */}
      {product && (
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-2.5 bg-white border-b border-slate-200/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-primary-light text-primary">{product.image ? <Image src={product.image} alt={product.name} fill unoptimized sizes="48px" className="object-cover" /> : <Package aria-hidden="true" className="size-5" />}</div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{product.name}</p>
              <ChatProductPriceView price={room.productPrice} loading={room.priceLoading} />
            </div>
          </div>
          <Link href={`/products/${product.id}`} className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary hover:text-white text-primary text-xs font-semibold transition active:scale-95"><Package className="w-3.5 h-3.5" /><span>Xem sản phẩm</span></Link>
        </div>
      )}
      {/* Luồng tin nhắn */}
      <div ref={historyRef} role="log" aria-label="Lịch sử trò chuyện" aria-live="polite" aria-relevant="additions" aria-busy={room.loading} className="flex-1 min-h-0 overflow-y-auto overscroll-contain [overflow-anchor:none] [scroll-behavior:auto] p-4 space-y-3.5">
        <div ref={historyContentRef} className="space-y-3.5">
          <ChatHistoryLoadMoreView hasOlder={room.hasOlder} loading={room.olderLoading} error={room.olderError} onLoad={room.loadEarlier} />
          {room.loading && !room.messages.length && <UserChatRoomSkeleton />}
          {room.error && <p role="alert" className="text-xs text-danger">{room.error}<button type="button" onClick={room.reload} className="ml-2 cursor-pointer underline">Thử lại</button></p>}
          {!room.loading && !room.error && !room.messages.length && <p className="text-center text-xs text-slate-500">Chưa có tin nhắn.</p>}
          {/* Dùng nhóm ngày theo giờ trình duyệt và nhãn ngày giống chat shop. */}
          {room.groups.map((group) => (
            <div key={group.key} className="space-y-3.5">
              <div className="my-3 flex items-center justify-center">
                <span className="rounded-full bg-slate-200/80 px-3 py-0.5 text-[10px] font-semibold text-slate-600 shadow-2xs">{group.date}</span>
              </div>
              {group.messages.map((message) => {
                const isUser = message.senderId === userId;
                return (
                  <div key={message.renderKey ?? message.id} data-chat-message-id={message.renderKey ?? message.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${isUser ? "bg-gradient-to-r from-primary to-indigo-600 text-white rounded-br-xs" : "bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs"}`}>
                      <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{message.content}</p>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
                      <time dateTime={message.createdAt}>{formatChatTime(message.createdAt)}</time>
                      {isUser && (message.deliveryStatus ? <span>{message.deliveryStatus === "failed" ? "Chưa gửi được" : "Đang gửi"}</span> : message.read ? <CheckCheck aria-label="Đã xem" className="size-3 text-primary" /> : <Check aria-label="Đã gửi" className="size-3" />)}
                      {message.deliveryStatus === "failed" && message.id === room.pendingHeadId && <button type="button" onClick={room.retryQueuedMessage} className="cursor-pointer underline">Gửi lại</button>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Các câu hỏi nhanh gửi qua cùng luồng validation và socket. */}
      <div className="shrink-0 flex gap-2 overflow-x-auto px-3 py-2 bg-white border-t border-slate-100">
        {["Sản phẩm còn hàng không shop?", "Khi nào shop giao hàng?", "Có được kiểm tra hàng trước khi nhận không?"].map((question) => (
          <button key={question} type="button" disabled={!room.canSend || sending} onClick={() => room.sendText(question)} className="shrink-0 text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full transition active:scale-95 cursor-pointer disabled:opacity-40">{question}</button>
        ))}
      </div>
      {/* Khung nhập tin nhắn */}
      <form onSubmit={room.onSubmit} className="shrink-0 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] bg-white border-t border-slate-200">
        <div className="flex items-center gap-2">
          <input {...room.field} type="text" aria-label="Tin nhắn gửi shop" aria-invalid={!!inputError} aria-describedby={inputError ? "user-chat-content-error" : undefined} maxLength={CHAT_MAX_CONTENT_LENGTH} disabled={sending} placeholder={`Nhắn tin cho ${conversation.shopName}...`} className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs outline-none focus:border-primary focus:bg-white transition" />
          <button type="submit" disabled={!room.canSend || !room.hasContent || sending} className="h-9 px-4 rounded-xl bg-primary text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-primary-hover active:scale-95 disabled:opacity-40 transition cursor-pointer">{sending ? <Loader2 aria-hidden="true" className="size-3.5 animate-spin motion-reduce:animate-none" /> : <Send className="w-3.5 h-3.5" />}<span>Gửi</span></button>
        </div>
        {inputError && <p id="user-chat-content-error" role="alert" className="mt-1 text-xs text-danger">{inputError}</p>}
      </form>
    </div>
  );
}
