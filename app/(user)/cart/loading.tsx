import { Loading } from "@/components/ui";

// Hiển thị trạng thái chờ trong lúc Server Component tải giỏ hàng.
export default function CartLoading() {
  return (
    <Loading
      label="Đang tải giỏ hàng..."
      className="min-h-[calc(100svh-10rem)] w-full border-surface-border bg-surface-card shadow-none"
    />
  );
}
