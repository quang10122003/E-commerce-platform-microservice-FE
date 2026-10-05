import { Loading } from "@/components/ui";

// Hiển thị trạng thái chờ trong lúc Server Component tải giỏ hàng.
export default function CartLoading() {
  return (
    <Loading
      label="Đang tải giỏ hàng..."
      className="min-h-72 border-surface-border bg-surface-card shadow-none"
    />
  );
}
