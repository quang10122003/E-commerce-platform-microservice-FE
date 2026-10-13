import "server-only";

import { serverFetch } from "@/lib/api/server-client";
import { HTTP_STATUS } from "@/lib/constants";
import type { CategoryResponse } from "@/types/shared/category";

// Lấy danh mục công khai và ném lỗi tại service để giữ ngữ cảnh debug.
export async function getCategories(): Promise<CategoryResponse[]> {
  const result = await serverFetch<CategoryResponse[]>("api/categories", {
    method: "GET",
    cache: "no-store",
  });

  if (
    result.status < HTTP_STATUS.SUCCESS_MIN ||
    result.status >= HTTP_STATUS.SUCCESS_LIMIT ||
    !result.payload.success
  ) {
    throw new Error(
      `Không thể tải danh mục (GET api/categories, HTTP ${result.status}): ${
        result.payload.error?.message || result.payload.message || "API trả về lỗi."
      }`,
    );
  }

  // Response thành công không có nội dung được xem là danh sách rỗng.
  if (result.payload.data === null) return [];

  if (!Array.isArray(result.payload.data)) {
    throw new Error("GET api/categories trả về danh sách danh mục không hợp lệ.");
  }

  return result.payload.data;
}
