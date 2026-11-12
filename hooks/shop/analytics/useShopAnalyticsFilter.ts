"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMounted } from "@/lib/hooks";
import {
  ANALYTICS_MAX_RANGE_DAYS, ANALYTICS_PRESETS, getPeriodQuery, getPresetQuery, getQueryPeriod, getShopAnalyticsUrl,
  parseShopAnalyticsQuery, toAnalyticsQuery, type ShopAnalyticsPeriod, type ShopAnalyticsPreset,
} from "@/lib/utils/shop-analytics.utils";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import type { ShopAnalyticsQuery } from "@/types/shop/analytics";

const DEFAULT_PRESET: ShopAnalyticsPreset = "30d";
// Số năm gần nhất cho chọn trong bộ lọc theo năm.
const YEAR_OPTIONS = 6;

// Khoảng thời gian đi qua URL để Server Component gọi lại BE; ngày, tháng, năm tính theo lịch của trình duyệt.
export function useShopAnalyticsFilter(query: ShopAnalyticsQuery | null) {
  const router = useRouter();
  const mounted = useMounted();
  const [isPending, startTransition] = useTransition();
  // Hai mốc đang chọn trong lịch, chưa áp dụng.
  const [fromDate, setFromDate] = useState(() => toLocalDateTimeInput(query?.from));
  const [toDate, setToDate] = useState(() => toLocalDateTimeInput(query?.to));
  const [dateError, setDateError] = useState("");

  // Server không biết múi giờ trình duyệt nên khoảng mặc định được đặt ở client.
  useEffect(() => {
    if (query) return;
    const fallback = getPresetQuery(DEFAULT_PRESET, new Date());
    if (fallback) router.replace(getShopAnalyticsUrl(fallback), { scroll: false });
  }, [query, router]);

  const navigate = (next: ShopAnalyticsQuery | null) => {
    if (!next) return;
    setDateError("");
    setFromDate(toLocalDateTimeInput(next.from));
    setToDate(toLocalDateTimeInput(next.to));
    startTransition(() => router.push(getShopAnalyticsUrl(next), { scroll: false }));
  };

  const applyPreset = (preset: ShopAnalyticsPreset) => navigate(getPresetQuery(preset, new Date()));

  // Kỳ theo lịch đang khớp với URL; chỉ tính sau khi mount vì phụ thuộc giờ trình duyệt.
  const period = mounted && query ? getQueryPeriod(query) : null;
  const currentYear = new Date().getFullYear();

  // Đổi năm giữ nguyên tháng đang xem; đổi tháng khi chưa chọn năm thì lấy năm hiện tại.
  const applyYear = (year: number) => navigate(getPeriodQuery({ year, month: period?.month ?? null }));
  const applyMonth = (month: number | null) => navigate(getPeriodQuery({ year: period?.year ?? currentYear, month }));

  const applyDateRange = () => {
    const next = fromDate && toDate ? toAnalyticsQuery(fromDate, toDate) : null;
    if (!next) {
      setDateError("Hãy chọn đủ ngày bắt đầu và ngày kết thúc.");
      return;
    }
    if (!parseShopAnalyticsQuery({ ...next })) {
      setDateError(`Khoảng thời gian thống kê tối đa ${ANALYTICS_MAX_RANGE_DAYS} ngày.`);
      return;
    }
    navigate(next);
  };

  const activePreset = mounted && query
    ? ANALYTICS_PRESETS.find(({ id }) => {
        const preset = getPresetQuery(id, new Date());
        return preset?.from === query.from && preset.to === query.to;
      })?.id ?? null
    : null;

  const years = mounted ? Array.from({ length: YEAR_OPTIONS }, (_, index) => currentYear - index) : [];
  // Năm trên URL nằm ngoài danh sách vẫn phải hiện để ô chọn không bị trống.
  if (period && !years.includes(period.year)) years.push(period.year);

  const formatDay = (value: string) => new Date(value).toLocaleDateString("vi-VN");

  return {
    fromDate: mounted ? fromDate : "", toDate: mounted ? toDate : "", setFromDate, setToDate,
    dateError, applyPreset, applyDateRange, activePreset, isPending,
    period: period as ShopAnalyticsPeriod | null, years, applyYear, applyMonth,
    rangeLabel: mounted && query ? `${formatDay(query.from)} – ${formatDay(query.to)}` : "",
  };
}
