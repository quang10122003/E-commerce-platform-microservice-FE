import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Package } from "lucide-react";
import type { ShopChatConversation } from "@/types/shop/chat";
import { getChatCustomerName } from "@/utils/shop-chat.utils";
import { ChatCustomerAvatarView } from "./chat-customer-avatar-view";

// Hiển thị đúng khách và sản phẩm của hội thoại đang chọn.
export function ShopChatCustomerPanel({ conversation }: { conversation: ShopChatConversation | null }) {
  if (!conversation) return <p className="p-5 text-xs text-muted-foreground">Chọn hội thoại để xem thông tin.</p>;
  return (
    <div className="text-xs">
      {/* Hồ sơ khách hàng chỉ dùng định danh có trong response, không giả lập thông tin liên hệ. */}
      <section className="border-b border-surface-border p-5">
        <h3 className="mb-5 text-[11px] font-medium text-muted-foreground">Khách hàng</h3>
        <div className="flex items-center gap-3"><ChatCustomerAvatarView className="size-12" /><div className="min-w-0"><p className="break-words text-sm font-semibold">{getChatCustomerName(conversation)}</p></div></div>
        <dl className="mt-5 flex items-center justify-between rounded-lg border border-surface-border bg-surface-subtle px-3 py-3"><dt className="text-muted-foreground">Mã hội thoại</dt><dd className="font-medium tabular-nums">#{conversation.conversationId}</dd></dl>
      </section>
      {/* Sản phẩm trong room, không gán giá hoặc trạng thái đơn hàng giả. */}
      <section className="p-5">
        <h3 className="mb-4 text-[11px] font-medium text-muted-foreground">Sản phẩm đang trao đổi</h3>
        <Link href={`/products/${conversation.productId}`} className="group flex items-center gap-3 rounded-lg border border-surface-border p-3 transition-colors hover:border-primary/30 hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-primary">
          {conversation.productImageUrl ? <Image src={conversation.productImageUrl} alt="" width={52} height={52} unoptimized className="size-13 shrink-0 rounded-md object-cover" /> : <Package className="size-6 shrink-0 text-primary" aria-hidden="true" />}
          <span className="min-w-0 flex-1 break-words text-xs font-medium leading-5">{conversation.productName || `Sản phẩm #${conversation.productId}`}</span>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
