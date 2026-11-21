import "server-only";

import { HTTP_STATUS, PAGE_SIZE } from "@/lib/constants";
import { serverFetch } from "@/lib/api/server-client";
import { toShopAnalyticsSearchParams } from "@/lib/utils/shop-analytics.utils";
import { toShopOrderSearchParams } from "@/lib/utils/shop-order.utils";
import type { ShopAnalytics, ShopAnalyticsQuery } from "@/types/shop/analytics";
import type { ShopOrder, ShopOrderQuery } from "@/types/shop/order";
import type { SellerOrderOverview } from "@/types/shop/overview";
import type { UserOrderPage, UserOrderQuery } from "@/types/user/order";

// Lấy danh sách đơn hàng của người dùng hiện tại cho Server Component.
export async function getMyOrders({ status, keyword, page }: UserOrderQuery): Promise<UserOrderPage> {
  const params = new URLSearchParams({ page: String(page), size: String(PAGE_SIZE.USER_ORDERS) });
  if (status) params.set("status", status);
  if (keyword) params.set("keyword", keyword);
  const result = await serverFetch<UserOrderPage>(`api/orders?${params}`, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải danh sách đơn hàng.");
  }

  return result.payload.data;
}

// Lấy đơn của shop theo bộ lọc thanh toán, từ khóa và khoảng thời gian; tab trạng thái lọc ở client.
export async function getShopOrders(query: ShopOrderQuery): Promise<ShopOrder[]> {
  const params = toShopOrderSearchParams(query).toString();
  const result = await serverFetch<ShopOrder[]>(params ? `api/orders/shop?${params}` : "api/orders/shop", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải danh sách đơn hàng của shop.");
  }

  return result.payload.data;
}

// Lấy thống kê doanh thu và đơn hàng của shop trong khoảng thời gian đã chọn.
export async function getShopAnalytics(query: ShopAnalyticsQuery): Promise<ShopAnalytics> {
  const result = await serverFetch<ShopAnalytics>(`api/orders/shop/analytics?${toShopAnalyticsSearchParams(query)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải thống kê của shop.");
  }

  return result.payload.data;
}

// Lấy số liệu đơn hàng và đánh giá cho trang tổng quan của shop.
export async function getSellerOrderOverview(): Promise<SellerOrderOverview> {
  const result = await serverFetch<SellerOrderOverview>("api/orders/shop/overview", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải tổng quan đơn hàng của shop.");
  }

  return result.payload.data;
}
