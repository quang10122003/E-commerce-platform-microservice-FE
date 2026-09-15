import "server-only";

import { AUTHORIZATION_HEADER } from "@/lib/api/public-endpoints";
import type { ApiResponse } from "@/types/common";

const DEFAULT_TIMEOUT_MS = 15_000;
const BACKEND_API_URL = process.env.BACKEND_API_URL;

// Type định nghĩa context request gửi đi
export type ServerFetchRequestContext = {
  url: string;
  options: ServerFetchOptions;
  headers: Headers;
};

// Type định nghĩa context khi gặp mã lỗi 401 Unauthorized
export type ServerFetchUnauthorizedContext = {
  backendUrl: string;
  endpointPath: string;
};

// Type options mở rộng cho serverFetch với các lifecycle hooks
export type ServerFetchOptions = RequestInit & {
  accessToken?: string;
  skipAuth?: boolean;
  timeoutMs?: number;
  onBeforeRequest?: (
    context: ServerFetchRequestContext,
  ) => Promise<Response | void>;
  onAfterResponse?: <T>(
    response: Response,
    payload: ApiResponse<T>,
  ) => Promise<ApiResponse<T>>;
  onUnauthorized?: (
    context: ServerFetchUnauthorizedContext,
  ) => Promise<string | undefined>;
  onAuthFailure?: () => Promise<void>;
};

// Type kết quả trả về từ serverFetch gồm payload ApiResponse và HTTP status code
export type ServerFetchResult<T> = {
  payload: ApiResponse<T>;
  status: number;
};

// Chuẩn hóa path loại bỏ query string và dấu gạch chéo thừa ở 2 đầu
export function getEndpointPath(path: string): string {
  return path.split("?", 1)[0].replace(/^\/+|\/+$/g, "");
}

// Ghép baseUrl backend với endpoint path bắt đầu bằng 'api/'
export function getBackendUrl(path: string): string | undefined {
  const baseUrl = BACKEND_API_URL?.replace(/\/+$/, "");
  const endpointPath = path.replace(/^\/+/, "");
  if (!baseUrl) return undefined;
  if (!endpointPath.startsWith("api/")) {
    throw new Error("serverFetch yêu cầu endpoint bắt đầu bằng api/");
  }
  return `${baseUrl}/${endpointPath}`;
}

// Đọc response an toàn khi backend trả body rỗng hoặc định dạng không phải JSON
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

// Tạo Headers chuẩn có đính kèm Bearer token hoặc bỏ qua nếu là endpoint public
export function buildAuthHeaders(
  options: ServerFetchOptions,
  token: string | undefined,
  skipAuth: boolean,
): Headers {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (skipAuth) {
    headers.delete(AUTHORIZATION_HEADER);
  } else if (token) {
    headers.set(AUTHORIZATION_HEADER, `Bearer ${token}`);
  }

  return headers;
}

// Thực hiện fetch kèm timeout và lắng nghe AbortSignal từ caller
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort(new Error(`Request timeout sau ${timeoutMs}ms.`));
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

// Hàm fetch API generic dùng trên Server (RSC & BFF Route Handler)
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ServerFetchResult<T>> {
  const endpointPath = getEndpointPath(path);
  const backendUrl = getBackendUrl(path);
  if (!backendUrl) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  const {
    accessToken: explicitAccessToken,
    skipAuth = false,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    onBeforeRequest,
    onAfterResponse,
    onUnauthorized,
    onAuthFailure,
    ...requestOptions
  } = options;
  const headers = buildAuthHeaders(options, explicitAccessToken, skipAuth);
  const requestContext = {
    url: backendUrl,
    options,
    headers,
  } satisfies ServerFetchRequestContext;

  // Cho phép wrapper can thiệp trước khi gửi request thực tế
  const beforeRequestResponse = await onBeforeRequest?.(requestContext);
  let response =
    beforeRequestResponse ??
    (await fetchWithTimeout(
      backendUrl,
      {
        ...requestOptions,
        headers,
      },
      timeoutMs,
    ));

  // Tự động retry khi nhận mã 401 Unauthorized nếu caller có cung cấp hook refresh
  if (response.status === 401 && !skipAuth && onUnauthorized) {
    let refreshedAccessToken: string | undefined;

    try {
      refreshedAccessToken = await onUnauthorized({
        backendUrl,
        endpointPath,
      });
    } catch (error) {
      await onAuthFailure?.();
      throw error;
    }

    if (!refreshedAccessToken) {
      await onAuthFailure?.();
    } else {
      const retryHeaders = buildAuthHeaders(
        options,
        refreshedAccessToken,
        skipAuth,
      );
      response = await fetchWithTimeout(
        backendUrl,
        {
          ...requestOptions,
          headers: retryHeaders,
        },
        timeoutMs,
      );

      // Session không còn hợp lệ nếu retry vẫn bị 401
      if (response.status === 401) {
        await onAuthFailure?.();
      }
    }
  }

  let payload = await parseApiResponse<T>(response);
  if (onAfterResponse) {
    payload = await onAfterResponse(response, payload);
  }

  return { payload, status: response.status };
}
