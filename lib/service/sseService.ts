// Chỉ kết nối BFF cùng origin để cookie httpOnly và serverFetch tiếp tục quản lý phiên.
export function connectSse(url: string): EventSource {
  if (!url.startsWith("/api/") || url.includes("\\")) throw new Error("SSE phải sử dụng BFF nội bộ.");
  return new EventSource(url, { withCredentials: true });
}
