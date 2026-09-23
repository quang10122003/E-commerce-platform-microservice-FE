import { PackageSearch } from "lucide-react";

type SearchEmptyStateProps = {
  variant: "no-keyword" | "no-result";
};

// Trạng thái rỗng cho trang tìm kiếm — render phía server.
export function SearchEmptyState({ variant }: SearchEmptyStateProps) {
  // Thông báo khi chưa có từ khoá nào được nhập.
  if (variant === "no-keyword") {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-card">
        <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
        <h2 className="mt-3 font-bold text-main">Nhập từ khóa để bắt đầu tìm kiếm</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vui lòng nhập tên sản phẩm vào ô tìm kiếm trên đầu trang.
        </p>
      </div>
    );
  }

  // Thông báo khi không có sản phẩm nào khớp với bộ lọc hiện tại.
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-card">
      <PackageSearch className="mx-auto h-10 w-10 text-slate-400" />
      <h2 className="mt-3 font-bold text-main">Chưa tìm thấy sản phẩm phù hợp</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Hãy thử lại với từ khóa ngắn hơn hoặc khác cách viết.
      </p>
    </div>
  );
}
