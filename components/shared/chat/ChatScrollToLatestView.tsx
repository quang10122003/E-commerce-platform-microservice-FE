import { ArrowDown } from "lucide-react";

interface ChatScrollToLatestViewProps {
  visible: boolean;
  onClick: () => void;
}

// Nút nổi nằm ngoài vùng cuộn, không chiếm diện tích hoặc kéo theo bố cục lịch sử.
export function ChatScrollToLatestView({ visible, onClick }: ChatScrollToLatestViewProps) {
  if (!visible) return null;
  return (
    <button type="button" onClick={onClick} aria-label="Đến tin nhắn mới nhất" title="Có tin nhắn mới · Xuống cuối cuộc trò chuyện" className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 inline-flex h-10 items-center gap-1.5 rounded-full border border-primary/20 bg-surface-card/95 px-3 text-[11px] font-semibold text-primary shadow-sm backdrop-blur-sm transition-colors hover:bg-primary-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary cursor-pointer">
      <ArrowDown aria-hidden="true" className="size-4" />
      <span>Tin nhắn mới</span>
    </button>
  );
}

