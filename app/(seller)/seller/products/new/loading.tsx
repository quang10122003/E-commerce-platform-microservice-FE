import { Loading } from "@/components/ui";

// Hiển thị loading trong lúc Server Component tải category và brand cho form tạo sản phẩm.
export default function CreateProductLoading() {
  return (
    <Loading
      label="Đang tải danh mục và thương hiệu..."
      className="min-h-[calc(100vh-10rem)]"
    />
  );
}
