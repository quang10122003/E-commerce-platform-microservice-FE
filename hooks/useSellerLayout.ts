"use client";

import { useState } from "react";

// Quản lý trạng thái mở đóng sidebar của khu vực người bán.
export function useSellerLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return {
    isSidebarOpen,
    closeSidebar: () => setIsSidebarOpen(false),
    toggleSidebar: () => setIsSidebarOpen((previous) => !previous),
  };
}
