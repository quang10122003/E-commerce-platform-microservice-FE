// Hồ sơ shop của tài khoản đang đăng nhập, từ GET /api/users/me/shop.
export interface SellerShopProfile {
  shopId: number;
  shopName: string | null;
  location: string | null;
  shopLogoUrl: string | null;
  shopDescription: string | null;
  shopCreatedAt: string | null;
}

// Các trường hồ sơ shop được phép sửa; mô tả để chuỗi rỗng khi không có.
export interface UpdateShopProfileForm {
  shopName: string;
  shopDescription: string;
}
