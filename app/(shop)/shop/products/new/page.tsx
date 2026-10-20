import { ShopCreateProductView } from "@/components/shop/products/shop-create-product-view";
import { GetDataForCareteProduct } from "@/lib/service/productService";

// Tải dữ liệu danh mục trước khi render form tạo sản phẩm.
export default async function CreateProductPage() {
  // call brand và category
  const result = await GetDataForCareteProduct();

  return (
    <ShopCreateProductView
      category={result.category}
      brand={result.brand}
    />
  );
}
