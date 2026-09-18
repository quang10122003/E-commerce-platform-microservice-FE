/**
 * Re-export các hằng số API dùng chung để đảm bảo tương thích ngược.
 */

// Tên header chuẩn gửi access token đến backend.
export const AUTHORIZATION_HEADER = "Authorization";

export {
  AUTH_TOKEN_FIELDS,
  PUBLIC_ENDPOINTS,
  isPublicEndpoint,
} from "@/lib/api/public-endpoints";