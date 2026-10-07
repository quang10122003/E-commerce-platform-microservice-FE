import { FIRST_PAGE, TIME } from "@/lib/constants";
import type { ShopFlashSaleQuery } from "@/types/shop/flash-sale";

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
