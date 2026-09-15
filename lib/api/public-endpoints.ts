/**
 * Quản lý các endpoint xác thực, tên trường token và danh sách endpoint công khai không yêu cầu token.
 */

// Danh sách các endpoint xác thực dùng chung trong toàn ứng dụng.
export const AUTH_ENDPOINTS = {
  LOGIN: "api/auth/login",
  REGISTER: "api/auth/register",
  FORGOT_PASSWORD: "api/auth/forgot-password",
  REFRESH_TOKEN: "api/auth/refresh_token",
  CHECK_TOKEN: "api/auth/check_token",
  LOGOUT: "api/auth/logout",
} as const;

// Tên trường token trong DTO và response trả về từ backend.
export const AUTH_TOKEN_FIELDS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

// Tên header chuẩn gửi access token đến backend.
export const AUTHORIZATION_HEADER = "Authorization";

// Danh sách các endpoint công khai (không cần đính kèm Authorization header).
export const PUBLIC_ENDPOINTS = [
  AUTH_ENDPOINTS.LOGIN,
  AUTH_ENDPOINTS.REGISTER,
  AUTH_ENDPOINTS.FORGOT_PASSWORD,
  AUTH_ENDPOINTS.REFRESH_TOKEN,
  AUTH_ENDPOINTS.LOGOUT,
] as const;

// Kiểm tra endpoint có thuộc danh sách công khai hay không.
export function isPublicEndpoint(endpointPath: string): boolean {
  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      endpointPath === publicEndpoint ||
      endpointPath.startsWith(`${publicEndpoint}/`),
  );
}
