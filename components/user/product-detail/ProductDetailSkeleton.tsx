// Giữ bố cục trang sản phẩm khi tải, dùng hiệu ứng shimmer và token sẵn có.
export function ProductDetailSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label="Đang tải chi tiết sản phẩm">
      <span className="sr-only">Đang tải chi tiết sản phẩm…</span>

      {/* Khung ảnh và thông tin sản phẩm tương ứng bố cục mobile, tablet và desktop. */}
      <div className="overflow-hidden rounded-xl border border-surface-border bg-surface-card" aria-hidden="true">
        <div className="grid grid-cols-1 md:max-lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="p-5 md:max-lg:p-4">
            <div className="flex flex-col gap-3 sm:max-lg:mx-auto sm:max-lg:max-w-sm">
              <div className="skeleton-shimmer aspect-square rounded-xl" />
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="skeleton-shimmer h-9 w-9 shrink-0 rounded-md" />
                {Array.from({ length: 5 }, (_, index) => (
                  <div key={index} className="skeleton-shimmer h-20 w-20 shrink-0 rounded-md" />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-5 p-6 md:max-lg:gap-4 md:max-lg:p-4">
            <div className="space-y-2">
              <div className="skeleton-shimmer h-6 rounded" />
              <div className="skeleton-shimmer h-6 w-4/5 rounded" />
            </div>
            <div className="flex gap-3 border-b border-surface-border pb-4">
              <div className="skeleton-shimmer h-4 w-24 rounded" />
              <div className="skeleton-shimmer h-4 w-20 rounded" />
              <div className="skeleton-shimmer h-4 w-16 rounded" />
            </div>

            {/* Giá, phân loại và nút mua chỉ hiện trực tiếp từ tablet trở lên. */}
            <div className="hidden flex-col gap-5 sm:flex">
              <div className="skeleton-shimmer h-28 rounded-xl" />
              {Array.from({ length: 2 }, (_, index) => (
                <div key={index} className="flex flex-wrap items-center gap-3">
                  <div className="skeleton-shimmer h-4 w-20 rounded" />
                  {Array.from({ length: 3 }, (_, option) => (
                    <div key={option} className="skeleton-shimmer h-9 w-20 rounded-lg" />
                  ))}
                </div>
              ))}
              <div className="skeleton-shimmer h-9 w-48 rounded-lg" />
              <div className="grid grid-cols-2 gap-3 md:max-lg:grid-cols-1">
                <div className="skeleton-shimmer h-12 rounded-lg" />
                <div className="skeleton-shimmer h-12 rounded-lg" />
              </div>
              <div className="skeleton-shimmer h-4 w-40 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin shop giữ khoảng trống cho avatar, tên và các chỉ số. */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-surface-border bg-surface-card p-5" aria-hidden="true">
        <div className="skeleton-shimmer h-16 w-16 shrink-0 rounded-full" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="skeleton-shimmer h-5 w-48 max-w-full rounded" />
          <div className="skeleton-shimmer h-3 w-64 max-w-full rounded" />
        </div>
        <div className="skeleton-shimmer hidden h-10 w-48 rounded-lg sm:block" />
      </div>

      {/* Các card mô tả và đánh giá chờ request kết thúc trước khi hiện nội dung mock. */}
      {Array.from({ length: 2 }, (_, index) => (
        <div key={index} className="rounded-xl border border-surface-border bg-surface-card" aria-hidden="true">
          <div className="border-b border-surface-border px-6 py-4">
            <div className="skeleton-shimmer h-5 w-40 rounded" />
          </div>
          <div className="space-y-3 p-6">
            <div className="skeleton-shimmer h-4 rounded" />
            <div className="skeleton-shimmer h-4 w-5/6 rounded" />
            <div className="skeleton-shimmer h-4 w-2/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
