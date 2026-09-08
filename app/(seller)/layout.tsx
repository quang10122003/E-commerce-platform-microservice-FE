"use client";

import React from "react";
import { SellerSidebar } from "@/components/seller/seller-sidebar";
import { SellerTopbar } from "@/components/seller/seller-topbar";
import { useSellerLayout } from "@/hooks/useSellerLayout";

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { closeSidebar, isSidebarOpen, toggleSidebar } = useSellerLayout();

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* 1. Responsive Sidebar */}
      <SellerSidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SellerTopbar onToggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
