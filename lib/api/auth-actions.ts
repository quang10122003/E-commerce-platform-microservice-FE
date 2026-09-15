import "server-only";

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/cookies";
import {
  AUTH_ENDPOINTS,
  AUTH_TOKEN_FIELDS,
} from "@/lib/api/public-endpoints";
import {
  fetchWithTimeout,
  serverFetch,
  type ServerFetchOptions,
  type ServerFetchRequestContext,
  type ServerFetchResult,
} from "@/lib/api/server-fetch";
import type { ApiResponse } from "@/types/common";
import type {
  AuthResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth";

// Gọi endpoint refresh để lấy cặp token mới từ refresh token trong cookie.
async function refreshAuthTokens(): Promise<RefreshTokenResponse | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const requestBody: RefreshTokenRequest = { refreshToken };
  const result = await serverFetch<RefreshTokenResponse>(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      skipAuth: true,
    },
  );

  const payload = result.payload;
  if (result.status < 200 || result.status >= 300) return null;
  if (!payload.success || !payload.data) return null;

  await setAuthTokens(payload.data);
  return payload.data;
}

let refreshPromise: Promise<string | undefined> | null = null;

// Đảm bảo nhiều request 401 cùng chờ một lần refresh duy nhất.
export function refreshAuthTokensSingleFlight(): Promise<string | undefined> {
  if (!refreshPromise) {
    refreshPromise = refreshAuthTokens()
      .then((tokens) => tokens?.accessToken)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

// Xử lý response login bằng cách lưu token và loại token khỏi payload client.
async function handleLoginResponse<T>(
  response: Response,
  payload: ApiResponse<T>,
): Promise<ApiResponse<T>> {
  if (!response.ok || !payload.data) return payload;

  const authData = payload.data as unknown as AuthResponse;
  const accessToken = authData[AUTH_TOKEN_FIELDS.ACCESS_TOKEN];
  const refreshToken = authData[AUTH_TOKEN_FIELDS.REFRESH_TOKEN];
  if (!accessToken || !refreshToken) return payload;

  await setAuthTokens({
    [AUTH_TOKEN_FIELDS.ACCESS_TOKEN]: accessToken,
    [AUTH_TOKEN_FIELDS.REFRESH_TOKEN]: refreshToken,
  });

  const authenticatedUser = Object.fromEntries(
    Object.entries(authData).filter(
      ([key]) =>
        key !== AUTH_TOKEN_FIELDS.ACCESS_TOKEN &&
        key !== AUTH_TOKEN_FIELDS.REFRESH_TOKEN,
    ),
  );

  return { ...payload, data: authenticatedUser as T };
}

// Gọi logout bằng token trong cookie và xóa cookie sau khi request hoàn tất.
async function handleLogoutRequest({
  url,
  options,
}: ServerFetchRequestContext): Promise<Response> {
  const requestBody: LogoutRequest = {
    [AUTH_TOKEN_FIELDS.REFRESH_TOKEN]: (await getRefreshToken()) ?? "",
    [AUTH_TOKEN_FIELDS.ACCESS_TOKEN]: (await getAccessToken()) ?? "",
  };
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");
  // Xóa metadata body cũ vì request logout được tạo lại với DTO token mới.
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  try {
    return await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers,
        body: JSON.stringify(requestBody),
        cache: "no-store",
        signal: options.signal,
      },
      options.timeoutMs,
    );
  } finally {
    await clearAuthTokens();
  }
}

// Gọi API private qua serverFetch với cơ chế refresh token single-flight.
export function authenticatedRequest<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  const accessTokenPromise = options.accessToken
    ? Promise.resolve(options.accessToken)
    : getAccessToken();

  return accessTokenPromise.then((accessToken) =>
    serverFetch<T>(path, {
      ...options,
      accessToken,
      onUnauthorized: refreshAuthTokensSingleFlight,
      onAuthFailure: clearAuthTokens,
    }),
  );
}

// Gọi API login với hook xử lý token riêng của authentication.
export function loginRequest<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  return serverFetch<T>(path, {
    ...options,
    skipAuth: true,
    onAfterResponse: handleLoginResponse,
  });
}

// Gọi API logout với hook tạo DTO từ token trong cookie httpOnly.
// Gọi API đăng ký với cùng cơ chế lưu token như response đăng nhập.
export function registerRequest<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  return serverFetch<T>(path, {
    ...options,
    skipAuth: true,
    onAfterResponse: handleLoginResponse,
  });
}

export function logoutRequest<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  return serverFetch<T>(path, {
    ...options,
    skipAuth: true,
    onBeforeRequest: handleLogoutRequest,
  });
}
