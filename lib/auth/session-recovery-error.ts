import { unstable_rethrow } from "next/navigation";

// Giữ digest cũ để tương thích caller cũ; serverFetch hiện dùng redirect của Next.js.
export const SESSION_REFRESH_REQUIRED = "SESSION_REFRESH_REQUIRED";

// Nhận diện tài khoản bị khóa theo mã lỗi, không phụ thuộc thông báo backend.
export function isUserLocked(payload: unknown): boolean {
  return typeof payload === "object" && payload !== null && "error" in payload
    && typeof payload.error === "object" && payload.error !== null
    && "code" in payload.error && payload.error.code === "USER_LOCKED";
}

export class SessionRefreshRequiredError extends Error {
  readonly digest = SESSION_REFRESH_REQUIRED;

  constructor() {
    super("Phiên cần được khôi phục qua Route Handler.");
    this.name = "SessionRefreshRequiredError";
  }
}

// Nhận diện lỗi recovery kể cả khi Next.js đã ẩn message trong production.
export function isSessionRefreshRequiredError(error: unknown): boolean {
  return typeof error === "object" && error !== null
    && "digest" in error && error.digest === SESSION_REFRESH_REQUIRED;
}

// Giữ redirect của Next.js và tương thích tín hiệu recovery cũ trong mọi catch/fallback.
export function rethrowSessionRefreshRequired(error: unknown): void {
  unstable_rethrow(error);
  if (isSessionRefreshRequiredError(error)) throw error;
}
