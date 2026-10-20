import type { RefObject } from "react";
import { X } from "lucide-react";
import type { ShopChatConversation } from "@/types/shop/chat";
import { ShopChatCustomerPanel } from "./shop-chat-customer-panel";

interface ShopChatCustomerDialogViewProps {
  dialogRef: RefObject<HTMLDialogElement | null>;
  conversation: ShopChatConversation;
  onClose: () => void;
}

// Panel ở top layer để không bị cắt bởi workspace; chỉ mở khi nhấn thông tin hội thoại.
export function ShopChatCustomerDialogView({ dialogRef, conversation, onClose }: ShopChatCustomerDialogViewProps) {
  return (
    <dialog ref={dialogRef} onClose={onClose} aria-labelledby="chat-customer-dialog-title" className="fixed inset-y-0 left-auto right-0 m-0 h-full max-h-none w-[360px] max-w-[calc(100%-24px)] border-0 border-l border-surface-border bg-surface-card p-0 text-main shadow-xl backdrop:bg-slate-950/35 backdrop:backdrop-blur-[2px]">
      <header className="flex items-center justify-between border-b border-surface-border px-5 py-4">
        <h2 id="chat-customer-dialog-title" className="text-sm font-semibold">Chi tiết hội thoại</h2>
        <form method="dialog"><button type="submit" aria-label="Đóng thông tin hội thoại" className="flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-surface-subtle hover:text-main focus-visible:outline-2 focus-visible:outline-primary cursor-pointer"><X className="size-4" /></button></form>
      </header>
      <ShopChatCustomerPanel conversation={conversation} />
    </dialog>
  );
}
