import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import type { CartResponse } from "@/types/cart";

// Lấy giỏ hàng làm dữ liệu ban đầu cho Server Component.
export async function getCart(): Promise<CartResponse> {
  const result = await serverFetch<CartResponse>("api/cart", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < 200 || result.status >= 300 || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải giỏ hàng.");
  }

  return result.payload.data;
}
