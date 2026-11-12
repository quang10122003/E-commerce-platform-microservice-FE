"use client";

import { useEffect, useRef } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import type { DateRange } from "react-day-picker";

type DateRangeFieldProps = {
  id: string;
  label: string;
  fromDate: string;
  toDate: string;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  disabled?: boolean;
};

// Chuyển ngày theo lịch địa phương sang giá trị datetime-local.
function formatLocalDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// Chọn một khoảng ngày trong cùng một lịch và phát ra hai mốc bao trọn ngày.
export function DateRangeField({ id, label, fromDate, toDate, onFromDateChange, onToDateChange, disabled }: DateRangeFieldProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const selected: DateRange = {
    from: fromDate ? new Date(`${fromDate.slice(0, 10)}T00:00`) : undefined,
    to: toDate ? new Date(`${toDate.slice(0, 10)}T00:00`) : undefined,
  };
  const dateLabel = fromDate || toDate
    ? `${fromDate ? new Date(`${fromDate.slice(0, 10)}T00:00`).toLocaleDateString("vi-VN") : "..."} – ${toDate ? new Date(`${toDate.slice(0, 10)}T00:00`).toLocaleDateString("vi-VN") : "..."}`
    : "Chọn khoảng ngày";

  // Cập nhật cặp mốc ngày; bộ lọc cha quyết định thời điểm gửi truy vấn.
  const selectRange = (range: DateRange | undefined) => {
    onFromDateChange(range?.from ? `${formatLocalDate(range.from)}T00:00` : "");
    onToDateChange(range?.to ? `${formatLocalDate(range.to)}T23:59` : "");
  };

  // Đóng lịch khi thao tác bên ngoài vùng chọn ngày.
  useEffect(() => {
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!detailsRef.current?.contains(event.target as Node)) detailsRef.current?.removeAttribute("open");
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointer);
  }, []);

  return (
    <div className="relative min-w-0">
      <input type="hidden" name="from" value={fromDate} />
      <input type="hidden" name="to" value={toDate} />
      <details ref={detailsRef} id={id} className="group relative min-w-0">
        <summary aria-label={label} aria-disabled={disabled} className={`flex min-h-10 w-full cursor-pointer list-none items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 text-left text-sm text-main transition hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary [&::-webkit-details-marker]:hidden ${disabled ? "pointer-events-none opacity-50" : ""}`}>
          <CalendarDays className="size-4 shrink-0 text-primary" aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{dateLabel}</span>
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </summary>
        <div className="absolute left-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-3rem)] rounded-lg border border-surface-border bg-surface-card p-3 shadow-lg sm:left-auto sm:right-0">
          <Calendar mode="range" selected={selected} onSelect={selectRange} disabled={disabled} defaultMonth={selected.from} />
        </div>
      </details>
    </div>
  );
}
