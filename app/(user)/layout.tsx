import React from "react";
import { ShopHeader } from "@/components/user/header/header";
import { ShopFooter } from "@/components/user/layout/footer";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="user-layout min-h-screen flex flex-col bg-surface-bg [&:has([data-user-chat])>footer]:hidden">
      <ShopHeader />
      {/* Khung nội dung chính mở rộng max-w-[1440px] giúp giảm khoảng trống 2 bên trên màn hình PC. */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {children}
      </main>
      {/* Footer chỉ bị ẩn bằng CSS khi nội dung hiện tại là khung chat. */}
      <ShopFooter />
    </div>
  );
}
