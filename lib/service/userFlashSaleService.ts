import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { HTTP_STATUS } from "@/lib/constants";
import type { UserFlashSaleResponse } from "@/types/user/flash-sale";

// Giữ mã HTTP để page phân biệt lỗi sale với phiên chưa đăng nhập.
export class UserFlashSaleApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "UserFlashSaleApiError";
  }
}

// Lấy sale theo danh mục qua orchestrator server, không tự xử lý token.
export async function getUserFlashSaleItems(categoryId?: number): Promise<{ data: UserFlashSaleResponse; now: number }> {
  const params = new URLSearchParams();
  if (categoryId !== undefined) params.set("categoryId", String(categoryId));
  const query = params.toString();
  return getSaleResponse(`api/user/flash-sales/items${query ? `?${query}` : ""}`);
}

// Lấy top 5 theo thứ tự backend, dùng chung DTO và luồng kiểm tra response.
export async function getTopSellingFlashSaleItems(): Promise<{ data: UserFlashSaleResponse; now: number }> {
  return getSaleResponse("api/user/flash-sales/items/top-selling");
}

// Kiểm tra response sale; lỗi vẫn được ném để page ghi log và xử lý recovery.
async function getSaleResponse(endpoint: string): Promise<{ data: UserFlashSaleResponse; now: number }> {
  const result = await serverFetch<UserFlashSaleResponse>(
    endpoint,
    { method: "GET", cache: "no-store" },
  );

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !result.payload.data || !Array.isArray(result.payload.data.items)) {
    throw new UserFlashSaleApiError(
      result.payload.error?.message || result.payload.message || "Không thể tải ưu đãi Flash Sale.",
      result.status,
    );
  }

  return { data: result.payload.data, now: Date.now() };
}
