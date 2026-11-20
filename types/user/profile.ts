import type { UserRole } from "@/types/shared/auth";

// Hồ sơ của tài khoản đang đăng nhập; createdAt có offset của BE.
export interface UserProfile {
  email: string;
  fullName: string;
  avatarUrl: string | null;
  roles: UserRole[];
  createdAt: string | null;
  provider: AuthProvider;
}

export type AuthProvider = "LOCAL" | "GOOGLE" | "LOCAL_GOOGLE";

// Các trường hồ sơ được phép sửa; thêm trường mới vào đây và vào PROFILE_FIELDS.
export type UpdateProfileForm = Pick<UserProfile, "fullName">;

export interface ChangePasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
