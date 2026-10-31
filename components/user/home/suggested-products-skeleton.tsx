import { SUGGESTIONS_INITIAL_COUNT } from "@/lib/constants";

export function SuggestedProductsSkeleton() {
  return (
    <div className="contents" role="status" aria-label="Đang tải sản phẩm gợi ý">
      <span className="sr-only">Đang tải sản phẩm gợi ý…</span>
      {Array.from({ length: SUGGESTIONS_INITIAL_COUNT }, (_, index) => (
        <div key={index} aria-hidden="true" className="w-full max-w-[240px] overflow-hidden rounded-xl border border-surface-border bg-surface-card">
          <div className="skeleton-shimmer aspect-square" />
          <div className="space-y-2.5 p-3 sm:p-3.5">
            <div className="skeleton-shimmer h-4 rounded" />
            <div className="skeleton-shimmer h-4 w-3/4 rounded" />
            <div className="skeleton-shimmer h-5 w-2/3 rounded" />
            <div className="skeleton-shimmer h-3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
