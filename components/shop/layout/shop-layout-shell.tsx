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
    <div className={cn(
      "flex bg-slate-50",
      isChatPage
        ? "fixed inset-0 overflow-hidden"
        : "min-h-[calc(100dvh/var(--page-zoom))]",
    )}>
      {/* 1. Responsive Sidebar */}
      <SellerSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* 2. Main Content Area */}
      <div className={cn(
        "flex-1 flex flex-col min-w-0 lg:ml-64",
        !isChatPage && "min-h-[calc((100dvh/var(--page-zoom))-4rem)]",
      )}>
        <SellerTopbar onToggleSidebar={toggleSidebar} />
        <main
          className={cn(
            "flex-1 w-full flex flex-col",
            isChatPage
              ? "min-h-0 p-0 max-w-none overflow-hidden"
              : cn(
                "px-4 pt-4 pb-4 sm:px-6 sm:pt-6 sm:pb-4 lg:px-8 lg:pt-8 lg:pb-4 space-y-6",
                isWideContentPage ? "max-w-none" : "max-w-7xl mx-auto",
              ),
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
