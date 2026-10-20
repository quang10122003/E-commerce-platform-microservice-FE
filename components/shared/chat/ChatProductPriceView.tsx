interface ChatProductPriceViewProps {
  price: string | null;
  loading: boolean;
}

// Hiển thị thống nhất giá và skeleton ở hai phía, thiếu giá hoặc lỗi API thì ẩn.
export function ChatProductPriceView({ price, loading }: ChatProductPriceViewProps) {
  if (!price && !loading) return null;
  return (
    <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
      {loading ? (
        <span role="status" className="inline-flex max-w-full">
          <span className="sr-only">Đang tải giá…</span>
          <span aria-hidden="true" className="skeleton-shimmer block h-4 w-32 max-w-full rounded" />
        </span>
      ) : <span className="text-xs font-bold text-cta">{price}</span>}
    </span>
  );
}
