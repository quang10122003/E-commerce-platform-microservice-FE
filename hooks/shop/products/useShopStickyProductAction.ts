import { useEffect, useRef, useState } from "react";

// Chuyển thao tác lên navbar khi vị trí gốc đã cuộn khỏi vùng hiển thị.
export function useShopStickyProductAction() {
  const anchorRef = useRef<HTMLDivElement>(null);
  // Lưu vùng navbar nhận nút khi nút gốc nằm phía trên navbar.
  const [navbarTarget, setNavbarTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const anchor = anchorRef.current;
    const slot = document.getElementById("shop-navbar-actions");
    if (!anchor || !slot) return;

    // Chừa chiều cao navbar 64px và giữ vị trí gốc để tránh nhảy layout.
    const observer = new IntersectionObserver(([entry]) => {
      setNavbarTarget(!entry.isIntersecting && entry.boundingClientRect.top < 64 ? slot : null);
    }, { rootMargin: "-64px 0px 0px 0px" });

    observer.observe(anchor);
    return () => observer.disconnect();
  }, []);

  return { anchorRef, navbarTarget };
}
