import { ShopCreateProductView } from "@/components/shop/products/shop-create-product-view";
import { ProductFormModal } from "@/components/shop/products/product-form-modal";
import { GetDataForCareteProduct } from "@/lib/service/productService";

export default async function CreateProductModalPage() {
  const result = await GetDataForCareteProduct();

  return (
    <ProductFormModal title="Thêm sản phẩm" description="Tạo sản phẩm mới cho cửa hàng của bạn.">
      <ShopCreateProductView category={result.category} brand={result.brand} isModal />
    </ProductFormModal>
  );
}
