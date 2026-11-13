import "server-only";

import { HTTP_STATUS } from "@/lib/constants";
import { serverFetch } from "@/lib/api/server-client";
import type { UserProfile } from "@/types/user/profile";

// Lấy hồ sơ của tài khoản đang đăng nhập cho Server Component.
export async function getMyProfile(): Promise<UserProfile> {
  const result = await serverFetch<UserProfile>("api/users/me", { method: "GET", cache: "no-store" });

  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT || !result.payload.success || !result.payload.data) {
    throw new Error("Không thể tải thông tin cá nhân.");
  }

  return result.payload.data;
}
