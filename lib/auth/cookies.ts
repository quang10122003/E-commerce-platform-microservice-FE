import "server-only";

import { cookies } from "next/headers";

const accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";
const refreshTokenCookieName = process.env.REFRESH_TOKEN_COOKIE_NAME ?? "refresh_token";

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

// Lưu cặp access token và refresh token vào cookie httpOnly.
export async function setAuthTokens({ accessToken, refreshToken }: AuthTokens) {
  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  } as const;

  cookieStore.set(accessTokenCookieName, accessToken, cookieOptions);
  cookieStore.set(refreshTokenCookieName, refreshToken, cookieOptions);
}

// Xóa cả hai token khi đăng xuất hoặc phiên đăng nhập không còn hợp lệ.
export async function clearAuthTokens() {
  const cookieStore = await cookies();

  cookieStore.delete(accessTokenCookieName);
  cookieStore.delete(refreshTokenCookieName);
}
