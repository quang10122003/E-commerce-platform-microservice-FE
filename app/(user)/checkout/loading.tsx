import { Loading } from "@/components/ui";

// Hiển thị trạng thái chờ trong lúc tải dữ liệu trang thanh toán.
export default function CheckoutLoading() {
  return (
    <Loading
      label="Đang tải thông tin thanh toán..."
      className="min-h-[calc(100svh-10rem)] w-full border-surface-border bg-surface-card shadow-none"
    />
  );
}
