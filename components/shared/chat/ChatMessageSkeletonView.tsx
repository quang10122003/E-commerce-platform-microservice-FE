// Mô phỏng vị trí bong bóng tin nhắn, dùng shimmer và reduced-motion sẵn có của dự án.
export function ChatMessageSkeletonView() {
  return (
    <div role="status" className="space-y-3.5">
      <span className="sr-only">Đang tải tin nhắn…</span>
      <div aria-hidden="true" className="flex flex-col gap-3.5">
        {["w-3/5 self-start", "w-1/2 self-end", "w-2/3 self-start", "w-2/5 self-end", "w-1/2 self-start"].map((layout, index) => (
          <div key={index} className={`max-w-[75%] ${layout}`}>
            <div className="skeleton-shimmer h-12 rounded-2xl motion-reduce:after:animate-none" />
            <div className={`skeleton-shimmer mt-1 h-2 w-8 rounded motion-reduce:after:animate-none ${index % 2 ? "ml-auto" : ""}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
