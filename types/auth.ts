// Payload đăng nhập gửi từ form đến API xác thực.
export interface LoginRequest {
  email: string;
  password: string;
}

// Payload gửi lên backend để cấp lại cặp token xác thực.
export interface RefreshTokenRequest {
  refreshToken: string;
}

// Dữ liệu token mới backend trả về sau khi refresh thành công.
export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Thông tin user backend trả về khi kiểm tra access token hiện tại.
export interface AccessTokenValidationResponse {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole[];
}

// Các quyền xác thực được backend cấp cho người dùng.
export type UserRole = "ROLE_USER" | "ROLE_SHOP" | "ROLE_ADMIN";

// Dữ liệu xác thực backend trả về sau khi đăng nhập thành công.
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: UserRole[];
  userId: number;
  email: string;
  fullName: string;
}

// Dữ liệu được phép trả về client sau khi token đã được lưu vào cookie.
export type AuthenticatedUser = Omit<AuthResponse, "accessToken" | "refreshToken">;
