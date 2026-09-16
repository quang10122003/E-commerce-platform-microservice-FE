import {
  AlertCircle,
  CheckCircle2,
  Info,
  LoaderCircle,
  TriangleAlert,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

import type {
  NotificationAction,
  NotificationVariant,
} from "@/hooks/useNotification";

type NotificationToastProps = {
  title: string;
  description?: string;
  variant: NotificationVariant;
  action?: NotificationAction;
  dismissible?: boolean;
  onDismiss: () => void;
};

const notificationStyles = {
  success: {
    label: "Thành công",
    container: "border-emerald-200/90",
    accent: "from-emerald-400 via-teal-500 to-cyan-500",
    icon: "bg-emerald-50 text-emerald-600 ring-emerald-100/80",
    badge: "bg-emerald-50 text-emerald-700",
    action: "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500/30",
    Icon: CheckCircle2,
  },
  info: {
    label: "Thông tin",
    container: "border-indigo-200/90",
    accent: "from-indigo-400 via-violet-500 to-fuchsia-500",
    icon: "bg-indigo-50 text-indigo-600 ring-indigo-100/80",
    badge: "bg-indigo-50 text-indigo-700",
    action: "bg-primary hover:bg-primary-hover focus-visible:ring-primary/30",
    Icon: Info,
  },
  warning: {
    label: "Cảnh báo",
    container: "border-amber-200/90",
    accent: "from-amber-400 via-orange-500 to-rose-500",
    icon: "bg-amber-50 text-amber-600 ring-amber-100/80",
    badge: "bg-amber-50 text-amber-700",
    action: "bg-amber-500 hover:bg-amber-600 focus-visible:ring-amber-500/30",
    Icon: TriangleAlert,
  },
  error: {
    label: "Có lỗi xảy ra",
    container: "border-rose-200/90",
    accent: "from-rose-400 via-red-500 to-orange-500",
    icon: "bg-rose-50 text-rose-600 ring-rose-100/80",
    badge: "bg-rose-50 text-rose-700",
    action: "bg-rose-600 hover:bg-rose-700 focus-visible:ring-rose-500/30",
    Icon: AlertCircle,
  },
  loading: {
    label: "Đang xử lý",
    container: "border-sky-200/90",
    accent: "from-sky-400 via-indigo-500 to-violet-500",
    icon: "bg-sky-50 text-sky-600 ring-sky-100/80",
    badge: "bg-sky-50 text-sky-700",
    action: "bg-sky-600 hover:bg-sky-700 focus-visible:ring-sky-500/30",
    Icon: LoaderCircle,
  },
};

// Hiển thị thẻ thông báo có trạng thái, nội dung và hành động tùy chọn với typography thanh lịch.
export function NotificationToast({
  title,
  description,
  variant,
  action,
  dismissible = true,
  onDismiss,
}: NotificationToastProps) {
  const styles = notificationStyles[variant];
  const Icon = styles.Icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={cn(
        "group relative isolate flex w-[calc(100vw-32px)] overflow-hidden rounded-2xl border bg-white/95 p-3.5 sm:p-4 shadow-3d backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-3d-hover sm:w-[380px]",
        styles.container,
        dismissible && "pr-10"
      )}
    >
      {/* Vệt màu trên đỉnh giúp nhận diện nhanh trạng thái thông báo. */}
      <div className={cn("absolute inset-x-0 top-0 h-[2.5px] bg-gradient-to-r", styles.accent)} />

      {/* Quầng sáng mờ nền tạo chiều sâu thị giác. */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-40 blur-2xl",
          styles.icon.split(" ")[0]
        )}
      />

      {/* Biểu tượng trạng thái nổi bật với vòng viền tương phản. */}
      <div className={cn("relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-2 shadow-2xs", styles.icon)}>
        <Icon
          className={`h-4.5 w-4.5 ${variant === "loading" ? "animate-spin" : ""}`}
          strokeWidth={2.2}
        />
      </div>

      {/* Nội dung chính: badge trạng thái, tiêu đề font-heading và mô tả font-sans rõ ràng. */}
      <div className="relative min-w-0 flex-1 pl-3">
        <div className="flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold font-heading uppercase tracking-wider", styles.badge)}>
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            {styles.label}
          </span>
        </div>

        <h4 className="mt-1 text-[13.5px] font-bold font-heading leading-snug tracking-tight text-slate-900">
          {title}
        </h4>

        {description && (
          <p className="mt-0.5 text-[12px] font-normal leading-relaxed text-slate-500 font-sans">
            {description}
          </p>
        )}

        {/* Nút hành động bổ sung nếu có. */}
        {action && (
          <button
            type="button"
            onClick={action.onClick}
            className={cn(
              "mt-2.5 inline-flex items-center rounded-lg px-3 py-1 text-xs font-bold font-heading text-white shadow-xs transition active:scale-95 focus-visible:outline-none focus-visible:ring-2",
              styles.action
            )}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Nút đóng thông báo. */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Đóng thông báo"
          className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
