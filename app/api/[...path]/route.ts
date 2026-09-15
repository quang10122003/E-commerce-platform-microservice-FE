import { NextResponse } from "next/server";

import { resolveRequestHandler } from "@/lib/api/request-strategies";
import type { ServerFetchOptions } from "@/lib/api/server-client";

type ApiRouteContext = {
  params: Promise<{ path: string[] }>;
};

// Chuyển tiếp request từ client qua serverFetch đến backend.
async function proxyRequest(request: Request, context: ApiRouteContext) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const endpointPath = `api/${path.join("/")}${requestUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const requestOptions: ServerFetchOptions = {
    method: request.method,
    headers: request.headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  };

  // Chọn strategy để route chỉ tập trung nhận request và trả response.
  const requestHandler = resolveRequestHandler(request.method, endpointPath);
  const result = await requestHandler(endpointPath, requestOptions);

  // Trả response rỗng đúng chuẩn cho mọi endpoint thành công với mã 204.
  if (result.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  return NextResponse.json(result.payload, { status: result.status });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
