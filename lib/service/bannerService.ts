import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { HTTP_STATUS } from "@/lib/constants";

// Tải banner trên server và kiểm tra danh sách HTML trước khi truyền cho carousel.
export async function getActiveBanners(): Promise<string[]> {
  const result = await serverFetch<unknown>("api/banners/active", {
    method: "GET",
    cache: "no-store",
  });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success) {
    throw new Error(result.payload.error?.message || result.payload.message || "Không thể tải banner.");
  }

  if (!Array.isArray(result.payload.data)
    || !result.payload.data.every((html): html is string => typeof html === "string")) {
    throw new Error("Danh sách banner không hợp lệ.");
  }

  return result.payload.data;
}
