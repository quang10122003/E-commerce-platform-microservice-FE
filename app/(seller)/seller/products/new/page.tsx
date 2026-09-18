import { CreateProductView } from "@/components/seller/create-product-view";
import { GetDataForCareteProduct } from "@/lib/service/productService";

// Tải dữ liệu danh mục trước khi render form tạo sản phẩm.
export default async function CreateProductPage() {
  // call brand và category
  const result = await GetDataForCareteProduct();

  return (
    <CreateProductView
      category={result.category}
      brand={result.brand}
    />
  );
}
