import { notFound } from "next/navigation";

import { EditProductView } from "@/components/shop/edit-product-view";
import { GetDataForCareteProduct } from "@/lib/service/productService";

type EditProductPageProps = {
  params: Promise<{ productId: string }>;
};

// Tải danh mục và thương hiệu cho trang chỉnh sửa của một sản phẩm cụ thể.
export default async function EditProductPage({ params }: EditProductPageProps) {
  const { productId: productIdParam } = await params;
  const productId = Number(productIdParam);
  if (!/^\d+$/.test(productIdParam) || !Number.isSafeInteger(productId) || productId <= 0) notFound();

  const catalog = await GetDataForCareteProduct();
  return <EditProductView productId={productId} categories={catalog.category} brands={catalog.brand} />;
}
