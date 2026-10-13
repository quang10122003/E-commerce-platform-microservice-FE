// Header nội bộ được Proxy ghi đè để giữ đúng pathname và query của page.
export const SESSION_RETURN_PATH_HEADER = "x-session-return-path";

// Chỉ chấp nhận page nội bộ, tránh redirect ra ngoài hoặc quay lại API refresh.
export function normalizeSessionReturnPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u0020]/.test(value)) return "/";
  const url = new URL(value, "http://session.local");
  if (url.origin !== "http://session.local" || /^\/(api|_next)(\/|$)/.test(url.pathname)) return "/";
  try {
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(pathname) || /^\/(api|_next)(\/|$)/.test(pathname)) return "/";
  } catch {
    return "/";
  }
  return `${url.pathname}${url.search}`;
}
