import { NextResponse, type NextRequest } from "next/server";
import { SESSION_RETURN_PATH_HEADER } from "@/lib/auth/session-refresh-redirect";
import { AUTH_COOKIE_NAMES } from "@/lib/constants";
import { readRoleCookie, ROLE_COOKIE_NAME } from "@/lib/auth/role-cookie";
import { getRouteAccess } from "@/lib/auth/route-access";
import { getRequestOrigin } from "@/lib/utils/request-origin.utils";

// Truyền URL page vào context server; không tin header do browser tự gửi lên.
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const access = getRouteAccess(pathname);
  const isProtectedRoute = access !== "public";
  const returnPath = `${pathname}${request.nextUrl.search}`;

  // Không cache kết quả phân quyền khi người dùng đổi phiên đăng nhập.
  const finish = (response: NextResponse) => {
    if (isProtectedRoute) response.headers.set("Cache-Control", "private, no-store");
    return response;
  };

  if (isProtectedRoute) {
    const origin = getRequestOrigin(request);
    const loginUrl = new URL("/", origin);
    loginUrl.searchParams.set("login", "required");
    loginUrl.searchParams.set("next", returnPath);
    const accessToken = request.cookies.get(process.env.ACCESS_TOKEN_COOKIE_NAME ?? AUTH_COOKIE_NAMES.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(process.env.REFRESH_TOKEN_COOKIE_NAME ?? AUTH_COOKIE_NAMES.REFRESH_TOKEN)?.value;
    if (!accessToken && !refreshToken) return finish(NextResponse.redirect(loginUrl));

    const session = readRoleCookie(request.cookies.get(ROLE_COOKIE_NAME)?.value, accessToken);
    if (!session) {
      // Chỉ kiểm tra lại phiên khi cookie quyền thiếu, hết hạn hoặc không còn khớp token.
      const recoveryUrl = new URL("/api/auth/session", origin);
      recoveryUrl.searchParams.set("next", returnPath);
      return finish(NextResponse.redirect(recoveryUrl));
    }
    if (access === "shop" && !session.role.includes("ROLE_SHOP")) {
      return finish(NextResponse.redirect(new URL("/403", origin)));
    }
  }

  const headers = new Headers(request.headers);
  headers.set(SESSION_RETURN_PATH_HEADER, returnPath);
  return finish(NextResponse.next({ request: { headers } }));
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|favicon.ico|robots.txt|sitemap.xml).*)"],
};
