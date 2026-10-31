import { skipToken } from "@reduxjs/toolkit/query";
import { useGetSimilarProductsQuery } from "@/lib/redux/services/product-api";

// Chỉ dùng dữ liệu của sản phẩm đang xem; lỗi hoặc response rỗng sẽ ẩn block gợi ý.
export function useSimilarProducts(productId: number) {
  const query = useGetSimilarProductsQuery(
    Number.isSafeInteger(productId) && productId > 0 ? { productId } : skipToken,
  );
  const products = query.currentData?.success && Array.isArray(query.currentData.data)
    ? query.currentData.data : [];

  return {
    products,
    isLoading: query.isLoading || query.isFetching,
    isError: query.isError || Boolean(query.currentData && !query.currentData.success),
  };
}
