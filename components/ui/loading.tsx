import { LoaderCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type LoadingProps = {
  className?: string;
  label?: string;
};

// Hiển thị trạng thái đang tải dùng chung cho các khu vực trong ứng dụng.
export function Loading({
  className,
  label = "Đang tải dữ liệu...",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "flex min-h-56 flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-card",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Biểu tượng xoay thể hiện request đang được xử lý. */}
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-primary shadow-sm">
        <LoaderCircle className="h-7 w-7 animate-spin" aria-hidden="true" />
      </div>

      {/* Nhãn mô tả ngắn gọn trạng thái loading cho người dùng và trình đọc màn hình. */}
      <span className="text-sm font-semibold text-slate-600">{label}</span>
    </div>
  );
}
