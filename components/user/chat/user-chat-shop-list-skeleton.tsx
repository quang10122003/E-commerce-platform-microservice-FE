// Giữ cấu trúc avatar, tên shop và tin cuối trong lúc tải danh sách hội thoại.
export function UserChatShopListSkeleton() {
  return (
    <div role="status" className="divide-y divide-slate-100">
      <span className="sr-only">Đang tải hộp thư…</span>
      {[0, 1, 2, 3, 4].map((row) => (
        <div key={row} aria-hidden="true" className="flex gap-3 p-3.5">
          <div className="skeleton-shimmer size-11 shrink-0 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2 py-0.5">
            <div className="skeleton-shimmer h-3 w-2/3 rounded" />
            <div className="skeleton-shimmer h-3 w-full rounded" />
            <div className="skeleton-shimmer h-2 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
