import type { Metadata } from "next";

import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies";
import { ReduxProvider } from "@/lib/redux/provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Modern E-Commerce Platform",
  description: "Sàn thương mại điện tử hiện đại kiến trúc Microservices",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Đọc trạng thái token phía server vì cookie xác thực được bảo vệ bằng httpOnly.
  const [accessToken, refreshToken] = await Promise.all([
    getAccessToken(),
    getRefreshToken(),
  ]);

  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface-bg text-main">
        {/* Provider dùng chung cho các client component và RTK Query. */}
        <ReduxProvider hasAuthTokens={Boolean(accessToken || refreshToken)}>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
