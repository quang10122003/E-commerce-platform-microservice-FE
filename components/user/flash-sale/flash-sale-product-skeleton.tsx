// Giữ bố cục card sale khi chuyển danh mục, dùng hiệu ứng skeleton chung của dự án.
export function FlashSaleProductSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 xl:grid-cols-5" role="status" aria-busy="true" aria-label="Đang tải sản phẩm theo danh mục">
      <span className="sr-only">Đang tải sản phẩm theo danh mục…</span>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-xl border border-surface-border bg-surface-card" aria-hidden="true">
          {/* Khung ảnh và thông tin có tỷ lệ tương ứng card sale thật. */}
          <div className="skeleton-shimmer aspect-[4/3]" />
          <div className="space-y-2.5 p-2.5 sm:p-3">
            <div className="space-y-1.5">
              <div className="skeleton-shimmer h-4 rounded" />
              <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            </div>
            <div className="skeleton-shimmer h-3 w-1/2 rounded" />
            <div className="skeleton-shimmer h-6 w-2/3 rounded" />
            <div className="skeleton-shimmer h-3 w-1/3 rounded" />
            <div className="skeleton-shimmer h-5 rounded" />
            <div className="grid grid-cols-2 gap-1.5">
              <div className="skeleton-shimmer h-10 rounded-md" />
              <div className="skeleton-shimmer h-10 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
