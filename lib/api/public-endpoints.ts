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
  "api/products",
] as const;

// Tên trường token trong DTO và response trả về từ backend.
export const AUTH_TOKEN_FIELDS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

// Kiểm tra endpoint có thuộc danh sách công khai hay không.
// Kiểm tra endpoint công khai theo path và phương thức HTTP khi cần phân biệt cùng một path.
export function isPublicEndpoint(endpointPath: string, method = "GET"): boolean {
  // Chỉ GET catalog được công khai, POST cùng path vẫn yêu cầu xác thực người bán.
  if (endpointPath === "api/products") {
    return method.toUpperCase() === "GET";
  }

  // Các endpoint con của product luôn yêu cầu xác thực theo nghiệp vụ riêng.
  if (endpointPath.startsWith("api/products/")) {
    return false;
  }

  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      endpointPath === publicEndpoint ||
      endpointPath.startsWith(publicEndpoint + "/"),
  );
}
