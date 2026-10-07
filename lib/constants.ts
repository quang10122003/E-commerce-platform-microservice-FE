// Cấu hình phân trang theo từng màn hình, giữ nguyên kích thước hiện tại.
export const FIRST_PAGE = 1;
export const PAGE_SIZE = {
  SHOP_PRODUCTS: 10,
  PRODUCT_SEARCH: 20,
  SHOP_FLASH_SALES: 20,
} as const;
export const PAGINATION_VISIBLE_PAGES = 5;

// Đơn vị thời gian và độ dài chuỗi ISO dùng chung.
export const TIME = {
  SECOND_MS: 1_000,
  MINUTE_MS: 60_000,
  HOUR_MS: 3_600_000,
  MINUTES_PER_HOUR: 60,
  HOURS_PER_DAY: 24,
  MINUTES_PER_DAY: 1_440,
} as const;
export const ISO_DATE_LENGTH = 10;
export const LOCAL_DATE_TIME_LENGTH = 16;

// Thời lượng tương tác và ngưỡng hiển thị không phụ thuộc component.
export const CART_QUANTITY_DEBOUNCE_MS = 500;
export const SEARCH_DEBOUNCE_MS = 400;
export const HERO_CAROUSEL_INTERVAL_MS = 4_500;
export const FLASH_SALE_CLOSING_SOON_MS = 3 * TIME.HOUR_MS;
export const SEARCH_VISIBLE_LOCATIONS = 7;

// Cấu hình thông báo dùng chung cho hook và viewport.
export const MAX_VISIBLE_NOTIFICATIONS = 5;
export const EXIT_ANIMATION_DURATION = 380;
export const NOTIFICATION_DURATION_MS = 3_000;

// Cấu hình tải thêm cho danh sách gợi ý hiện tại.
export const SUGGESTIONS_INITIAL_COUNT = 10;
export const SUGGESTIONS_LOAD_MORE_COUNT = 5;
export const SUGGESTIONS_LOAD_MORE_DELAY_MS = 600;
export const BEST_SELLER_MIN_SOLD = 2_000;

// Endpoint không có dấu slash đầu để dùng với serverFetch và BFF hiện có.
export const API_ENDPOINTS = {
  LOGIN: "api/auth/login",
  REGISTER: "api/auth/register",
  REFRESH_TOKEN: "api/auth/refresh_token",
  LOGOUT: "api/auth/logout",
  CHECK_TOKEN: "api/auth/check_token",
  FORGOT_PASSWORD: "api/auth/forgot-password",
  PRODUCTS: "api/products",
  SHOP_PRODUCTS: "api/products/shop",
  SELLER_PRODUCTS: "api/products/seller",
  CATEGORIES: "api/categories",
  BRANDS: "api/brands",
  CART: "api/cart",
  SHOP_FLASH_SALES: "api/shop/flash-sales",
} as const;
export const DEFAULT_TIMEOUT_MS = 15_000;

// Tên header chuẩn gửi access token đến backend.
export const AUTHORIZATION_HEADER = "Authorization";

// Tên trường token trong DTO và response trả về từ backend.
export const AUTH_TOKEN_FIELDS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
} as const;

// Mốc HTTP dùng khi kiểm tra kết quả API, không thay đổi chính sách xác thực.
export const HTTP_STATUS = {
  SUCCESS_MIN: 200,
  SUCCESS_LIMIT: 300,
  UNAUTHORIZED: 401,
} as const;

// Tên cookie dự phòng; cấu hình môi trường vẫn được ưu tiên tại phía server.
export const AUTH_COOKIE_NAMES = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
} as const;
