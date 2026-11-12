import { Loading } from "@/components/ui";

// Hiển thị trạng thái tải trong lúc lấy thống kê của shop.
export default function ShopAnalyticsLoading() {
  return <Loading dotsOnly label="Đang tải thống kê..." className="min-h-[calc(100vh-10rem)]" />;
}
