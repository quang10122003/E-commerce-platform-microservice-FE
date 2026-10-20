import { MessageSquareText, MousePointer2, Sparkles } from "lucide-react";

// Giao diện vùng chờ khi chưa chọn khách hàng trên desktop.
export function ChatEmptyWorkspaceView() {
  return (
    // Khung giao diện trống căn giữa với chiều sâu thị giác và tông màu Slate nhẹ nhàng
    <div className="flex h-full min-h-0 flex-col items-center justify-center bg-slate-50/70 px-6 py-10 text-center select-none">
      {/* Khối biểu tượng trung tâm với vòng đổ màu Indigo tinh tế */}
      <div className="relative mb-6 flex size-20 items-center justify-center rounded-2xl border border-primary/20 bg-gradient-to-br from-indigo-50 via-primary/10 to-indigo-100/60 text-primary shadow-sm">
        <MessageSquareText className="size-9" aria-hidden="true" />
        <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-cta text-white shadow-xs">
          <Sparkles className="size-3" aria-hidden="true" />
        </span>
      </div>

      {/* Tiêu đề và mô tả hướng dẫn */}
      <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-800">
        Tiếp tục cuộc trò chuyện
      </h2>
      <p className="mt-2 max-w-xs text-xs sm:text-sm leading-relaxed text-slate-500">
        Chọn một khách hàng từ danh sách hộp thư bên trái để bắt đầu tư vấn và trao đổi sản phẩm.
      </p>

      {/* Nhãn hướng dẫn thao tác nổi */}
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 shadow-2xs">
        <MousePointer2 className="size-3.5 text-primary" aria-hidden="true" />
        <span>Chọn một hội thoại ở cột bên trái</span>
      </div>
    </div>
  );
}
