import { unstable_rethrow } from "next/navigation";

// Giữ digest cũ để tương thích caller cũ; serverFetch hiện dùng redirect của Next.js.
export const SESSION_REFRESH_REQUIRED = "SESSION_REFRESH_REQUIRED";

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
