import { FIRST_PAGE, TIME } from "@/lib/constants";
import type { ShopFlashSaleQuery, ShopFlashSaleItem, UpdateShopFlashSaleItemRequest } from "@/types/shop/flash-sale";

// Giữ các điều kiện lọc khi chuyển trang và mã hóa offset an toàn.
export function getShopFlashSalesUrl(query: ShopFlashSaleQuery) {
  const params = new URLSearchParams();
  if (query.page > FIRST_PAGE) params.set("page", String(query.page));
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.registrationOpen !== undefined) params.set("registrationOpen", String(query.registrationOpen));
  return `/shop/flash-sales${params.size ? `?${params}` : ""}`;
}

// Hiển thị thời lượng còn lại với độ chi tiết đến phút.
export function formatRegistrationRemaining(deadline: string, now: number) {
  const minutes = Math.ceil((new Date(deadline).getTime() - now) / TIME.MINUTE_MS);
  if (minutes <= 0) return "Đã đóng đăng ký";
  const days = Math.floor(minutes / TIME.MINUTES_PER_DAY);
  const hours = Math.floor(minutes % TIME.MINUTES_PER_DAY / TIME.MINUTES_PER_HOUR);
  return `Còn ${days ? `${days} ngày ` : ""}${days || hours ? `${hours} giờ ` : ""}${minutes % TIME.MINUTES_PER_HOUR} phút`;
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
