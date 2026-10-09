import { CreateProductView } from "@/components/shop/products/create-product-view";
import { ProductFormModal } from "@/components/shop/products/product-form-modal";
import { GetDataForCareteProduct } from "@/lib/service/productService";

export default async function CreateProductModalPage() {
  const result = await GetDataForCareteProduct();

  return (
    <ProductFormModal title="Thêm sản phẩm" description="Tạo sản phẩm mới cho cửa hàng của bạn.">
      <CreateProductView category={result.category} brand={result.brand} isModal />
    </ProductFormModal>
  );
}
