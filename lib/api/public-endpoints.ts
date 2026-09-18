/**
 * Quản lý danh sách endpoint công khai và tên trường token dùng chung.
 */

// Danh sách endpoint công khai không cần đính kèm Authorization header.
export const PUBLIC_ENDPOINTS = [
  "api/auth/login",
  "api/auth/register",
  "api/auth/forgot-password",
  "api/auth/refresh_token",
  "api/auth/logout",
] as const;

// Tên trường token trong DTO và response trả về từ backend.
export const AUTH_TOKEN_FIELDS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

// Kiểm tra endpoint có thuộc danh sách công khai hay không.
export function isPublicEndpoint(endpointPath: string): boolean {
  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      endpointPath === publicEndpoint ||
      endpointPath.startsWith(publicEndpoint + "/"),
  );
}