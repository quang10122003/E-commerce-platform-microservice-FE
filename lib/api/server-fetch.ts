import { AUTHORIZATION_HEADER, HTTP_STATUS, DEFAULT_TIMEOUT_MS } from "@/lib/constants";
import "server-only";
import { createHash } from "node:crypto";
import { redirect } from "next/navigation";
import { headers as requestHeaders } from "next/headers";
import { normalizeSessionReturnPath, SESSION_RETURN_PATH_HEADER } from "@/lib/auth/session-refresh-redirect";
import { isUserLocked } from "@/lib/auth/session-recovery-error";

import {
  AUTH_TOKEN_FIELDS,
  isPublicEndpoint,
} from "@/lib/api/public-endpoints";
import {
  clearAuthTokens,
  getAccessToken,
  getSessionRefreshAttempt,
  getRefreshToken,
  setAuthTokens,
  setAuthRole,
} from "@/lib/auth/cookies";
import type { ApiResponse } from "@/types/shared/api";
import type {
  AuthResponse,
  LogoutRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  AccessTokenValidationResponse,
} from "@/types/shared/auth";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

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
  cookieMode?: "read-only" | "read-write";
  skipAuth?: boolean;
  timeoutMs?: number;
  responseMode?: "json" | "stream";
  refreshSession?: boolean;
};

export type ServerFetchResult<T> = {
  payload: ApiResponse<T>;
  status: number;
  stream?: Response;
  sessionRefreshed?: boolean;
};

// Chỉ chia sẻ kết quả refresh giữa request cùng phiên; không chia sẻ token giữa người dùng.
const refreshPromises = new Map<string, Promise<RefreshTokenResponse | ServerFetchResult<RefreshTokenResponse> | undefined>>();

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
        : `Response body rỗng (HTTP ${response.status}).`,
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

// Ghi log response lỗi từ backend, không ghi token hoặc dữ liệu request.
function logBackendError(
  endpointPath: string,
  method: string,
  status: number,
  payload: ApiResponse<unknown>,
): void {
  if (status >= HTTP_STATUS.SUCCESS_MIN && status < HTTP_STATUS.SUCCESS_LIMIT && payload.success) {
    return;
  }

  console.error("Backend trả về lỗi trong serverFetch. " + JSON.stringify({
    endpoint: endpointPath,
    method,
    status,
    code: payload.error?.code,
    message: payload.error?.message ?? payload.message,
  }));
}

// Tạo headers theo chính sách public/private do serverFetch điều phối.
export function buildAuthHeaders(
  options: ServerFetchOptions,
  token: string | undefined,
  skipAuth: boolean,
): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", options.responseMode === "stream" ? "text/event-stream" : "application/json");
  headers.delete(AUTHORIZATION_HEADER);

  if (!skipAuth && token) {
    headers.set(AUTHORIZATION_HEADER, "Bearer " + token);
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
  } catch (cause) {
    // Log lỗi kết nối một lần bằng logger chung, không đưa headers/token vào log.
    const message = controller.signal.aborted ? "Request backend bị hủy hoặc hết thời gian chờ." : "Không thể kết nối backend.";
    logBackendError(getEndpointPath(new URL(url).pathname), (options.method ?? "GET").toUpperCase(), 502, {
      success: false, data: null, message,
      error: { code: controller.signal.aborted ? "REQUEST_ABORTED" : "NETWORK_ERROR", message },
      timestamp: new Date().toISOString(),
    });
    throw cause;
  } finally {
    clearTimeout(timeoutId);
    options.signal?.removeEventListener("abort", abortHandler);
  }
}

// Kiểm tra cặp token trước khi ghi cookie, không chấp nhận response sai cấu trúc.
function isValidTokenPair(value: unknown): value is RefreshTokenResponse {
  return typeof value === "object" && value !== null
    && "accessToken" in value && typeof value.accessToken === "string" && value.accessToken.length > 0
    && "refreshToken" in value && typeof value.refreshToken === "string" && value.refreshToken.length > 0;
}

// Refresh token trong serverFetch; response Route Handler chịu trách nhiệm ghi cookie của từng request.
async function refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse | ServerFetchResult<RefreshTokenResponse> | undefined> {

  const requestBody: RefreshTokenRequest = { refreshToken };
  const result = await serverFetch<RefreshTokenResponse>(
    "api/auth/refresh_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      skipAuth: true,
    },
  );

  if (isUserLocked(result.payload)) return result;
  if ([400, HTTP_STATUS.UNAUTHORIZED, 403].includes(result.status)) return undefined;
  if (result.status < HTTP_STATUS.SUCCESS_MIN || result.status >= HTTP_STATUS.SUCCESS_LIMIT
    || !result.payload.success || !isValidTokenPair(result.payload.data)) {
    throw new Error("Dịch vụ khôi phục phiên tạm thời không khả dụng hoặc trả dữ liệu không hợp lệ.");
  }
  return result.payload.data;
}

