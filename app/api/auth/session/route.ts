import { NextResponse } from "next/server";
import { setSessionRefreshAttempt } from "@/lib/auth/cookies";
import { normalizeSessionReturnPath } from "@/lib/auth/session-refresh-redirect";
import { getRouteAccess } from "@/lib/auth/route-access";
import { isUserLocked } from "@/lib/auth/session-recovery-error";
import { serverFetch } from "@/lib/api/server-client";
import type { ApiResponse } from "@/types/shared/api";
import type { AccessTokenValidationResponse } from "@/types/shared/auth";

// Trả lỗi BFF theo cấu trúc API chung, không đưa chi tiết nội bộ xuống client.
function errorResponse(status: number, code: string, message: string) {
  return NextResponse.json({
    success: false, message, data: null, error: { code, message }, timestamp: new Date().toISOString(),
  } satisfies ApiResponse<never>, { status });
}

// Dùng endpoint kiểm tra token sẵn có; serverFetch tự refresh và ghi cookie tại Route Handler.
export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return errorResponse(403, "INVALID_ORIGIN", "Nguồn request không hợp lệ.");
  }
  try {
    const result = await serverFetch<AccessTokenValidationResponse>("api/auth/check_token", {
      method: "GET", cache: "no-store", cookieMode: "read-write",
      refreshSession: request.method === "GET" && new URL(request.url).searchParams.get("refresh") === "1",
    });
    return NextResponse.json(result.payload, { status: result.status });
  } catch {
    return errorResponse(502, "SESSION_RECOVERY_FAILED", "Chưa thể khôi phục phiên. Vui lòng thử lại.");
  }
}

// Server page đi qua cùng flow POST để refresh/ghi cookie rồi trở lại URL ban đầu.
export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  if (request.headers.get("sec-fetch-site") === "cross-site" || (origin && origin !== new URL(request.url).origin)) {
    return errorResponse(403, "INVALID_ORIGIN", "Nguồn request không hợp lệ.");
  }
  const nextPath = normalizeSessionReturnPath(new URL(request.url).searchParams.get("next"));
  const result = await POST(request);
  const payload = await result.json() as ApiResponse<AccessTokenValidationResponse>;
  const locked = isUserLocked(payload);
  if (!locked && ((result.ok && payload.success && payload.data) || result.status === 403)) {
    await setSessionRefreshAttempt("recovered");
  } else if (!locked && result.status !== 401) {
    // Lỗi hạ tầng vẫn giữ token; page hiển thị fallback lỗi thay vì tiếp tục redirect.
    await setSessionRefreshAttempt("failed");
  }
  const destination = new URL(nextPath, request.url);
  if (locked) {
    destination.pathname = "/403";
    destination.search = "?reason=user-locked";
  } else if (result.status === 403) {
    destination.pathname = "/403";
    destination.search = "";
  } else if (getRouteAccess(destination.pathname) !== "public" && !(result.ok && payload.success && payload.data)) {
    // Không trả lại route được bảo vệ khi recovery thất bại, tránh vòng lặp Proxy.
    if (result.status !== 401) return errorResponse(503, "SESSION_RECOVERY_FAILED", "Chưa thể kiểm tra phiên. Vui lòng thử lại.");
    destination.pathname = "/";
    destination.search = "";
    destination.searchParams.set("login", "required");
    destination.searchParams.set("next", nextPath);
  }
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "no-store");
  return response;
}
