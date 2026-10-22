interface ChatHistoryLoadMoreViewProps {
  hasOlder: boolean;
  loading: boolean;
  error: string;
  onLoad: () => Promise<void>;
}

// Trạng thái tải tin cũ và thao tác dự phòng khi lịch sử chưa đủ chiều cao để cuộn.
export function ChatHistoryLoadMoreView({ hasOlder, loading, error, onLoad }: ChatHistoryLoadMoreViewProps) {
  if (!hasOlder && !loading && !error) return null;
  return (
    <div className="flex min-h-10 flex-col items-center justify-center gap-1 py-1 text-center text-xs">
      {loading ? (
        <span role="status" aria-label="Đang tải tin nhắn cũ" className="inline-flex items-center gap-1">
          <span aria-hidden="true" className="size-1.5 animate-[bounce_0.55s_infinite] rounded-full bg-primary [animation-delay:-0.3s] motion-reduce:animate-none" />
          <span aria-hidden="true" className="size-1.5 animate-[bounce_0.55s_infinite] rounded-full bg-primary [animation-delay:-0.15s] motion-reduce:animate-none" />
          <span aria-hidden="true" className="size-1.5 animate-[bounce_0.55s_infinite] rounded-full bg-primary motion-reduce:animate-none" />
        </span>
      ) : (
        <>
          {error && <p role="alert" className="text-danger">{error}</p>}
          <button type="button" onClick={() => { void onLoad(); }} className="min-h-8 cursor-pointer rounded px-3 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">{error ? "Thử lại" : "Tải tin nhắn cũ"}</button>
        </>
      )}
    </div>
  );
}

