import type { ChatMessage, PendingChatMessage, ChatDisplayMessage, ChatMessageRenderIdentity, ChatConversationChangedEvent } from "@/types/user/chat";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";

// Chỉ nhận sự kiện hộp thư đúng contract BE và có thời gian kèm offset hợp lệ.
export function isChatConversationChangedEvent(value: unknown): value is ChatConversationChangedEvent {
  if (!value || typeof value !== "object") return false;
  const event = value as Partial<ChatConversationChangedEvent>;
  return Number.isSafeInteger(event.conversationId) && Number(event.conversationId) > 0
    && typeof event.occurredAt === "string" && !!toLocalDateTimeInput(event.occurredAt);
}

// Kiểm tra payload socket trước khi nhập vào lịch sử đang hiển thị.
export function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return Number.isSafeInteger(message.id) && Number.isSafeInteger(message.conversationId)
    && Number.isSafeInteger(message.senderId) && typeof message.content === "string"
    && typeof message.createdAt === "string";
}

// Gộp lịch sử và realtime theo ID để không lặp tin khi reconnect.
export function mergeChatMessages(current: ChatMessage[], incoming: ChatMessage[], roomId: number) {
  const messages = new Map(current.map((message) => [message.id, message]));
  incoming.filter(isChatMessage).filter((message) => message.conversationId === roomId)
    // Tin đã đọc không bị echo hoặc response lịch sử cũ kéo về chưa đọc.
    .forEach((message) => messages.set(message.id, { ...message, read: !!message.read || !!messages.get(message.id)?.read }));
  return [...messages.values()].sort((left, right) => left.id - right.id);
}

// Dùng helper chung để chuyển OffsetDateTime về giờ của trình duyệt.
export function formatChatTime(value: string) {
  return toLocalDateTimeInput(value).slice(11, 16);
}

// Tin cuối hiện thêm ngày hoặc năm khi khác ngày hiện tại theo múi giờ trình duyệt.
export function formatChatPreviewTime(value: string, now = new Date()) {
  const local = toLocalDateTimeInput(value);
  if (!local || Number.isNaN(now.getTime())) return "";
  const today = toLocalDateTimeInput(now.toISOString());
  const time = local.slice(11, 16);
  if (local.slice(0, 10) === today.slice(0, 10)) return time;
  const date = `${local.slice(8, 10)}/${local.slice(5, 7)}`;
  return `${time}\u2002${date}${local.slice(0, 4) === today.slice(0, 4) ? "" : `/${local.slice(0, 4)}`}`;
}

// Nhận diện nội dung gửi sản phẩm do FE tạo để giữ kiểu thẻ của UI mock.
export function isChatProductReference(content: string, productId: number) {
  if (!content.startsWith("Tôi muốn hỏi về sản phẩm: ")) return false;
  const link = content.split("\n").at(-1);
  try { return !!link && new URL(link).pathname === `/products/${productId}`; }
  catch { return false; }
}

// Trộn theo thời điểm gửi ban đầu; echo chỉ cập nhật dữ liệu, không đổi key hoặc đảo vị trí tin chờ.
export function getChatDisplayMessages(
  messages: ChatMessage[],
  pending: PendingChatMessage[],
  identities: Record<number, ChatMessageRenderIdentity> = {},
): ChatDisplayMessage[] {
  const ordered = [...messages, ...pending].map((message): ChatDisplayMessage & { renderKey: number } => ({
    ...message, renderKey: identities[message.id]?.renderKey ?? message.id,
  })).sort((left, right) => {
    // Tin chưa xác nhận nằm cuối cuộc chat, giữ thứ tự FIFO của hàng đợi.
    const leftPending = !!left.deliveryStatus;
    const rightPending = !!right.deliveryStatus;
    if (leftPending !== rightPending) return Number(leftPending) - Number(rightPending);
    if (leftPending && rightPending) return right.id - left.id;
    const byTime = Date.parse(identities[left.id]?.createdAt ?? left.createdAt)
      - Date.parse(identities[right.id]?.createdAt ?? right.createdAt);
    if (byTime) return byTime;
    if (left.renderKey < 0 && right.renderKey < 0) return right.renderKey - left.renderKey;
    if (left.renderKey < 0 || right.renderKey < 0) return Number(left.renderKey < 0) - Number(right.renderKey < 0);
    return left.id - right.id;
  });
  // Chỉ gom cùng người gửi, cùng phút và cùng trạng thái; tin lỗi giữ cảnh báo riêng.
  return ordered.map((message, index) => {
    const next = ordered[index + 1];
    const minute = toLocalDateTimeInput(message.createdAt);
    const sameMinute = !!minute && !!next && minute === toLocalDateTimeInput(next.createdAt);
    const sameStatus = !!next && getChatDeliveryGroup(message) === getChatDeliveryGroup(next);
    return {
      ...message,
      showMetadata: message.deliveryStatus === "failed" || !sameMinute || !sameStatus
        || message.senderId !== next.senderId || message.conversationId !== next.conversationId,
    };
  });
}

// Tin queued/sending cùng nhóm đang gửi; không gộp với tin đã gửi hoặc đã xem.
function getChatDeliveryGroup(message: ChatDisplayMessage) {
  if (message.deliveryStatus === "failed") return "failed";
  if (message.deliveryStatus) return "sending";
  return message.read ? "seen" : "sent";
}

