// Hiển thị trạng thái chờ trong lúc Server Component tải hồ sơ.
export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-5" role="status" aria-label="Đang tải thông tin cá nhân">
      <div className="skeleton-shimmer h-7 w-56 rounded-lg" />
      <div className="flex items-center gap-5 rounded-2xl border border-slate-200/90 bg-white p-6">
        <div className="skeleton-shimmer size-24 shrink-0 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton-shimmer h-6 w-48 rounded-md" />
          <div className="skeleton-shimmer h-4 w-64 rounded-md" />
          <div className="skeleton-shimmer h-6 w-40 rounded-full" />
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="skeleton-shimmer h-56 rounded-2xl lg:col-span-2" />
        <div className="skeleton-shimmer h-56 rounded-2xl" />
      </div>
      <span className="sr-only">Đang tải thông tin cá nhân...</span>
    </div>
  );
}
