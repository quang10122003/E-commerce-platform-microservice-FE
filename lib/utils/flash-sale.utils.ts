import { FIRST_PAGE, TIME } from "@/lib/constants";
import type {
  ShopCompletedFlashSaleQuery,
  ShopFlashSaleQuery,
  ShopFlashSaleItem,
  UpdateShopFlashSaleItemRequest,
} from "@/types/shop/flash-sale";

// Giữ các điều kiện lọc khi chuyển trang và mã hóa offset an toàn.
export function getShopFlashSalesUrl(query: ShopFlashSaleQuery) {
  const params = new URLSearchParams();
  if (query.page > FIRST_PAGE) params.set("page", String(query.page));
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.registrationOpen !== undefined) params.set("registrationOpen", String(query.registrationOpen));
  return `/shop/flash-sales${params.size ? `?${params}` : ""}`;
}

// Giữ bộ lọc lịch sử Flash Sale khi chuyển trang hoặc đổi tiêu chí.
export function getShopCompletedFlashSalesUrl(query: ShopCompletedFlashSaleQuery) {
  const params = new URLSearchParams();
  if (query.page > FIRST_PAGE) params.set("page", String(query.page));
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.quickFilter && query.quickFilter !== "all") params.set("range", query.quickFilter);
  return `/shop/flash-sales/history${params.size ? `?${params}` : ""}`;
}

// Đổi mốc thời gian ISO từ API sang giá trị input theo múi giờ trình duyệt.
export function toDateTimeLocalValue(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Date(date.getTime() - date.getTimezoneOffset() * TIME.MINUTE_MS).toISOString().slice(0, 16);
}

// Chuẩn hóa giá trị datetime-local thành ISO có offset cho API.
export function toDateTimeIsoValue(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

// Hiển thị thời lượng còn lại với độ chi tiết đến phút.
export function formatRegistrationRemaining(deadline: string, now: number) {
  const minutes = Math.ceil((new Date(deadline).getTime() - now) / TIME.MINUTE_MS);
  if (minutes <= 0) return "Đã đóng đăng ký";
  const days = Math.floor(minutes / TIME.MINUTES_PER_DAY);
  const hours = Math.floor(minutes % TIME.MINUTES_PER_DAY / TIME.MINUTES_PER_HOUR);
  return `Còn ${days ? `${days} ngày ` : ""}${days || hours ? `${hours} giờ ` : ""}${minutes % TIME.MINUTES_PER_HOUR} phút`;
}

// Tính thời lượng diễn ra chiến dịch từ thời điểm bắt đầu và kết thúc.
export function formatCampaignDuration(startsAt: string, endsAt: string): string {
  const durationMs = Date.parse(endsAt) - Date.parse(startsAt);
  if (!Number.isFinite(durationMs) || durationMs <= 0) return "—";
  const minutes = Math.ceil(durationMs / TIME.MINUTE_MS);
  const days = Math.floor(minutes / TIME.MINUTES_PER_DAY);
  const hours = Math.floor(minutes % TIME.MINUTES_PER_DAY / TIME.MINUTES_PER_HOUR);
  return `${days ? `${days} ngày ` : ""}${days || hours ? `${hours} giờ ` : ""}${minutes % TIME.MINUTES_PER_HOUR} phút`;
}

// Gắn ID vào nhãn để phân biệt các sản phẩm có tên trùng nhau.
export function formatProductOptionLabel(product: { id: number; name: string }): string {
  return `${product.name} (#${product.id})`;
}

// Giới hạn số lượng đăng ký theo quy tắc tồn kho gấp đôi.
export function getRegistrationQuantityLimit(stockQuantity: number): number {
  return Math.floor(stockQuantity / 2);
}

// Chuẩn hóa từ khóa tiếng Việt để tìm tên không phân biệt dấu và hoa thường.
export function normalizeSearchText(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d").toLocaleLowerCase("vi-VN").trim();
}

// Kiểm tra mức giảm FE chấp nhận trước khi gửi API tính giá.
export function isValidDiscountPercent(value: number): boolean {
  return Number.isFinite(value) && value >= 1 && value <= 99
    && Math.abs(value * 100 - Math.round(value * 100)) < 0.000001;
}

// Giữ mức giảm trong khoảng cho phép và cắt phần dư, tránh làm tròn tăng ưu đãi.
export function normalizeDiscountPercent(value: number): number {
  const bounded = Math.min(99, Math.max(1, value));
  const [integer, fraction = ""] = String(bounded).split(".");
  return Number(`${integer}.${fraction.slice(0, 2)}`);
}

// Gửi null khi mức giảm không đổi để backend giữ nguyên giá trị đã đăng ký.
export function getFlashSaleItemUpdateRequest(item: ShopFlashSaleItem, values: {
  registeredQuantity: number; discountPercent: number;
}): UpdateShopFlashSaleItemRequest {
  return {
    registeredQuantity: values.registeredQuantity,
    discountPercent: values.discountPercent === item.discountPercent ? null : values.discountPercent,
  };
}

// Không cho đăng ký từ đúng deadline trở đi, kể cả khi deadline thiếu hoặc sai định dạng.
export function isRegistrationDeadlineOpen(deadline: string | undefined, now: number = Date.now()): boolean {
  return !!deadline && Number.isFinite(Date.parse(deadline)) && now < Date.parse(deadline);
}
