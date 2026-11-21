// Cấu hình kích thước phân trang theo từng màn hình.
export const FIRST_PAGE = 1;
export const PAGE_SIZE = {
  SHOP_PRODUCTS: 10,
  PRODUCT_SEARCH: 20,
  SHOP_FLASH_SALES: 10,
  SHOP_FLASH_SALE_HISTORY: 10,
  USER_ORDERS: 10,
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
export const CART_QUOTE_MAX_ITEMS = 50;
export const SEARCH_DEBOUNCE_MS = 400;
export const PRICE_PREVIEW_DEBOUNCE_MS = 500;
export const HERO_CAROUSEL_INTERVAL_MS = 4_500;
export const FLASH_SALE_CLOSING_SOON_MS = 3 * TIME.HOUR_MS;
export const SEARCH_VISIBLE_LOCATIONS = 7;

// Cấu hình thông báo dùng chung cho hook và viewport.
export const MAX_VISIBLE_NOTIFICATIONS = 5;
export const EXIT_ANIMATION_DURATION = 380;
export const NOTIFICATION_DURATION_MS = 3_000;

// Cấu hình tải thêm cho danh sách gợi ý hiện tại.
export const SUGGESTIONS_INITIAL_COUNT = 20;
export const SUGGESTIONS_LOAD_MORE_COUNT = 5;
export const SUGGESTIONS_LOAD_MORE_DELAY_MS = 600;

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
  ROLE: "role",
} as const;
