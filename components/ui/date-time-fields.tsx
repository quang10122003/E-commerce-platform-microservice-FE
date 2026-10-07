"use client";

import { ISO_DATE_LENGTH, TIME } from "@/lib/constants";

import { CalendarDays, ChevronDown, Clock3 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useDateTimeFields } from "@/hooks/shared/useDateTimeFields";
import { useMounted } from "@/lib/hooks";
import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";

type DateTimeFieldsProps = { id: string; name: string; label: string; value: string; disabled?: boolean; onChange: (value: string) => void; onConfirm?: () => void; min?: string; max?: string };

// Chọn ngày bằng lịch inline và chọn giờ trong panel, không mở popup native.
export function DateTimeFields({ id, name, label, value, disabled, onChange, onConfirm, min, max }: DateTimeFieldsProps) {
  const { isTimeDisabled, isOpen, toggle, confirm, selected, time, selectDate, changeTime, clear } = useDateTimeFields(value, onChange, onConfirm, min, max);
  const mounted = useMounted();
  return (
    <fieldset disabled={disabled} className="min-w-0 space-y-2">
      <legend className="text-xs font-semibold text-muted-foreground">{label}</legend>
      <input type="hidden" name={name} value={value} />
      {/* Ô tóm tắt mở lịch ngay bên dưới, giữ toàn bộ nội dung trong panel. */}
      <button type="button" onClick={toggle} aria-label={`Chọn ${label.toLowerCase()}`} aria-expanded={isOpen} aria-controls={`${id}-calendar`} className="flex min-h-10.5 w-full items-center gap-2 rounded-lg border border-surface-border bg-surface-card px-3 text-left text-sm transition hover:border-primary disabled:opacity-50">
        <CalendarDays className="size-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 text-main">{mounted && value ? `${formatSellerProductDate(value)} · ${time}` : "Chọn ngày và giờ"}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
      </button>
      {isOpen && mounted && (
        <div id={`${id}-calendar`} className="min-w-0 space-y-3 rounded-lg border border-surface-border bg-surface-card p-2.5">
          {/* Calendar hỗ trợ chọn ngày và điều hướng bằng bàn phím. */}
          <Calendar mode="single" selected={selected} defaultMonth={selected} onSelect={selectDate} disabled={disabled ? true : [ ...(min ? [{ before: new Date(`${min.slice(0, ISO_DATE_LENGTH)}T00:00`) }] : []), ...(max ? [{ after: new Date(`${max.slice(0, ISO_DATE_LENGTH)}T00:00`) }] : []) ]} />
          {/* Giờ và phút được ghép với ngày địa phương trước khi chuyển offset. */}
          <div className="flex items-center gap-2 border-t border-surface-border pt-3">
            <Clock3 className="size-4 shrink-0 text-primary" />
            {(["hour", "minute"] as const).map((field) => (
              <div key={field} className="min-w-0 flex-1 space-y-1">
                <label htmlFor={`${id}-${field}`} className="text-xs text-muted-foreground">{field === "hour" ? "Giờ" : "Phút"}</label>
                <select id={`${id}-${field}`} value={time.split(":")[field === "hour" ? 0 : 1]} disabled={!value || disabled} onChange={(event) => changeTime(field, event.target.value)} className="h-9 w-full rounded-md border border-surface-border bg-surface-card px-2 text-sm text-main focus-visible:ring-2 focus-visible:ring-primary">
                  {Array.from({ length: field === "hour" ? TIME.HOURS_PER_DAY : TIME.MINUTES_PER_HOUR }, (_, index) => String(index).padStart(2, "0")).map((option) => <option key={option} value={option} disabled={isTimeDisabled(field, option)}>{option}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-between gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={clear} className="rounded-lg text-muted-foreground shadow-none">Xóa</Button>
            <Button type="button" variant="primary" size="sm" onClick={confirm} className="rounded-lg shadow-none hover:shadow-none">Xong</Button>
          </div>
        </div>
      )}
    </fieldset>
  );
}
