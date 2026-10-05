import { Loading } from "@/components/ui";

// Hiển thị trạng thái tải trong lúc lấy danh mục và danh sách sản phẩm.
export default function SellerProductsLoading() {
  return (
    <Loading
      label="Đang tải danh sách sản phẩm..."
      className="min-h-[calc(100vh-10rem)]"
    />
  );
}
