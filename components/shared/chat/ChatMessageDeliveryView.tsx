import { AlertCircle, Check, CheckCheck, Clock3, Loader2 } from "lucide-react";
import type { ChatDisplayMessage } from "@/types/user/chat";

interface ChatMessageDeliveryViewProps {
  message: ChatDisplayMessage;
  outgoing: boolean;
  canRetry: boolean;
  onRetry: () => void;
}

// Phân biệt tin chờ và tin đã xác nhận; giữ chiều cao dòng trạng thái để tránh giật khi nhận echo.
export function ChatMessageDeliveryView({ message, outgoing, canRetry, onRetry }: ChatMessageDeliveryViewProps) {
  if (!outgoing) return null;
  const confirmed = !message.deliveryStatus;
  const seen = confirmed && message.read;
  const failed = message.deliveryStatus === "failed";
  const sending = message.deliveryStatus === "sending";
  const Icon = seen ? CheckCheck : confirmed ? Check : failed ? AlertCircle : sending ? Loader2 : Clock3;
  return (
    <div className={`mt-1 min-h-4 max-w-[85%] text-right text-[10px] ${seen ? "text-primary" : confirmed ? "text-muted-foreground" : "text-amber-800"}`} role="status">
      <span className="inline-flex items-center gap-1">
        <Icon aria-hidden="true" className={`h-3 w-3 shrink-0 ${sending ? "animate-spin motion-reduce:animate-none" : ""}`} />
        {seen ? "Đã xem" : confirmed ? "Đã gửi" : failed ? "Chưa gửi được" : "Đang gửi"}
      </span>
      {failed && message.deliveryError && <p>{message.deliveryError}</p>}
      {canRetry && <button type="button" onClick={onRetry} className="min-h-8 cursor-pointer px-2 font-semibold underline underline-offset-2 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">Gửi lại</button>}
    </div>
  );
}



