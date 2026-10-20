import { notFound } from "next/navigation";
import { ShopEditProductView } from "@/components/shop/products/shop-edit-product-view";
import { ProductFormModal } from "@/components/shop/products/product-form-modal";
import { GetDataForCareteProduct } from "@/lib/service/productService";

type EditProductModalPageProps = {
  params: Promise<{ productId: string }>;
};

export default async function EditProductModalPage({ params }: EditProductModalPageProps) {
  const { productId: productIdParam } = await params;
  const productId = Number(productIdParam);
  if (!/^\d+$/.test(productIdParam) || !Number.isSafeInteger(productId) || productId <= 0) notFound();

  const catalog = await GetDataForCareteProduct();
  return (
    <ProductFormModal title="Chỉnh sửa sản phẩm" description={`Cập nhật thông tin sản phẩm #${productId}.`}>
      <ShopEditProductView productId={productId} categories={catalog.category} brands={catalog.brand} isModal />
    </ProductFormModal>
  );
}
