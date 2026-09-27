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
        "flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 p-8 text-center shadow-card",
        className,
      )}
      role="status"
      aria-live="polite"
    >
      {/* Ba chấm nhảy thể hiện dữ liệu đang được tải. */}
      <span className="flex h-8 items-center gap-2" aria-hidden="true">
        <span className="h-3 w-3 animate-[bounce_0.55s_infinite] rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-3 w-3 animate-[bounce_0.55s_infinite] rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-3 w-3 animate-[bounce_0.55s_infinite] rounded-full bg-primary" />
      </span>

      {/* Nhãn mô tả ngắn gọn trạng thái loading cho người dùng và trình đọc màn hình. */}
      <span className="text-sm font-semibold text-slate-600">{label}</span>
    </div>
  );
}
