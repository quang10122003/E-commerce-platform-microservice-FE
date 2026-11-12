"use client";

import { CalendarRange, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { DateRangeField } from "@/components/ui/date-range-field";
import { useShopAnalyticsFilter } from "@/hooks/shop/analytics/useShopAnalyticsFilter";
import { ANALYTICS_PRESETS } from "@/lib/utils/shop-analytics.utils";
import type { ShopAnalyticsQuery } from "@/types/shop/analytics";

const SELECT_CLASS = "h-10 min-w-0 flex-1 cursor-pointer rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 text-xs text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-wait";
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);

// Chọn nhanh, chọn theo tháng/năm hoặc chọn khoảng ngày thống kê theo lịch của trình duyệt.
export function AnalyticsRangeFilter({ query }: { query: ShopAnalyticsQuery | null }) {
  const filter = useShopAnalyticsFilter(query);

  // Cùng một bộ điều khiển cho desktop (hiện sẵn) và menu trên màn hình nhỏ.
  const controls = (idPrefix: string) => (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Chọn nhanh khoảng thời gian">
        {ANALYTICS_PRESETS.map((preset) => {
          const active = filter.activePreset === preset.id;
          return (
            <button key={preset.id} type="button" onClick={() => filter.applyPreset(preset.id)} aria-pressed={active} disabled={filter.isPending}
              className={`h-9 cursor-pointer rounded-lg border px-3 text-xs font-semibold transition-colors active:scale-95 disabled:cursor-wait ${active ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:border-primary hover:text-primary"}`}>
              {preset.label}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 lg:w-56">
        <select aria-label="Chọn tháng thống kê" disabled={filter.isPending} className={SELECT_CLASS}
          value={filter.period ? String(filter.period.month ?? "all") : ""}
          onChange={(event) => filter.applyMonth(event.target.value === "all" ? null : Number(event.target.value))}>
          <option value="" disabled>Tháng</option>
          <option value="all">Cả năm</option>
          {MONTHS.map((month) => <option key={month} value={month}>Tháng {month}</option>)}
        </select>
        <select aria-label="Chọn năm thống kê" disabled={filter.isPending} className={SELECT_CLASS}
          value={filter.period ? String(filter.period.year) : ""}
          onChange={(event) => filter.applyYear(Number(event.target.value))}>
          <option value="" disabled>Năm</option>
          {filter.years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
      </div>

      <div className="flex min-w-0 items-center gap-2 lg:ml-auto">
        <div className="min-w-0 flex-1 lg:w-60 lg:flex-none">
          <DateRangeField id={`${idPrefix}-date-range`} label="Chọn khoảng ngày thống kê" fromDate={filter.fromDate} toDate={filter.toDate}
            onFromDateChange={filter.setFromDate} onToDateChange={filter.setToDate} />
        </div>
        <Button type="button" variant="primary" size="sm" onClick={filter.applyDateRange} disabled={filter.isPending} className="h-10 shrink-0 rounded-lg px-4 text-xs font-semibold shadow-none">
          {filter.isPending && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />} Áp dụng
        </Button>
      </div>
      {filter.dateError && <p role="alert" className="text-xs text-danger-hover lg:w-full">{filter.dateError}</p>}
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
      {/* Tablet và điện thoại: hiện khoảng đang xem, bộ lọc mở từ nút biểu tượng. */}
      <div className="flex items-center gap-2 lg:hidden">
        <p className="flex min-w-0 flex-1 items-center gap-2 text-xs font-semibold text-slate-700">
          <CalendarRange className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="truncate">{filter.rangeLabel || "Đang chọn khoảng thời gian..."}</span>
          {filter.isPending && <Loader2 className="size-3.5 shrink-0 animate-spin text-primary" aria-hidden="true" />}
        </p>
        <details className="group relative shrink-0">
          <summary aria-label="Mở bộ lọc thời gian" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary group-open:border-primary group-open:bg-primary-light [&::-webkit-details-marker]:hidden">
            <Filter className="size-4 text-cta" aria-hidden="true" />
          </summary>
          <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-3rem)] rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
            <p className="mb-3 text-sm font-semibold text-slate-800">Bộ lọc thời gian</p>
            {controls("shop-analytics-mobile")}
          </div>
        </details>
      </div>

      <div className="hidden lg:block">{controls("shop-analytics-desktop")}</div>
    </div>
  );
}
