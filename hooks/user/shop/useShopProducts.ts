"use client";

import { useSearchParams } from "next/navigation";
import { useGetShopProductsQuery, useGetShopTopProductsQuery } from "@/lib/redux/services/product-api";
import { parseShopProductQuery } from "@/utils/shop-products.utils";

// Sản phẩm của shop qua RTK Query theo bộ lọc trên URL; isFetching dùng để hiện skeleton mỗi lần đổi bộ lọc.
export function useShopProducts(shopId: number) {
  const searchParams = useSearchParams();
  const query = parseShopProductQuery(Object.fromEntries(searchParams.entries()));
  const result = useGetShopProductsQuery({ shopId, query });
  const data = result.data?.success ? result.data.data : null;

  return { query, data, isFetching: result.isFetching, isError: result.isError || Boolean(result.data && !data) };
}

// Sản phẩm nổi bật cho tab Trang chủ shop; lỗi thì UI ẩn khối này.
export function useShopTopProducts(shopId: number) {
  const result = useGetShopTopProductsQuery(shopId);
  const products = result.data?.success && Array.isArray(result.data.data) ? result.data.data : [];

  return { products, isLoading: result.isLoading, isError: result.isError || Boolean(result.data && !result.data.success) };
}
