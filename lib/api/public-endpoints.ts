/**
 * Quản lý danh sách endpoint công khai và tên trường token dùng chung.
 */

// Danh sách endpoint công khai không cần đính kèm Authorization header.
export const PUBLIC_ENDPOINTS = [
  // Giữ chính sách auth hiện tại: mọi method và đường dẫn con đều công khai.
  { method: "*", path: /^api\/auth\/(login|register|forgot-password|refresh_token|logout|oauth2)(?:\/.*)?$/ },
  { method: "GET", path: "api/products" },
  // Chỉ công khai GET danh sách Flash Sale và top bán chạy.
  { method: "GET", path: /^api\/user\/flash-sales\/items(?:\/top-selling)?$/ },
  // Chỉ công khai đúng GET bán chạy, không mở các API gợi ý cá nhân.
  { method: "GET", path: "api/products/recommendations/top-selling" },
  // GET sản phẩm tương tự được công khai, không mở các API gợi ý cá nhân.
  { method: "GET", path: /^api\/products\/recommendations\/similar\/\d+$/ },
  // GET api/products/{productId}/shop/overview: shop sở hữu sản phẩm.
  { method: "GET", path: /^api\/products\/\d+\/shop\/overview$/ },
  // GET api/products/shops/{shopId}/products: danh sách sản phẩm công khai của shop.
  { method: "GET", path: /^api\/products\/shops\/\d+\/products$/ },
  // GET api/products/shops/{shopId}/top-products: sản phẩm nổi bật công khai của shop.
  { method: "GET", path: /^api\/products\/shops\/\d+\/top-products$/ },
  // GET api/products/{productId}: chi tiết sản phẩm công khai
  { method: "GET", path: /^api\/products\/-?\d+$/ },
  // GET api/products/{productId}/variants/{variantId}/sale: thông tin sale
  { method: "GET", path: /^api\/products\/-?\d+\/variants\/-?\d+\/sale$/ },
  { method: "GET", path: "api/categories" },
  // Chỉ mở danh sách banner đang hoạt động, không mở API quản trị banner.
  { method: "GET", path: "api/banners/active" },
  // GET api/reviews/products/{productId}: đánh giá công khai trên trang chi tiết sản phẩm.
  { method: "GET", path: /^api\/reviews\/products\/\d+$/ },
] as const;

// Tên trường token dùng chung được khai báo tại nguồn constants duy nhất.
export { AUTH_TOKEN_FIELDS } from "@/lib/constants";

// Kiểm tra method và path theo whitelist duy nhất, không tách nhánh theo tính năng.
export function isPublicEndpoint(endpointPath: string, method = "GET"): boolean {
  const requestMethod = method.toUpperCase();
  return PUBLIC_ENDPOINTS.some(({ method, path }) =>
    (method === "*" || method === requestMethod)
    && (typeof path === "string" ? path === endpointPath : path.test(endpointPath)),
  );
}
