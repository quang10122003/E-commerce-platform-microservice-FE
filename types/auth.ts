// Payload đăng nhập gửi từ form đến API xác thực.
export interface LoginRequest {
  email: string;
  password: string;
}

// Dữ liệu xác thực backend trả về sau khi đăng nhập thành công.
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string[];
  userId: number;
  email: string;
  fullName: string;
}

// Dữ liệu được phép trả về client sau khi token đã được lưu vào cookie.
export type AuthenticatedUser = Omit<AuthResponse, "accessToken" | "refreshToken">;
