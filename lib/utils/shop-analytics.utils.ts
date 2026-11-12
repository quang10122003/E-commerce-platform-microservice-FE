import { parseOffsetDateTime, toLocalDateTimeInput, toOffsetDateTime } from "@/utils/date-time.utils";
import type { AnalyticsDailyPoint, ShopAnalyticsQuery } from "@/types/shop/analytics";

export const ANALYTICS_MAX_RANGE_DAYS = 366;
const DAY_MS = 86_400_000;

export const ANALYTICS_PRESETS = [
  { id: "today", label: "Hôm nay" },
  { id: "7d", label: "7 ngày" },
  { id: "30d", label: "30 ngày" },
  { id: "month", label: "Tháng này" },
] as const;

export type ShopAnalyticsPreset = (typeof ANALYTICS_PRESETS)[number]["id"];

// Chuẩn hóa searchParams của trang; thiếu hoặc sai mốc thì trả null để client tự đặt khoảng mặc định.
export function parseShopAnalyticsQuery(params: Record<string, string | string[] | undefined>): ShopAnalyticsQuery | null {
  const from = typeof params.from === "string" ? params.from.trim() : "";
  const to = typeof params.to === "string" ? params.to.trim() : "";
  const fromDate = parseOffsetDateTime(from);
  const toDate = parseOffsetDateTime(to);
  if (!fromDate || !toDate || fromDate > toDate) return null;
  if (toDate.getTime() - fromDate.getTime() >= ANALYTICS_MAX_RANGE_DAYS * DAY_MS) return null;
  return { from, to };
}

// Dựng query string dùng chung cho URL trang và request tới BE.
export function toShopAnalyticsSearchParams(query: ShopAnalyticsQuery): URLSearchParams {
  return new URLSearchParams({ from: query.from, to: query.to });
}

export function getShopAnalyticsUrl(query: ShopAnalyticsQuery): string {
  return `/shop/analytics?${toShopAnalyticsSearchParams(query)}`;
}

// Ghép hai ngày lịch của trình duyệt thành khoảng bao trọn ngày kèm offset; dùng phía client.
export function toAnalyticsQuery(fromDay: string, toDay: string): ShopAnalyticsQuery | null {
  const from = toOffsetDateTime(`${fromDay.slice(0, 10)}T00:00:00`);
  const to = toOffsetDateTime(`${toDay.slice(0, 10)}T23:59:59.999`);
  return from && to ? { from, to } : null;
}

// Khoảng ngày của từng lựa chọn nhanh theo lịch trình duyệt; dùng phía client.
export function getPresetQuery(preset: ShopAnalyticsPreset, now: Date): ShopAnalyticsQuery | null {
  const start = new Date(now);
  if (preset === "7d") start.setDate(start.getDate() - 6);
  if (preset === "30d") start.setDate(start.getDate() - 29);
  if (preset === "month") start.setDate(1);
  return toAnalyticsQuery(toLocalDateTimeInput(start.toISOString()), toLocalDateTimeInput(now.toISOString()));
}

// Kỳ theo lịch: month null nghĩa là cả năm.
export interface ShopAnalyticsPeriod {
  year: number;
  month: number | null;
}

// Trọn một tháng hoặc cả năm theo lịch trình duyệt; dùng phía client.
export function getPeriodQuery({ year, month }: ShopAnalyticsPeriod): ShopAnalyticsQuery | null {
  const pad = (value: number) => String(value).padStart(2, "0");
  const lastMonth = month ?? 12;
  // Ngày 0 của tháng kế tiếp là ngày cuối của tháng đang xét.
  const lastDay = new Date(year, lastMonth, 0).getDate();
  return toAnalyticsQuery(`${year}-${pad(month ?? 1)}-01`, `${year}-${pad(lastMonth)}-${pad(lastDay)}`);
}

// Nhận ra khoảng trên URL có đúng là trọn một tháng hoặc một năm không; dùng phía client.
export function getQueryPeriod(query: ShopAnalyticsQuery): ShopAnalyticsPeriod | null {
  const local = toLocalDateTimeInput(query.from);
  const year = Number(local.slice(0, 4));
  const matches = (period: ShopAnalyticsPeriod) => {
    const expected = getPeriodQuery(period);
    return expected?.from === query.from && expected.to === query.to ? period : null;
  };
  return matches({ year, month: null }) ?? matches({ year, month: Number(local.slice(5, 7)) });
}

// Khoảng dài hơn một quý thì gộp cột theo tháng của trình duyệt cho dễ đọc; dùng phía client.
export const ANALYTICS_MONTHLY_FROM_DAYS = 93;

export function groupTimelineByMonth(timeline: AnalyticsDailyPoint[]): AnalyticsDailyPoint[] {
  const months = new Map<string, AnalyticsDailyPoint>();
  for (const point of timeline) {
    const date = new Date(point.bucketStart);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const total = months.get(key);
    if (!total) {
      months.set(key, { ...point });
      continue;
    }
    total.placedOrders += point.placedOrders;
    total.placedAmount += point.placedAmount;
    total.receivedAmount += point.receivedAmount;
    total.paidOnlineAmount += point.paidOnlineAmount;
    total.cancelledAmount += point.cancelledAmount;
  }
  return [...months.values()];
}

// Phần trăm thay đổi so với kỳ trước; kỳ trước bằng 0 thì không có mốc để so.
export function percentChange(current: number, previous: number): number | null {
  return previous === 0 ? null : ((current - previous) / previous) * 100;
}

export function formatMinutes(minutes: number | null): string {
  if (minutes === null) return "—";
  if (minutes < 60) return `${minutes} phút`;
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)} giờ`;
  return `${(minutes / 1440).toFixed(1)} ngày`;
}

// Rút gọn số tiền cho trục biểu đồ.
export function formatCompactAmount(value: number): string {
  return new Intl.NumberFormat("vi-VN", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}
