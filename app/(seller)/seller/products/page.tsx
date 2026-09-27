import { SellerProductsView } from "@/components/seller/seller-products-view";
import sellerProductStatuses from "@/data/seller-product-statuses.json";
import { getSellerProductCategories, getSellerProducts } from "@/lib/service/productService";
import type { SellerProductPage, SellerProductStatus } from "@/types/seller-product";

type SellerProductsPageProps = {
  searchParams: Promise<{ page?: string; categoryId?: string; status?: string; keyword?: string }>;
};

// Chỉ nhận số nguyên dương từ URL để truy vấn phân trang và danh mục hợp lệ.
function parsePositiveInteger(value?: string) {
  if (!value || !/^\d+$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

// Tải danh mục và trang sản phẩm theo URL rồi truyền dữ liệu xuống giao diện.
export default async function SellerProductsPage({ searchParams }: SellerProductsPageProps) {
  const params = await searchParams;
  const page = parsePositiveInteger(params.page) ?? 1;
  const categoryId = parsePositiveInteger(params.categoryId);
  const keyword = params.keyword?.trim() || undefined;
  const status = sellerProductStatuses.some((item) => item.value === params.status && item.value !== "")
    ? params.status as SellerProductStatus
    : undefined;

  const [categoriesResult, productsResult] = await Promise.allSettled([
    getSellerProductCategories(),
    getSellerProducts({ page, size: 10, categoryId, status, keyword }),
  ]);

  // Dữ liệu rỗng chỉ dùng để render thông báo khi API sản phẩm lỗi.
  const emptyPage: SellerProductPage = {
    items: [], page, pageSize: 10, totalItems: 0, totalPages: 0,
  };

  return (
    <SellerProductsView
      key={JSON.stringify([page, categoryId, status, keyword])}
      categories={categoriesResult.status === "fulfilled" ? categoriesResult.value : []}
      categoryError={categoriesResult.status === "rejected"}
      products={productsResult.status === "fulfilled" ? productsResult.value : emptyPage}
      productError={productsResult.status === "rejected"}
      categoryId={categoryId}
      status={status}
      keyword={keyword}
    />
  );
}
