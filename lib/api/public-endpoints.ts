import { API_ENDPOINTS } from "@/lib/constants";
/**
 * Quản lý danh sách endpoint công khai và tên trường token dùng chung.
 */

// Danh sách endpoint công khai không cần đính kèm Authorization header.
export const PUBLIC_ENDPOINTS = [
  API_ENDPOINTS.LOGIN,
  API_ENDPOINTS.REGISTER,
  API_ENDPOINTS.FORGOT_PASSWORD,
  API_ENDPOINTS.REFRESH_TOKEN,
  API_ENDPOINTS.LOGOUT,
  API_ENDPOINTS.PRODUCTS,
] as const;

// Tên trường token dùng chung được khai báo tại nguồn constants duy nhất.
export { AUTH_TOKEN_FIELDS } from "@/lib/constants";

// Kiểm tra endpoint có thuộc danh sách công khai hay không.
// Kiểm tra endpoint công khai theo path và phương thức HTTP khi cần phân biệt cùng một path.
export function isPublicEndpoint(endpointPath: string, method = "GET"): boolean {
  // Chỉ GET catalog được công khai, POST cùng path vẫn yêu cầu xác thực người bán.
  if (endpointPath === API_ENDPOINTS.PRODUCTS) {
    return method.toUpperCase() === "GET";
  }

  // Các endpoint con của product luôn yêu cầu xác thực theo nghiệp vụ riêng.
  if (endpointPath.startsWith(`${API_ENDPOINTS.PRODUCTS}/`)) {
    return false;
  }

  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      endpointPath === publicEndpoint ||
      endpointPath.startsWith(publicEndpoint + "/"),
  );
}
