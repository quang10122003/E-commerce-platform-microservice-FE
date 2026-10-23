import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { HTTP_STATUS } from "@/lib/constants";
import type { ShopOverviewResponse, ShopProductPage, ShopProductQuery } from "@/types/user/shop";

// Lấy tổng quan shop công khai trên server, giữ lỗi cho caller quyết định ẩn block.
export async function getShopOverview(shopId: number): Promise<ShopOverviewResponse> {
  const result = await serverFetch<ShopOverviewResponse>(`api/products/shops/${shopId}/overview`, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data || result.payload.data.shopId !== shopId) {
    throw new Error("Không thể tải thông tin shop.");
  }

  return result.payload.data;
}

// Lấy sản phẩm ACTIVE của đúng shop theo bộ lọc và số trang, không tự lọc lại dữ liệu ở FE.
export async function getShopProducts(shopId: number, query: ShopProductQuery): Promise<ShopProductPage> {
  const params = new URLSearchParams({ page: String(query.page), size: String(query.size), sort: query.sort });
  if (query.keyword) params.set("keyword", query.keyword);
  if (query.categoryId) params.set("categoryId", String(query.categoryId));
  const result = await serverFetch<ShopProductPage>(`api/products/shops/${shopId}/products?${params}`, {
    method: "GET",
    cache: "no-store",
  });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data || !Array.isArray(result.payload.data.items)) {
    throw new Error("Không thể tải sản phẩm của shop.");
  }
  return result.payload.data;
}
