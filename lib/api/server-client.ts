import "server-only";

import { cookies } from "next/headers";

import type { ApiResponse } from "@/types/common";

const backendApiUrl = process.env.BACKEND_API_URL;
const accessTokenCookieName = process.env.ACCESS_TOKEN_COOKIE_NAME ?? "access_token";

type ServerFetchOptions = RequestInit & {
  accessToken?: string;
};

// Gọi trực tiếp backend từ Server Component hoặc server-side function.
export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<ApiResponse<T>> {
  if (!backendApiUrl) {
    throw new Error("Thiếu biến môi trường BACKEND_API_URL");
  }

  const cookieStore = await cookies();
  const accessToken =
    options.accessToken ?? cookieStore.get(accessTokenCookieName)?.value;
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(new URL(path, backendApiUrl), {
    ...options,
    headers,
  });

  return response.json() as Promise<ApiResponse<T>>;
}
