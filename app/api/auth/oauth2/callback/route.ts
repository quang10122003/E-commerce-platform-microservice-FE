import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server-client";
import { getRequestOrigin } from "@/lib/utils/request-origin.utils";
import type { AuthenticatedUser } from "@/types/shared/auth";

// BE chỉ gửi mã dùng một lần qua URL; đổi mã lấy token tại server để token chỉ nằm trong cookie httpOnly.
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  let errorCode = url.searchParams.get("error") ?? (code ? null : "OAUTH_LOGIN_FAILED");

  if (code) {
    try {
      const result = await serverFetch<AuthenticatedUser>("api/auth/oauth2/exchange", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
        cache: "no-store",
        cookieMode: "read-write",
      });
      if (!(result.status < 300 && result.payload.success)) errorCode = result.payload.error?.code ?? "OAUTH_LOGIN_FAILED";
    } catch {
      errorCode = "OAUTH_LOGIN_FAILED";
    }
  }

  const destination = new URL("/", getRequestOrigin(request));
  if (errorCode) {
    destination.searchParams.set("login", "required");
    destination.searchParams.set("oauth_error", errorCode);
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
