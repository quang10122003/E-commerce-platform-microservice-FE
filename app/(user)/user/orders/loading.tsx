// Hiển thị trạng thái chờ trong lúc Server Component tải đơn hàng.
export default function OrdersLoading() {
  return (
    <div className="w-full space-y-5" role="status" aria-label="Đang tải đơn hàng">
      {/* Thanh tổng đơn và tìm kiếm */}
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/90 bg-white p-1.5">
        <div className="skeleton-shimmer h-9.5 w-36 rounded-xl" />
        <div className="skeleton-shimmer hidden h-9.5 w-80 rounded-xl sm:block" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="skeleton-shimmer h-9 w-28 shrink-0 rounded-xl" />
        ))}
      </div>

      {/* Order Cards Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
            {/* Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="skeleton-shimmer size-7 rounded-lg" />
                <div className="skeleton-shimmer h-4 w-36 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-6 w-24 rounded-full" />
            </div>

            {/* Card Body */}
            <div className="flex gap-4 p-5">
              <div className="skeleton-shimmer size-16 sm:size-20 shrink-0 rounded-xl" />
              <div className="flex flex-1 flex-col justify-center gap-2">
                <div className="skeleton-shimmer h-4 w-3/4 rounded-md" />
                <div className="skeleton-shimmer h-3.5 w-1/3 rounded-md" />
              </div>
              <div className="skeleton-shimmer h-5 w-20 rounded-md" />
            </div>

            {/* Card Footer */}
            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
              <div className="skeleton-shimmer h-4 w-40 rounded-md" />
              <div className="flex items-center gap-3">
                <div className="skeleton-shimmer h-5 w-28 rounded-md" />
                <div className="skeleton-shimmer h-9 w-24 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <span className="sr-only">Đang tải đơn hàng...</span>
    </div>
  );
}
