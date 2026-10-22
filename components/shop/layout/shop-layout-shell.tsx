"use client";

import React from "react";
import { SellerSidebar } from "@/components/shop/layout/shop-sidebar";
import { SellerTopbar } from "@/components/shop/layout/shop-topbar";
import { useSellerLayout } from "@/hooks/shop/layout/useShopLayout";
import { cn } from "@/lib/utils";

export function SellerLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { closeSidebar, isSidebarOpen, toggleSidebar, isChatPage, isWideContentPage } = useSellerLayout();

  return (
    <div className={cn("flex bg-slate-50", isChatPage ? "fixed inset-0 overflow-hidden" : "min-h-screen")}>
      {/* 1. Responsive Sidebar */}
      <SellerSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 h-full">
        <SellerTopbar onToggleSidebar={toggleSidebar} />
        <main
          className={cn(
            "flex-1 w-full",
            isChatPage
              ? "min-h-0 p-0 max-w-none overflow-hidden"
              : cn("p-4 sm:p-6 lg:p-8 space-y-6", isWideContentPage ? "max-w-none" : "max-w-7xl mx-auto"),
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
