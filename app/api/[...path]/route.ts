import { NextResponse } from "next/server";

import { serverFetch, type ServerFetchOptions } from "@/lib/api/server-client";

type ApiRouteContext = {
  params: Promise<{ path: string[] }>;
};

// Chuyển tiếp request và ủy quyền toàn bộ chính sách cho serverFetch.
async function proxyRequest(request: Request, context: ApiRouteContext) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const endpointPath = `api/${path.join("/")}${requestUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const requestOptions: ServerFetchOptions = {
    cookieMode: "read-write",
    method: request.method,
    headers: request.headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
    signal: request.signal,
    responseMode: request.method === "GET" && request.headers.get("accept")?.includes("text/event-stream") ? "stream" : "json",
  };

  // serverFetch tự quyết định public/private và xử lý refresh token.
  const result = await serverFetch<unknown>(endpointPath, requestOptions);
  const sessionHeaders = result.sessionRefreshed ? { "X-Session-Refreshed": "1" } : undefined;

  // Chuyển tiếp SSE ngay, không đợi đọc hết body hoặc bọc stream thành JSON.
  if (result.stream) {
    return new Response(result.stream.body, { status: result.status, headers: {
      "Content-Type": "text/event-stream", "Cache-Control": "private, no-store, no-transform", "X-Accel-Buffering": "no",
    } });
  }

  // Trả response rỗng đúng chuẩn cho mọi endpoint thành công với mã 204.
  if (result.status === 204) {
    return new NextResponse(null, { status: 204, headers: sessionHeaders });
  }

  return NextResponse.json(result.payload, { status: result.status, headers: sessionHeaders });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
