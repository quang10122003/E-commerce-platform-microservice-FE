import { Loading } from "@/components/ui";

// Hiển thị trạng thái tải khi server đọc danh sách theo bộ lọc và phân trang.
export default function ShopFlashSalesLoading() {
  return <Loading dotsOnly label="Đang tải chương trình Flash Sale..." className="min-h-[calc(100vh-10rem)]" />;
}
