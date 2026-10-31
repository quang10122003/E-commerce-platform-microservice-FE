"use client";

import { Calendar } from "lucide-react";
import { DateTimeFields } from "@/components/ui/date-time-fields";
import { ShopFlashSaleHistorySearch } from "./shop-flash-sale-history-search";

interface ShopFlashSaleHistoryFiltersProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  fromDate: string;
  onFromDateChange: (val: string) => void;
  toDate: string;
  onToDateChange: (val: string) => void;
  quickFilter: string;
  onQuickFilterSelect: (preset: string) => void;
  idPrefix?: string;
  inDrawer?: boolean;
  onDatesConfirmed?: () => void;
  error?: string;
}

// Bộ lọc tìm kiếm chiến dịch Flash Sale lịch sử theo từ khóa và khoảng thời gian.
export function ShopFlashSaleHistoryFilters({
  keyword,
  onKeywordChange,
  fromDate,
  onFromDateChange,
  toDate,
  onToDateChange,
  quickFilter,
  onQuickFilterSelect,
  idPrefix = "history",
  inDrawer = false,
  onDatesConfirmed,
  error,
}: ShopFlashSaleHistoryFiltersProps) {
  return (
    <div className={inDrawer ? "space-y-3.5" : "rounded-xl border border-surface-border bg-white p-4 sm:p-5 shadow-2xs space-y-3.5"}>
      {/* Hàng điều khiển tìm kiếm từ khóa và khoảng ngày */}
      <div className={inDrawer ? "grid gap-3.5" : "grid gap-3.5 sm:grid-cols-2 lg:grid-cols-12"}>
        {/* Ô nhập từ khóa tìm kiếm theo tên hoặc mã chiến dịch */}
        {!inDrawer && <div className="lg:col-span-6">
          <ShopFlashSaleHistorySearch id={`${idPrefix}-search-keyword`} keyword={keyword} onKeywordChange={onKeywordChange} />
        </div>}

        {/* Ô chọn mốc thời gian bắt đầu */}
        <div className="lg:col-span-3">
          <DateTimeFields
            id={`${idPrefix}-filter-from`}
            name="from"
            label="Bắt đầu từ"
            value={fromDate}
            onChange={onFromDateChange}
            onConfirm={onDatesConfirmed}
          />
        </div>

        {/* Ô chọn mốc thời gian kết thúc */}
        <div className="lg:col-span-3">
          <DateTimeFields
            id={`${idPrefix}-filter-to`}
            name="to"
            label="Đến thời điểm"
            value={toDate}
            onChange={onToDateChange}
            onConfirm={onDatesConfirmed}
          />
        </div>

      </div>

      {/* Hàng bộ lọc nhanh theo mốc thời gian phổ biến */}
      <div className="flex flex-wrap items-center justify-start gap-2.5 pt-3 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-sm font-medium text-muted-foreground mr-1 flex items-center gap-1">
            <Calendar className="size-3.5 text-slate-400" aria-hidden="true" /> Lọc nhanh:
          </span>
          {[
            { id: "all", label: "Tất cả" },
            { id: "7d", label: "7 ngày qua" },
            { id: "30d", label: "30 ngày qua" },
            { id: "this_month", label: "Tháng này" },
          ].map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onQuickFilterSelect(preset.id)}
              className={`rounded-lg px-2.5 py-1 text-sm font-medium transition ${
                quickFilter === preset.id
                  ? "bg-primary text-white shadow-xs font-semibold"
                  : "bg-surface-subtle border border-surface-border text-slate-600 hover:bg-slate-100"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>

      </div>
      {error && <p role="alert" className="text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
