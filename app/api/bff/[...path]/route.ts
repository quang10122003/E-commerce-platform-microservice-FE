import { NextResponse } from "next/server";

import { getAccessToken } from "@/lib/auth/cookies";

const backendApiUrl = process.env.BACKEND_API_URL;

type BffRouteContext = {
  params: Promise<{ path: string[] }>;
};

// Chuyển tiếp request từ RTK Query qua Next Server đến backend.
async function proxyRequest(request: Request, context: BffRouteContext) {
  if (!backendApiUrl) {
    return NextResponse.json(
      {
        success: false,
        message: "Thiếu cấu hình BACKEND_API_URL",
        data: null,
        error: { code: "BFF_CONFIG_ERROR", message: "Backend API chưa được cấu hình" },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }

  const { path } = await context.params;
  const requestUrl = new URL(request.url);
  const backendUrl = new URL(
    path.join("/"),
    `${backendApiUrl.replace(/\/+$/, "")}/`,
  );

  backendUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  const accessToken = await getAccessToken();

  // Không chuyển cookie của trình duyệt sang backend; chỉ gửi access token cần thiết.
  headers.delete("cookie");
  headers.delete("host");
  headers.delete("authorization");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const hasBody = !["GET", "HEAD"].includes(request.method);
  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    cache: "no-store",
  });

  const responseHeaders = new Headers();
  const contentType = response.headers.get("content-type");

  if (contentType) {
    responseHeaders.set("content-type", contentType);
  }

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
