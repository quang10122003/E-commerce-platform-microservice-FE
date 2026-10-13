import { HTTP_STATUS, PAGE_SIZE } from "@/lib/constants";
import "server-only";
import { serverFetch } from "@/lib/api/server-client";
import type { ShopFlashSalePage, ShopFlashSaleQuery, ShopFlashSaleProduct, ShopFlashSaleCampaignDetail } from "@/types/shop/flash-sale";

// Phân biệt thông báo API với lỗi kỹ thuật để không hiển thị chi tiết nội bộ.
export class FlashSaleApiError extends Error { }

// Lấy danh sách chương trình qua orchestrator xác thực phía server.
export async function getShopFlashSales(query: ShopFlashSaleQuery): Promise<{ data: ShopFlashSalePage; now: number }> {
  const params = new URLSearchParams({ page: String(query.page), size: String(PAGE_SIZE.SHOP_FLASH_SALES) });
  if (query.from) params.set("from", query.from);
  if (query.to) params.set("to", query.to);
  if (query.registrationOpen !== undefined) params.set("registrationOpen", String(query.registrationOpen));
  const result = await serverFetch<ShopFlashSalePage>(`api/shop/flash-sales?${params}`, { method: "GET", cache: "no-store" });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new FlashSaleApiError(result.payload.message || "Không thể tải danh sách chương trình. Vui lòng thử lại.");
  }
  return { data: result.payload.data, now: Date.now() };
}

// Tải toàn bộ sản phẩm và phân loại của Shop qua serverFetch, không chia sẻ cache giữa tài khoản.
export async function getShopFlashSaleProducts(): Promise<ShopFlashSaleProduct[]> {
  const result = await serverFetch<ShopFlashSaleProduct[]>("api/shop/flash-sales/products",
    { method: "GET", cache: "no-store" });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
      || !result.payload.success || !Array.isArray(result.payload.data)) {
    throw new FlashSaleApiError(result.payload.message || "Không thể tải sản phẩm. Vui lòng thử lại.");
  }
  return result.payload.data;
}

// Lấy tên và hạn đăng ký của chương trình theo ID qua serverFetch.
export async function getShopFlashSaleCampaignDetail(campaignId: string): Promise<{ data: ShopFlashSaleCampaignDetail; now: number }> {
  if (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(Number(campaignId)) || Number(campaignId) <= 0) {
    throw new FlashSaleApiError("Chưa chọn chương trình đăng ký.");
  }
  const result = await serverFetch<ShopFlashSaleCampaignDetail>(`api/shop/flash-sales/${campaignId}`,
    { method: "GET", cache: "no-store" });
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
      || !result.payload.success || !result.payload.data) {
    throw new FlashSaleApiError(result.payload.message || "Không thể tải thông tin chương trình. Vui lòng thử lại.");
  }
  return { data: result.payload.data, now: Date.now() };
}
