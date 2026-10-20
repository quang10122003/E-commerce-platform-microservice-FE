"use client";

import { AlertCircle, Loader2, Send } from "lucide-react";
import { useChatMessageComposer } from "@/hooks/shared/useChatMessageComposer";
import { cn } from "@/lib/utils";
import { CHAT_MAX_CONTENT_LENGTH } from "@/types/user/chat";

interface ShopChatMessageComposerProps {
  send: (content: string) => Promise<void>;
  canSend: boolean;
  hasConversation: boolean;
}

// Khung soạn thảo và gửi tin nhắn trong phòng chat của người bán.
export function ShopChatMessageComposer({
  send,
  canSend,
  hasConversation,
}: ShopChatMessageComposerProps) {
  // Hook xử lý form soạn thảo tin nhắn, phím tắt Enter và trạng thái gửi
  const { form, field, onSubmit, onKeyDown, hasContent } = useChatMessageComposer(send, canSend);
  const sending = form.formState.isSubmitting;
  const error = form.formState.errors.content?.message;

  return (
    // Khung soạn thảo cố định ở đáy phòng chat với nền trắng và viền trên sắc nét
    <div className="shrink-0 border-t border-slate-200/90 bg-white p-3 sm:px-5 sm:py-3.5">
      <div className="mx-auto w-full max-w-3xl">
        {/* Form nhập nội dung và nút gửi */}
        <form onSubmit={onSubmit} className="flex items-start gap-2.5">
          <div className="min-w-0 flex-1">
            {/* Vùng nhập văn bản đa dòng tự co giãn */}
            <textarea
              {...field}
              aria-label="Nội dung tin nhắn"
              aria-invalid={!!error}
              aria-describedby={error ? "shop-chat-content-error" : undefined}
              onKeyDown={onKeyDown}
              maxLength={CHAT_MAX_CONTENT_LENGTH}
              disabled={!hasConversation || sending}
              placeholder="Nhập tin nhắn trả lời khách hàng..."
              rows={1}
              className={cn(
                "block min-h-[46px] max-h-32 w-full resize-none rounded-xl border bg-slate-50/70 px-4 py-3 text-xs sm:text-sm leading-5 text-slate-800 caret-primary outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:border-primary focus:bg-white focus:ring-3 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                error
                  ? "border-rose-400 bg-rose-50/50"
                  : "border-slate-200"
              )}
            />

            {/* Thông báo lỗi validation nếu có */}
            {error && (
              <p id="shop-chat-content-error" role="alert" className="mt-1.5 flex items-center gap-1 px-1 text-xs font-medium text-rose-600">
                <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}

          </div>

          {/* Nút gửi tin nhắn giữ nguyên giao diện khi mất kết nối. */}
          <button
            type="submit"
            aria-label="Gửi tin nhắn"
            disabled={!canSend || sending || !hasContent}
            className="inline-flex h-[46px] shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-4 text-xs sm:text-sm font-semibold text-white shadow-xs transition-all hover:from-primary-hover hover:to-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:px-5"
          >
            <span>{sending ? "Đang gửi" : "Gửi"}</span>
            {sending ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
            ) : (
              <Send aria-hidden="true" className="size-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