// Single-flight theo hash refresh token; từng response tự ghi cookie trong context của nó.
async function refreshAccessTokenSingleFlight(): Promise<RefreshTokenResponse | ServerFetchResult<RefreshTokenResponse> | undefined> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return undefined;
  const key = createHash("sha256").update(refreshToken).digest("hex");
  let pending = refreshPromises.get(key);
  if (!pending) {
    pending = refreshAccessToken(refreshToken).then((tokens) => {
      if (!tokens || "payload" in tokens) {
        refreshPromises.delete(key);
      } else {
        // Giữ kết quả rất ngắn để request 401 đến muộn không refresh lại token vừa được rotate.
        const cleanup = setTimeout(() => refreshPromises.delete(key), 5_000);
        cleanup.unref();
      }
      return tokens;
    }).catch((cause) => {
      refreshPromises.delete(key);
      throw cause;
    });
    refreshPromises.set(key, pending);
  }
  return pending;
}
// Lưu token sau login/register và loại token khỏi dữ liệu trả về client.
async function handleAuthResponse<T>(
  endpointPath: string,
  response: Response,
  payload: ApiResponse<T>,
): Promise<ApiResponse<T>> {
  const isAuthEndpoint =
    endpointPath === "api/auth/login" ||
    endpointPath === "api/auth/register";

  if (!isAuthEndpoint || !response.ok || !payload.success || !payload.data) {
    return payload;
  }

  const authData = payload.data as unknown as AuthResponse;
  const accessToken = authData[AUTH_TOKEN_FIELDS.ACCESS_TOKEN];
  const refreshToken = authData[AUTH_TOKEN_FIELDS.REFRESH_TOKEN];

  if (!isValidTokenPair(authData)) {
    throw new Error("Backend trả về dữ liệu xác thực không hợp lệ.");
  }

  await setAuthTokens({ accessToken, refreshToken }, authData);

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
  const { cookieMode = "read-only", skipAuth: internalSkipAuth, timeoutMs = DEFAULT_TIMEOUT_MS, responseMode = "json", refreshSession = false, ...fetchOptions } = options;
  const endpointPath = getEndpointPath(path);
  const backendUrl = getBackendUrl(path);

  if (!backendUrl) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  // Các thao tác thay đổi phiên chỉ được thực hiện trong context được phép ghi cookie.
  if (cookieMode === "read-only" && ["api/auth/login", "api/auth/register", "api/auth/logout"].includes(endpointPath)) {
    throw new Error("Thao tác xác thực phải được gọi qua Route Handler hoặc Server Action.");
  }
  const isPublic = isPublicEndpoint(endpointPath, options.method);
  const skipAuth = internalSkipAuth ?? isPublic;
  const token = skipAuth
    ? undefined
    : await getAccessToken();
  const isLogoutRequest =
    endpointPath === "api/auth/logout" &&
    (options.method ?? "GET").toUpperCase() === "POST";

  let requestOptions: ServerFetchOptions = { ...fetchOptions };
  if (isLogoutRequest) {
    requestOptions = {
      ...fetchOptions,
      ...(await prepareLogoutRequest(fetchOptions)),
    };
  }

  // Refresh được gọi từ BFF chỉ đọc token từ cookie, không nhận token do client truyền lên.
  if (endpointPath === "api/auth/refresh_token" && cookieMode === "read-write") {
    requestOptions.body = JSON.stringify({ refreshToken: (await getRefreshToken()) ?? "" });
    const refreshHeaders = new Headers(requestOptions.headers);
    refreshHeaders.set("Content-Type", "application/json");
    refreshHeaders.delete("content-length");
    requestOptions.headers = refreshHeaders;
  }
  const headers = buildAuthHeaders({ ...requestOptions, responseMode }, token, skipAuth);
  let response = await fetchWithTimeout(
    backendUrl,
    {
      ...requestOptions,
      headers,
      body: requestOptions.body,
    },
    timeoutMs,
  );

  let sessionRefreshed = false;
  const initialError = !response.ok ? await parseApiResponse<T>(response.clone()) : undefined;
  // Khóa tài khoản phải kết thúc phiên trước khi cân nhắc refresh.
  if (initialError && isUserLocked(initialError)) {
    logBackendError(endpointPath, (options.method ?? "GET").toUpperCase(), response.status, initialError);
    if (cookieMode === "read-only" && !skipAuth) {
      const nextPath = normalizeSessionReturnPath((await requestHeaders()).get(SESSION_RETURN_PATH_HEADER));
      redirect(`/api/auth/session?next=${encodeURIComponent(nextPath)}`);
    }
    if (cookieMode === "read-write") await clearAuthTokens();
    return { payload: initialError, status: response.status };
  }

  // Private 401/403 chỉ phục hồi một lần; lỗi khóa không đi qua nhánh này.
  if ((response.status === HTTP_STATUS.UNAUTHORIZED || response.status === 403 || refreshSession) && !skipAuth) {
    if (cookieMode === "read-only") {
      if (await getRefreshToken()) {
        const attempt = await getSessionRefreshAttempt(token);
        if (attempt === "failed") throw new Error("Dịch vụ khôi phục phiên tạm thời không khả dụng. Vui lòng thử lại.");
        // Không refresh trong render; dấu vết cùng token chặn lặp khi retry vẫn 401.
        if (!attempt) {
          const nextPath = normalizeSessionReturnPath((await requestHeaders()).get(SESSION_RETURN_PATH_HEADER));
          redirect(`/api/auth/session?next=${encodeURIComponent(nextPath)}${response.status === 403 ? "&refresh=1" : ""}`);
        }
      }
      const payload = await parseApiResponse<T>(response);
      logBackendError(endpointPath, (options.method ?? "GET").toUpperCase(), response.status, payload);
      return { payload, status: response.status };
    }
    const refreshedTokens = await refreshAccessTokenSingleFlight();

    if (refreshedTokens && "payload" in refreshedTokens) {
      await clearAuthTokens();
      return { payload: { ...refreshedTokens.payload, data: null }, status: refreshedTokens.status };
    } else if (!refreshedTokens) {
      await clearAuthTokens();
      return { status: 401, payload: { success: false, data: null, message: "Phiên đăng nhập đã kết thúc.", error: { code: "UNAUTHORIZED", message: "Vui lòng đăng nhập lại." }, timestamp: new Date().toISOString() } };
    } else {
      await setAuthTokens(refreshedTokens);
      sessionRefreshed = true;
      const retryHeaders = buildAuthHeaders(
        { ...requestOptions, responseMode },
        refreshedTokens.accessToken,
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

      if (response.status === HTTP_STATUS.UNAUTHORIZED) {
        await clearAuthTokens();
      }
    }
  }

  // Giữ nguyên stream sau khi orchestrator đã xử lý xác thực và refresh nếu cần.
  if (responseMode === "stream" && response.ok && response.headers.get("content-type")?.includes("text/event-stream")) {
    return { status: response.status, stream: response, sessionRefreshed, payload: { success: true, data: null, message: "Đã kết nối SSE.", error: null, timestamp: new Date().toISOString() } };
  }
  const payload = await parseApiResponse<T>(response);
  if (cookieMode === "read-write" && isUserLocked(payload)) await clearAuthTokens();
  logBackendError(
    endpointPath,
    (options.method ?? "GET").toUpperCase(),
    response.status,
    payload,
  );
  // Không để endpoint refresh công khai trả token xuống client qua BFF.
  if (endpointPath === "api/auth/refresh_token" && cookieMode === "read-write") {
    if (response.ok && payload.success && isValidTokenPair(payload.data)) {
      await setAuthTokens(payload.data as unknown as RefreshTokenResponse);
    } else if (response.status === HTTP_STATUS.UNAUTHORIZED || response.status === 400 || response.status === 403) {
      await clearAuthTokens();
    }
    return { payload: { ...payload, data: null }, status: response.status, sessionRefreshed: response.ok && payload.success };
  }
  const normalizedPayload = await handleAuthResponse(
    endpointPath,
    response,
    payload,
  );

  if (endpointPath === "api/auth/check_token" && cookieMode === "read-write"
    && response.ok && payload.success && payload.data) {
    await setAuthRole(payload.data as unknown as AccessTokenValidationResponse);
  }

  if (isLogoutRequest) {
    await clearAuthTokens();
  }

  return { payload: normalizedPayload, status: response.status, sessionRefreshed };
}
