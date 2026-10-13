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
  "api/categories",
] as const;

// Tên trường token dùng chung được khai báo tại nguồn constants duy nhất.
export { AUTH_TOKEN_FIELDS } from "@/lib/constants";

// Kiểm tra endpoint có thuộc danh sách công khai hay không.
// Kiểm tra endpoint công khai theo path và phương thức HTTP khi cần phân biệt cùng một path.
export function isPublicEndpoint(endpointPath: string, method = "GET"): boolean {
  // Chỉ công khai GET danh mục đúng theo cấu hình bảo mật backend.
  if (endpointPath === "api/categories" || endpointPath.startsWith("api/categories/")) {
    return endpointPath === "api/categories" && method.toUpperCase() === "GET";
  }
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
