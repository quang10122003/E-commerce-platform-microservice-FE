import { TIME, LOCAL_DATE_TIME_LENGTH } from "@/lib/constants";

// Đọc đúng thời điểm từ ISO có offset; Date tự quy đổi sang múi giờ của môi trường khi lấy thành phần lịch.
export function parseOffsetDateTime(value?: string | null): Date | null {
  if (!value || !/(?:Z|[+-]\d{2}:\d{2})$/i.test(value)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

// Đổi thời gian có offset thành giá trị datetime-local theo múi giờ trình duyệt; dùng phía client.
export function toLocalDateTimeInput(value?: string): string {
  const date = parseOffsetDateTime(value);
  if (!date) return "";
  // Date dùng múi giờ môi trường hiện tại; trong trình duyệt đó là múi giờ thiết bị.
  const local = new Date(date.getTime() - date.getTimezoneOffset() * TIME.MINUTE_MS);
  return local.toISOString().slice(0, LOCAL_DATE_TIME_LENGTH);
}

// Gắn offset trình duyệt vào giờ nhập để server nhận đúng thời điểm; dùng phía client.
export function toOffsetDateTime(value?: string): string | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/.test(value)) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  // Không chấp nhận ngày bị chuẩn hóa hoặc giờ không tồn tại khi chuyển DST.
  const local = new Date(date.getTime() - date.getTimezoneOffset() * TIME.MINUTE_MS).toISOString();
  if (local.slice(0, value.length) !== value) return undefined;
  // Lấy offset tại ngày được chọn để tính đúng múi giờ có DST, không dùng offset của hôm nay.
  const offsetMinutes = -date.getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const hours = String(Math.floor(Math.abs(offsetMinutes) / TIME.MINUTES_PER_HOUR)).padStart(2, "0");
  const minutes = String(Math.abs(offsetMinutes) % TIME.MINUTES_PER_HOUR).padStart(2, "0");
  return `${value.length === LOCAL_DATE_TIME_LENGTH ? `${value}:00` : value}${sign}${hours}:${minutes}`;
}
