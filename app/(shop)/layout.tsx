import React from "react";
import { ShopHeader } from "@/components/shop/header";
import { ShopFooter } from "@/components/shop/footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-surface-bg">
      <ShopHeader />
      {/* Khung nội dung chính mở rộng max-w-[1440px] giúp giảm khoảng trống 2 bên trên màn hình PC. */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}

