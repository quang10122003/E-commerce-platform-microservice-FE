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
  // Chỉ công khai đúng GET bán chạy, không mở các API gợi ý cá nhân.
  /^api\/products\/recommendations\/top-selling$/,
  // GET sản phẩm tương tự được công khai, không mở các API gợi ý cá nhân.
  /^api\/products\/recommendations\/similar\/\d+$/,
  // GET api/products/{productId}/shop/overview: shop sở hữu sản phẩm.
  /^api\/products\/\d+\/shop\/overview$/,
  // GET api/products/shops/{shopId}/products: danh sách sản phẩm công khai của shop.
  /^api\/products\/shops\/\d+\/products$/,
  // GET api/products/{productId}: chi tiết sản phẩm công khai
  /^api\/products\/-?\d+$/,
  // GET api/products/{productId}/variants/{variantId}/sale: thông tin sale
  /^api\/products\/-?\d+\/variants\/-?\d+\/sale$/,
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

  // Chỉ GET chi tiết, sale và tổng quan shop khớp whitelist được công khai; API quản lý vẫn private.
  if (endpointPath.startsWith("api/products/")) {
    return method.toUpperCase() === "GET" && PUBLIC_ENDPOINTS.some(
      (publicEndpoint) => publicEndpoint instanceof RegExp && publicEndpoint.test(endpointPath),
    );
  }

  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      typeof publicEndpoint === "string" && (
        endpointPath === publicEndpoint ||
        endpointPath.startsWith(publicEndpoint + "/")
      ),
  );
}
