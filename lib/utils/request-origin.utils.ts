// Next standalone ghép request.url từ HOSTNAME (0.0.0.0 trong Docker), nên lấy origin theo Host mà trình duyệt gửi lên.
export function getRequestOrigin(request: Request): string {
  const url = new URL(request.url);
  const host = request.headers.get("host");
  return host ? `${url.protocol}//${host}` : url.origin;
}
