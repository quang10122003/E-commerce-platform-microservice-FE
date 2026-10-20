import { AlertCircle, Check, Loader2, RefreshCw, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ShopChatUiState } from "@/types/shop/chat";

// Nội dung thông báo tương ứng với từng trạng thái kết nối realtime và đồng bộ tin nhắn.
const stateContent = {
  idle: { label: "Chưa chọn hội thoại", title: "", description: "", tone: "muted", icon: Wifi },
  loading: { label: "Đang tải", title: "Đang tải hội thoại", description: "Đang lấy lịch sử tin nhắn của khách hàng.", tone: "primary", icon: Loader2 },
  connecting: { label: "Đang kết nối", title: "Đang kết nối realtime", description: "Bạn có thể soạn tin. Tin chờ sẽ được gửi sau khi kết nối và đồng bộ xong.", tone: "primary", icon: Loader2 },
  reconnecting: { label: "Mất kết nối", title: "Mất kết nối realtime", description: "Bạn vẫn có thể thêm tin vào hàng đợi. Hệ thống đang tự kết nối lại; tin sẽ được gửi lần lượt sau khi đồng bộ.", tone: "warning", icon: WifiOff },
  syncing: { label: "Đang đồng bộ", title: "Đang đồng bộ tin nhắn", description: "Đã kết nối. Đang tải bù lịch sử trước khi tiếp tục gửi các tin đang chờ.", tone: "primary", icon: RefreshCw },
  "history-error": { label: "Lỗi đồng bộ", title: "Chưa tải được lịch sử", description: "Tin đang chờ chưa được gửi. Tải lại lịch sử để tiếp tục đồng bộ an toàn.", tone: "danger", icon: AlertCircle },
  "send-error": { label: "Có tin lỗi", title: "Hàng đợi đang tạm dừng", description: "Có tin chưa được xác nhận. Chọn Gửi lại ở tin lỗi; các tin phía sau sẽ tiếp tục theo thứ tự.", tone: "warning", icon: AlertCircle },
  "message-error": { label: "Lỗi cập nhật", title: "Chưa cập nhật được tin nhắn", description: "Tải lại lịch sử để kiểm tra các tin mới nhất trong hội thoại.", tone: "danger", icon: AlertCircle },
  connected: { label: "Đã kết nối", title: "", description: "", tone: "success", icon: Check },
} as const;

// Nhóm class màu viền, nền và chữ theo cấp độ cảnh báo
const toneClasses = {
  muted: "border-slate-200 bg-slate-50 text-slate-700",
  primary: "border-indigo-200 bg-indigo-50/90 text-indigo-900",
  warning: "border-amber-200/90 bg-amber-50/90 text-amber-900",
  danger: "border-rose-200/90 bg-rose-50/90 text-rose-900",
  success: "border-emerald-200/90 bg-emerald-50/90 text-emerald-900",
};

// Nhóm class màu nền icon tương ứng từng mức cảnh báo
const toneIconClasses = {
  muted: "bg-slate-200/80 text-slate-600",
  primary: "bg-indigo-100 text-primary",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  success: "bg-emerald-100 text-emerald-700",
};

interface ShopChatConnectionStateProps {
  state: ShopChatUiState;
  error?: string;
  refreshing?: boolean;
  onReload?: () => void;
}

// Banner thông báo trạng thái kết nối realtime và khôi phục sự cố tin nhắn.
export function ShopChatConnectionNoticeView({ state, error, refreshing, onReload }: ShopChatConnectionStateProps) {
  // Chỉ hiển thị banner khi cần cảnh báo hoặc thao tác khôi phục
  if (state === "idle" || state === "connected" || state === "loading" || state === "syncing" || state === "connecting") {
    return null;
  }

  const content = stateContent[state];
  const Icon = content.icon;
  const retryHistory = state === "history-error" || state === "message-error";

  return (
    // Dải thông báo với viền mảnh và màu sắc tương phản rõ ràng
    <div
      role={retryHistory ? "alert" : "status"}
      className={cn(
        "flex shrink-0 items-start gap-3 border-b px-4 py-2.5 transition-colors sm:px-5",
        toneClasses[content.tone]
      )}
    >
      {/* Icon trạng thái trong badge bo góc */}
      <div className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md shadow-2xs", toneIconClasses[content.tone])}>
        <Icon aria-hidden="true" className={cn("size-3.5", (state === "loading" || state === "syncing") && "animate-spin motion-reduce:animate-none")} />
      </div>

      {/* Nội dung chi tiết lỗi hoặc trạng thái */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold leading-5">{content.title}</p>
        <p className="mt-0.5 max-w-prose text-[11px] leading-4 opacity-90">{content.description}</p>
        
        {/* Chi tiết thông báo lỗi từ server nếu có */}
        {retryHistory && error && (
          <p className="mt-1 break-words font-mono text-[11px] leading-4 opacity-80 [overflow-wrap:anywhere]">
            {error}
          </p>
        )}

        {/* Nút thao tác tải lại lịch sử tin nhắn */}
        {retryHistory && onReload && (
          <button
            type="button"
            onClick={onReload}
            disabled={refreshing}
            className="mt-2 inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 shadow-2xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <RefreshCw
              aria-hidden="true"
              className={cn("size-3 text-primary", refreshing && "animate-spin motion-reduce:animate-none")}
            />
            <span>Tải lại lịch sử</span>
          </button>
        )}
      </div>
    </div>
  );
}
