import { NextResponse } from "next/server";

import { serverFetch } from "@/lib/api/server-client";

type ApiRouteContext = {
  params: Promise<{ path: string[] }>;
};

// Chuyển tiếp request từ client qua serverFetch đến backend.
async function proxyRequest(request: Request, context: ApiRouteContext) {
  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const endpointPath = `api/${path.join("/")}${requestUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);

  // Route chỉ chuyển tiếp request, toàn bộ logic gọi backend nằm trong serverFetch.
  const result = await serverFetch(endpointPath, {
    method: request.method,
    headers: request.headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  return NextResponse.json(result.payload, { status: result.status });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
