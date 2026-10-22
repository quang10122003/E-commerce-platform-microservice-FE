import { useState } from "react";
import { usePathname } from "next/navigation";

// Quản lý trạng thái mở đóng sidebar của khu vực người bán.
export function useSellerLayout() {
  const pathname = usePathname();
  // Giữ bố cục chat riêng và cho trang chi tiết Flash Sale dùng hết vùng nội dung.
  const isChatPage = pathname === "/shop/chat";
  const isWideContentPage = /^\/shop\/flash-sales\/[^/]+\/(items|register)\/?$/.test(pathname);
  // Lưu trạng thái mở sidebar trên thiết bị nhỏ.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return {
    isChatPage,
    isWideContentPage,
    isSidebarOpen,
    closeSidebar: () => setIsSidebarOpen(false),
    toggleSidebar: () => setIsSidebarOpen((previous) => !previous),
  };
}
