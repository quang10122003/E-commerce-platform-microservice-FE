import { Loading } from "@/components/ui";

export default function EditProductLoading() {
  return <Loading dotsOnly label="Đang tải dữ liệu sản phẩm..." className="min-h-[calc(100vh-10rem)]" />;
}
