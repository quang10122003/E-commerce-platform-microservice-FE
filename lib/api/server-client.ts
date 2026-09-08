import "server-only";

import { cookies } from "next/headers";

import {
  clearAuthTokens,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/common";
import type {
  AuthResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const ACCESS_TOKEN_COOKIE_NAME =
  process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";

// Ghép domain backend với endpoint đầy đủ do caller truyền vào.
function getBackendUrl(path: string) {
  const baseUrl = BACKEND_API_URL?.replace(/\/+$/, "");
  const endpointPath = path.replace(/^\/+/, "");
  if (!baseUrl) return undefined;
  if (!endpointPath.startsWith("api/")) {
    throw new Error("serverFetch yêu cầu endpoint bắt đầu bằng api/");
  }

  return `${baseUrl}/${endpointPath}`;
}

/**
 * Danh sách mảng String các endpoint public (không cần dùng token khi gửi request)
 */
export const PUBLIC_ENDPOINTS: string[] = [
  "api/auth/login",
  "api/auth/register",
  "api/auth/forgot-password",
  "api/auth/refresh_token",
];

type ServerFetchOptions = RequestInit & {
  accessToken?: string;
};

export type ServerFetchResult<T> = {
  payload: ApiResponse<T>;
  status: number;
};

// Đọc response an toàn khi backend trả body rỗng hoặc không phải JSON.
async function parseApiResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    return {
      success: false,
      message: `Backend trả về HTTP ${response.status}.`,
      data: null,
      error: null,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    return JSON.parse(responseText) as ApiResponse<T>;
  } catch {
    return {
      success: false,
      message: "Backend trả về dữ liệu không hợp lệ.",
      data: null,
      error: null,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Chuẩn hoá path để so sánh với PUBLIC_ENDPOINTS.
 * - Bỏ query string (chỉ giữ phần trước dấu "?").
 * - Bỏ dấu "/" ở đầu và cuối, ví dụ "/api/auth/login/" -> "api/auth/login".
 */
function getEndpointPath(path: string): string {
  return path.split("?", 1)[0].replace(/^\/+|\/+$/g, "");
}

/**
 * Kiểm tra xem endpoint có thuộc danh sách public hay không.
 */
function isPublicEndpoint(endpointPath: string): boolean {
  return PUBLIC_ENDPOINTS.some(
    (publicEndpoint) =>
      endpointPath === publicEndpoint ||
      endpointPath.startsWith(`${publicEndpoint}/`),
  );
}

/**
 * Lấy access token từ options truyền vào hoặc từ cookie httpOnly trên server.
 */
async function resolveAccessToken(explicitToken?: string): Promise<string | undefined> {
  if (explicitToken) return explicitToken;

  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_TOKEN_COOKIE_NAME)?.value;
}

// Gọi endpoint refresh để lấy cặp token mới từ refresh token trong cookie.
async function refreshAuthTokens(): Promise<RefreshTokenResponse | null> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const requestBody: RefreshTokenRequest = { refreshToken };
  const refreshUrl = getBackendUrl("api/auth/refresh_token");
  if (!refreshUrl) return null;
  const response = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) return null;

  const payload = await parseApiResponse<RefreshTokenResponse>(response);
  if (!payload.success || !payload.data) return null;

  await setAuthTokens(payload.data);
  return payload.data;
}

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  if (!BACKEND_API_URL) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  const endpointPath = getEndpointPath(path);
  const isPublic = isPublicEndpoint(endpointPath);

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  // Kiểm tra: Nếu KHÔNG phải public endpoint thì mới lấy token và gắn vào Header
  if (!isPublic) {
    const accessToken = await resolveAccessToken(options.accessToken);
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
  }

  const backendUrl = getBackendUrl(path);
  if (!backendUrl) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  let response = await fetch(backendUrl, {
    ...options,
    headers,
  });

  // Refresh token một lần rồi gọi lại request private khi access token hết hạn.
  if (response.status === 401 && !isPublic) {
    const refreshedTokens = await refreshAuthTokens();
    if (refreshedTokens) {
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Accept", "application/json");
      retryHeaders.set("Authorization", `Bearer ${refreshedTokens.accessToken}`);

      response = await fetch(backendUrl, {
        ...options,
        headers: retryHeaders,
      });
    }
  }

  // Xóa phiên khi request private thất bại sau toàn bộ flow xác thực.
  if (!isPublic && (response.status < 200 || response.status >= 300)) {
    await clearAuthTokens();
  }

  let payload = await parseApiResponse<T>(response);

  // Lưu token login vào cookie và chỉ trả thông tin user an toàn về client.
  if (endpointPath === "api/auth/login" && response.ok && payload.data) {
    const authData = payload.data as unknown as AuthResponse;
    if (authData.accessToken && authData.refreshToken) {
      await setAuthTokens({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
      });

      const authenticatedUser = Object.fromEntries(
        Object.entries(authData).filter(
          ([key]) => key !== "accessToken" && key !== "refreshToken",
        ),
      );
      payload = { ...payload, data: authenticatedUser as T };
    }
  }

  return { payload, status: response.status };
}

