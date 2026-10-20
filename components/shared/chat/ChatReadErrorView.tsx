interface ChatReadErrorViewProps {
  error: string;
  onRetry: () => void;
}

// Lỗi đánh dấu đã đọc không che lịch sử hoặc cản thao tác gửi tin.
export function ChatReadErrorView({ error, onRetry }: ChatReadErrorViewProps) {
  if (!error) return null;
  return (
    <div role="alert" className="shrink-0 border-b border-star/20 bg-star-light px-3 py-2 text-xs text-amber-900">
      <p>{error}</p>
      <button type="button" onClick={onRetry} className="mt-1 min-h-8 cursor-pointer font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-primary">Thử đánh dấu đã đọc lại</button>
    </div>
  );
}
