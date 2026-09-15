import {
  authenticatedRequest,
  loginRequest,
  logoutRequest,
  registerRequest,
} from "@/lib/api/auth-actions";
import {
  AUTH_ENDPOINTS,
  getEndpointPath,
  isPublicEndpoint,
  serverFetch,
  type ServerFetchOptions,
  type ServerFetchResult,
} from "@/lib/api/server-client";

type RequestHandler = (
  endpointPath: string,
  options: ServerFetchOptions,
) => Promise<ServerFetchResult<unknown>>;

// Gọi endpoint công khai qua serverFetch mà không đính kèm access token.
const publicRequest: RequestHandler = (endpointPath, options) =>
  serverFetch<unknown>(endpointPath, { ...options, skipAuth: true });

// Gọi endpoint cần xác thực qua flow refresh token dùng chung.
const privateRequest: RequestHandler = (endpointPath, options) =>
  authenticatedRequest<unknown>(endpointPath, options);

// Tập trung các flow đặc biệt để thêm endpoint mới mà không sửa route handler.
const requestStrategies: Record<string, RequestHandler> = {
  [`POST ${AUTH_ENDPOINTS.LOGIN}`]: (endpointPath, options) =>
    loginRequest<unknown>(endpointPath, options),
  [`POST ${AUTH_ENDPOINTS.REGISTER}`]: (endpointPath, options) =>
    registerRequest<unknown>(endpointPath, options),
  [`POST ${AUTH_ENDPOINTS.LOGOUT}`]: (endpointPath, options) =>
    logoutRequest<unknown>(endpointPath, options),
};

// Chọn flow gọi API theo method và endpoint chuẩn hóa.
export function resolveRequestHandler(
  method: string,
  endpointPath: string,
): RequestHandler {
  const normalizedEndpointPath = getEndpointPath(endpointPath);
  const strategyKey = `${method.toUpperCase()} ${normalizedEndpointPath}`;

  return (
    requestStrategies[strategyKey] ??
    (isPublicEndpoint(normalizedEndpointPath)
      ? publicRequest
      : privateRequest)
  );
}
