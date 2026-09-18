import "server-only";

import {
  AUTH_TOKEN_FIELDS,
  isPublicEndpoint,
} from "@/lib/api/public-endpoints";
import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/common";
import type {
  AuthResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/types/auth";

const DEFAULT_TIMEOUT_MS = 15_000;
const BACKEND_API_URL = process.env.BACKEND_API_URL;
const LOGIN_ENDPOINT = "api/auth/login";
const REGISTER_ENDPOINT = "api/auth/register";
const REFRESH_TOKEN_ENDPOINT = "api/auth/refresh_token";
const LOGOUT_ENDPOINT = "api/auth/logout";

export type ServerFetchRequestContext = {
  url: string;
  options: ServerFetchOptions;
  headers: Headers;
};

export type ServerFetchUnauthorizedContext = {
  backendUrl: string;
  endpointPath: string;
};

export type ServerFetchOptions = RequestInit & {
  accessToken?: string;
  skipAuth?: boolean;
  timeoutMs?: number;
};

export type ServerFetchResult<T> = {
  payload: ApiResponse<T>;
  status: number;
};

// Dùng một promise chung để nhiều request 401 chỉ refresh token một lần.
let refreshPromise: Promise<string | undefined> | null = null;

// Chuẩn hóa path loại bỏ query string và dấu gạch chéo thừa ở 2 đầu.
export function getEndpointPath(path: string): string {
  return path.split("?", 1)[0].replace(/^\/+|\/+$/g, "");
}

// Ghép baseUrl backend với endpoint path bắt đầu bằng api/.
export function getBackendUrl(path: string): string | undefined {
  const baseUrl = BACKEND_API_URL?.replace(/\/+$/, "");
  const endpointPath = path.replace(/^\/+/, "");
  if (!baseUrl) return undefined;
  if (!endpointPath.startsWith("api/")) {
    throw new Error("serverFetch yêu cầu endpoint bắt đầu bằng api/");
  }
  return `${baseUrl}/${endpointPath}`;
}

// Đọc response an toàn khi backend trả body rỗng hoặc định dạng không phải JSON.
export async function parseApiResponse<T>(
  response: Response,
): Promise<ApiResponse<T>> {
  const responseText = await response.text();

  if (!responseText.trim()) {
    return {
      success: response.ok,
      message: response.ok
        ? "Backend không trả về nội dung."
        : `Backend trả về HTTP ${response.status}.`,
      data: null,
      error: null,
      timestamp: new Date().toISOString(),
    };
  }

  try {
    return JSON.parse(responseText) as ApiResponse<T>;
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Backend trả về JSON không hợp lệ.", {
        error,
        status: response.status,
        url: response.url,
      });
    }

    return {
      success: false,
      message: "Backend trả về dữ liệu không hợp lệ.",
      data: null,
      error: null,
      timestamp: new Date().toISOString(),
    };
  }
}

// Tạo headers theo chính sách public/private do serverFetch điều phối.
export function buildAuthHeaders(
  options: ServerFetchOptions,
  token: string | undefined,
  skipAuth: boolean,
): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.delete("Authorization");

  if (!skipAuth && token) {
    headers.set("Authorization", "Bearer " + token);
  }

  return headers;
}

// Thực hiện fetch kèm timeout và lắng nghe AbortSignal từ caller.
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error("Request timeout sau " + timeoutMs + "ms."));
  }, timeoutMs);

  const abortHandler = () => controller.abort(options.signal?.reason);
  if (options.signal?.aborted) {
    controller.abort(options.signal.reason);
  }
  options.signal?.addEventListener("abort", abortHandler, { once: true });

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortHandler);
  }
}

// Refresh token trong serverFetch và cập nhật lại cookie httpOnly.
async function refreshAccessToken(): Promise<string | undefined> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return undefined;

  const requestBody: RefreshTokenRequest = { refreshToken };
  const result = await serverFetch<RefreshTokenResponse>(
    REFRESH_TOKEN_ENDPOINT,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      skipAuth: true,
    },
  );

  if (
    result.status < 200 ||
    result.status >= 300 ||
    !result.payload.success ||
    !result.payload.data
  ) {
    return undefined;
  }

  await setAuthTokens(result.payload.data);
  return result.payload.data.accessToken;
}

