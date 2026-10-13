import { NextResponse, type NextRequest } from "next/server";
import { SESSION_RETURN_PATH_HEADER } from "@/lib/auth/session-refresh-redirect";

// Truyền URL page vào context server; không tin header do browser tự gửi lên.
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(SESSION_RETURN_PATH_HEADER, `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|favicon.ico|robots.txt|sitemap.xml).*)"],
};
