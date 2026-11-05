import { AUTH_COOKIE_NAMES } from "@/lib/constants";
//  tương tác với cooki chỉ qua server
import "server-only";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { createRoleCookie, ROLE_COOKIE_NAME } from "@/lib/auth/role-cookie";
import type { AccessTokenValidationResponse } from "@/types/shared/auth";

const accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME ?? AUTH_COOKIE_NAMES.ACCESS_TOKEN;
const refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME ?? AUTH_COOKIE_NAMES.REFRESH_TOKEN;

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

// Đọc access token từ cookie httpOnly ở phía server.
export async function getAccessToken() {
  const cookieStore = await cookies();

  return cookieStore.get(accessTokenCookieName)?.value;
}

// Đọc refresh token để thực hiện flow cấp lại access token ở phía server.
export async function getRefreshToken() {
  const cookieStore = await cookies();

  return cookieStore.get(refreshTokenCookieName)?.value;
}

// Lưu cặp token và đồng bộ quyền đã xác thực khi đăng nhập hoặc refresh.
export async function setAuthTokens({ accessToken, refreshToken }: AuthTokens, user?: AccessTokenValidationResponse) {
  const cookieStore = await cookies();
  // Token mới cần check_token xác nhận quyền, không ký lại quyền cũ sau refresh.
  const roleValue = user ? createRoleCookie(user, accessToken) : undefined;
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  } as const;

  cookieStore.set(accessTokenCookieName, accessToken, cookieOptions);
  cookieStore.set(refreshTokenCookieName, refreshToken, cookieOptions);
  if (roleValue) cookieStore.set(ROLE_COOKIE_NAME, roleValue, cookieOptions);
  else cookieStore.delete(ROLE_COOKIE_NAME);
}

// Cập nhật quyền từ check_token để phiên cũ và thay đổi quyền được đồng bộ lại.
export async function setAuthRole(user: AccessTokenValidationResponse) {
  const accessToken = await getAccessToken();
  if (!accessToken) return;
  (await cookies()).set(ROLE_COOKIE_NAME, createRoleCookie(user, accessToken), {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/",
  });
}

// Xóa token và quyền khi đăng xuất hoặc phiên đăng nhập không còn hợp lệ.
export async function clearAuthTokens() {
  const cookieStore = await cookies();

  cookieStore.delete(accessTokenCookieName);
  cookieStore.delete(refreshTokenCookieName);
  cookieStore.delete(ROLE_COOKIE_NAME);
  cookieStore.delete(sessionRefreshAttemptCookieName);
}

const sessionRefreshAttemptCookieName = "session-refresh-attempt";

// Hash access token chỉ phục vụ chặn lặp, không đưa token vào URL hoặc client state.
function getSessionRefreshFingerprint(accessToken?: string) {
  return createHash("sha256").update(accessToken ?? "").digest("hex");
}

// Nhận diện lượt refresh vừa xử lý cùng access token trong 30 giây.
export async function getSessionRefreshAttempt(accessToken?: string) {
  const value = (await cookies()).get(sessionRefreshAttemptCookieName)?.value;
  const fingerprint = getSessionRefreshFingerprint(accessToken);
  if (value === `recovered:${fingerprint}`) return "recovered";
  if (value === `failed:${fingerprint}`) return "failed";
  return undefined;
}

// Route Handler ghi dấu vết ngắn hạn để page quay lại không redirect vô hạn.
export async function setSessionRefreshAttempt(status: "recovered" | "failed") {
  const cookieStore = await cookies();
  cookieStore.set(sessionRefreshAttemptCookieName, `${status}:${getSessionRefreshFingerprint(await getAccessToken())}`, {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30,
  });
}
