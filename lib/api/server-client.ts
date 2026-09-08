import "server-only";

import { cookies } from "next/headers";

import type { ApiResponse } from "@/types/common";

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const ACCESS_TOKEN_COOKIE_NAME =
  process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";

/**
 * Danh sách mảng String các endpoint public (không cần dùng token khi gửi request)
 */
export const PUBLIC_ENDPOINTS: string[] = [
  "auth/login",
  "auth/register",
  "auth/forgot-password",
  "auth/refresh-token",
];

type ServerFetchOptions = RequestInit & {
  accessToken?: string;
};

export type ServerFetchResult<T> = {
  payload: ApiResponse<T>;
  status: number;
};

/**
 * Chuẩn hoá path để so sánh với PUBLIC_ENDPOINTS.
 * - Bỏ query string (chỉ giữ phần trước dấu "?").
 * - Bỏ dấu "/" ở đầu và cuối, ví dụ "/auth/login/" -> "auth/login".
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

  const backendUrl = `${BACKEND_API_URL.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
  const response = await fetch(backendUrl, {
    ...options,
    headers,
  });
  const payload = (await response.json()) as ApiResponse<T>;

  return { payload, status: response.status };
}

