import type { Metadata } from "next";

import { ReduxProvider } from "@/lib/redux/provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Modern E-Commerce Platform",
  description: "Sàn thương mại điện tử hiện đại kiến trúc Microservices",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface-bg text-main">
        {/* Provider dùng chung cho các client component và RTK Query. */}
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
