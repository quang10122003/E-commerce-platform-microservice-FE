import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { HTTP_STATUS } from "@/lib/constants";
import type { ShopOverviewResponse, ShopProductPage, ShopProductQuery } from "@/types/user/shop";
import type { SellerShopProfile } from "@/types/shop/profile";

// Lấy tổng quan shop sở hữu sản phẩm, giữ lỗi cho caller quyết định ẩn block.
export async function getProductShopOverview(productId: number): Promise<ShopOverviewResponse> {
  const result = await serverFetch<ShopOverviewResponse>(`api/products/${productId}/shop/overview`, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải thông tin shop.");
  }

  return result.payload.data;
}

// Lấy hồ sơ gian hàng qua một sản phẩm vì overview chỉ nhận productId.
export async function getShopOverview(shopId: number): Promise<ShopOverviewResponse | null> {
  const products = await getShopProducts(shopId, { page: 1, size: 1, sort: "RELEVANCE" });
  // shortcut: Shop không có sản phẩm ACTIVE chưa có hồ sơ; đổi khi BE hỗ trợ overview theo shopId.
  if (!products.items.length) return null;
  const shop = await getProductShopOverview(products.items[0].id);
  if (shop.shopId !== shopId) throw new Error("Thông tin shop không khớp.");
  return shop;
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

// Hồ sơ shop của tài khoản đang đăng nhập cho topbar Kênh Người Bán; lỗi để layout tự fallback.
export async function getMyShopProfile(): Promise<SellerShopProfile> {
  const result = await serverFetch<SellerShopProfile>("api/users/me/shop", { method: "GET", cache: "no-store" });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải thông tin shop.");
  }
  return result.payload.data;
}
