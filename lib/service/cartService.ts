import { HTTP_STATUS, API_ENDPOINTS } from "@/lib/constants";
import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import type { CartResponse } from "@/types/user/cart";

// Lấy giỏ hàng làm dữ liệu ban đầu cho Server Component.
export async function getCart(): Promise<CartResponse> {
  const result = await serverFetch<CartResponse>(API_ENDPOINTS.CART, {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải giỏ hàng.");
  }

  return result.payload.data;
}
