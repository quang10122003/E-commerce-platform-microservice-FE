import { NextResponse } from "next/server";

// Trình duyệt phải tự đi tới Gateway để BE giữ state OAuth trong cookie phiên của chính nó.
export function GET() {
  const backendUrl = (process.env.BACKEND_PUBLIC_URL ?? process.env.BACKEND_API_URL)?.replace(/\/+$/, "");
  if (!backendUrl) {
    return NextResponse.json({ success: false, message: "Thiếu cấu hình URL backend." }, { status: 500 });
  }
  return NextResponse.redirect(`${backendUrl}/api/auth/oauth2/authorize/google`, 302);
}
