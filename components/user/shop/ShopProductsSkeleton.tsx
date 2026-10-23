// Giữ tỷ lệ card và số cột giống lưới shop trong lúc server đang tải kết quả mới.
export function ShopProductsSkeleton() {
  return (
    <div role="status" aria-busy="true" aria-label="Đang tải sản phẩm của shop" className="hidden grid-cols-2 gap-2.5 group-has-[[data-shop-products-pending=true]]/catalog:grid sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-5">
      <span className="sr-only">Đang tải sản phẩm…</span>
      {Array.from({ length: 10 }, (_, index) => (
        <div key={index} aria-hidden="true" className="overflow-hidden rounded-xl border border-surface-border bg-surface-card">
          <div className="skeleton-shimmer aspect-square" />
          <div className="space-y-3 p-3 sm:p-3.5">
            <div className="space-y-1.5"><div className="skeleton-shimmer h-3.5 rounded-md" /><div className="skeleton-shimmer h-3.5 w-3/4 rounded-md" /></div>
            <div className="flex items-center justify-between gap-2"><div className="skeleton-shimmer h-4 w-1/2 rounded-md" /><div className="skeleton-shimmer h-3 w-1/4 rounded-md" /></div>
            <div className="flex items-center justify-between gap-2 border-t border-surface-border pt-2"><div className="skeleton-shimmer h-3 w-8 rounded-md" /><div className="skeleton-shimmer h-3 w-1/3 rounded-md" /></div>
          </div>
        </div>
      ))}
    </div>
  );
}
