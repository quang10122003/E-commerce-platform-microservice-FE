import type { Metadata } from "next";
import {
  Plus_Jakarta_Sans,
  Lexend,
  JetBrains_Mono,
  Unbounded,
  Playfair_Display,
} from "next/font/google";

import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies";
import { ReduxProvider } from "@/lib/redux/provider";
import { NotificationViewport } from "@/components/ui/notification-viewport";

import "./globals.css";

// Font chính cho văn bản nội dung và form
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

// Font tiêu đề, thương hiệu và các thành phần nhấn mạnh (Heading, Badge, Button)
const lexend = Lexend({
  subsets: ["latin", "vietnamese"],
  variable: "--font-heading",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

// Font nghệ thuật cách tân hiện đại (Futuristic Tech & Mega Sale Display)
const unbounded = Unbounded({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

// Font nghệ thuật thời trang cao cấp (Luxury Editorial Serif)
const playfairDisplay = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-serif",
  display: "swap",
  weight: ["600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Font số liệu, mã đơn hàng, giá tiền và SKU
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  variable: "--font-mono",
  display: "swap",
  weight: ["500", "600", "700"],
});

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
    <html
      lang="vi"
      className={`${plusJakartaSans.variable} ${lexend.variable} ${unbounded.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col bg-surface-bg text-main font-sans">
        {/* Provider dùng chung cho các client component và RTK Query. */}
        <ReduxProvider hasAuthTokens={Boolean(accessToken || refreshToken)}>
          {children}
          {/* Khu vực thông báo nổi dùng chung cho toàn bộ ứng dụng. */}
          <NotificationViewport />
        </ReduxProvider>
      </body>
    </html>
  );
}