// Điều phối refresh token theo cơ chế single-flight.
function refreshAccessTokenSingleFlight(): Promise<string | undefined> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

// Lưu token sau login/register và loại token khỏi dữ liệu trả về client.
async function handleAuthResponse<T>(
  endpointPath: string,
  response: Response,
  payload: ApiResponse<T>,
): Promise<ApiResponse<T>> {
  const isAuthEndpoint =
    endpointPath === LOGIN_ENDPOINT ||
    endpointPath === REGISTER_ENDPOINT;

  if (!isAuthEndpoint || !response.ok || !payload.data) {
    return payload;
  }

  const authData = payload.data as unknown as AuthResponse;
  const accessToken = authData[AUTH_TOKEN_FIELDS.ACCESS_TOKEN];
  const refreshToken = authData[AUTH_TOKEN_FIELDS.REFRESH_TOKEN];

  if (!accessToken || !refreshToken) {
    return payload;
  }

  await setAuthTokens({ accessToken, refreshToken });

  const authenticatedUser = Object.fromEntries(
    Object.entries(authData).filter(
      ([key]) =>
        key !== AUTH_TOKEN_FIELDS.ACCESS_TOKEN &&
        key !== AUTH_TOKEN_FIELDS.REFRESH_TOKEN,
    ),
  );

  return { ...payload, data: authenticatedUser as T };
}

// Tạo lại body logout từ token trong cookie và herder cho logout
async function prepareLogoutRequest(
  options: ServerFetchOptions,
): Promise<Pick<ServerFetchOptions, "headers" | "body">> {
  const requestBody: LogoutRequest = {
    refreshToken: (await getRefreshToken()) ?? "",
    accessToken: (await getAccessToken()) ?? "",
  };
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  headers.set("Content-Type", "application/json");
  headers.delete("content-length");
  headers.delete("transfer-encoding");

  return {
    headers,
    body: JSON.stringify(requestBody),
  };
}

// Hàm base duy nhất điều phối public/private, token, refresh và response auth.
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  const endpointPath = getEndpointPath(path);
  const backendUrl = getBackendUrl(path);

  if (!backendUrl) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  const isPublic = isPublicEndpoint(endpointPath);
  const skipAuth = options.skipAuth ?? isPublic;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const token = skipAuth
    ? undefined
    : options.accessToken ?? (await getAccessToken());
  const isLogoutRequest =
    endpointPath === LOGOUT_ENDPOINT &&
    (options.method ?? "GET").toUpperCase() === "POST";

  let requestOptions: ServerFetchOptions = { ...options };
  if (isLogoutRequest) {
    requestOptions = {
      ...options,
      ...(await prepareLogoutRequest(options)),
    };
  }

  const headers = buildAuthHeaders(requestOptions, token, skipAuth);
  let response = await fetchWithTimeout(
    backendUrl,
    {
      ...requestOptions,
      headers,
      body: requestOptions.body,
    },
    timeoutMs,
  );

  // Private request 401 sẽ refresh token rồi thử lại đúng một lần.
  if (response.status === 401 && !skipAuth) {
    const refreshedAccessToken = await refreshAccessTokenSingleFlight();

    if (!refreshedAccessToken) {
      await clearAuthTokens();
    } else {
      const retryHeaders = buildAuthHeaders(
        requestOptions,
        refreshedAccessToken,
        false,
      );
      response = await fetchWithTimeout(
        backendUrl,
        {
          ...requestOptions,
          headers: retryHeaders,
          body: requestOptions.body,
        },
        timeoutMs,
      );

      if (response.status === 401) {
        await clearAuthTokens();
      }
    }
  }

  const payload = await parseApiResponse<T>(response);
  const normalizedPayload = await handleAuthResponse(
    endpointPath,
    response,
    payload,
  );

  if (isLogoutRequest) {
    await clearAuthTokens();
  }

  return { payload: normalizedPayload, status: response.status };
}