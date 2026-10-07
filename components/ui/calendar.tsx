"use client";

import { DayPicker, getDefaultClassNames, type DayPickerProps } from "react-day-picker";
import { vi } from "react-day-picker/locale";
import { cn } from "@/lib/utils";

// Calendar theo nền tảng shadcn/ui, dùng token dự án và bố cục co theo container.
export function Calendar({ className, classNames, ...props }: DayPickerProps) {
  const defaults = getDefaultClassNames();
  return (
    <DayPicker locale={vi} weekStartsOn={1} showOutsideDays className={cn("w-full text-sm text-main", className)}
      classNames={{
        root: cn(defaults.root, "relative w-full"),
        months: "w-full",
        month: "w-full space-y-3",
        month_caption: "flex h-9 items-center justify-center px-9 font-semibold",
        caption_label: "text-sm capitalize",
        nav: "absolute inset-x-0 top-0 flex justify-between",
        button_previous: "flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-surface-subtle",
        button_next: "flex size-9 items-center justify-center rounded-lg border border-surface-border hover:bg-surface-subtle",
        chevron: "size-4 fill-primary",
        month_grid: "w-full table-fixed border-collapse",
        weekday: "h-8 text-center text-[10px] font-medium text-muted-foreground",
        day: "p-0.5 text-center",
        day_button: "flex aspect-square w-full items-center justify-center rounded-md text-xs transition hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        selected: "[&_button]:bg-primary [&_button]:text-white [&_button]:hover:bg-primary-hover",
        today: "[&_button]:ring-1 [&_button]:ring-primary",
        outside: "text-placeholder opacity-50",
        disabled: "opacity-30",
        hidden: "invisible",
        ...classNames,
      }} {...props} />
  );
}
