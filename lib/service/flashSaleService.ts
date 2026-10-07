import { HTTP_STATUS, API_ENDPOINTS, PAGE_SIZE } from "@/lib/constants";
import "server-only";
import { serverFetch } from "@/lib/api/server-client";
import type { ShopFlashSalePage, ShopFlashSaleQuery } from "@/types/shop/flash-sale";

// Phân biệt thông báo API với lỗi kỹ thuật để không hiển thị chi tiết nội bộ.
export class FlashSaleApiError extends Error { }

// Lấy danh sách chương trình qua orchestrator xác thực phía server.
export async function getShopFlashSales(query: ShopFlashSaleQuery): Promise<{ data: ShopFlashSalePage; now: number }> {
  const params = new URLSearchParams({ page: String(query.page), size: String(PAGE_SIZE.SHOP_FLASH_SALES) });
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.registrationOpen !== undefined) params.set("registrationOpen", String(query.registrationOpen));
  const result = await serverFetch<ShopFlashSalePage>(`${API_ENDPOINTS.SHOP_FLASH_SALES}?${params}`, { method: "GET", cache: "no-store" });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new FlashSaleApiError(result.payload.message || "Không thể tải danh sách chương trình. Vui lòng thử lại.");
  }
  return { data: result.payload.data, now: Date.now() };
}
