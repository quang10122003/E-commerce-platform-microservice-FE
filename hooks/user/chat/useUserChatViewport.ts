import { useEffect, useRef } from "react";

// Căn chiều cao khung chat theo vùng hiển thị mà không thay đổi layout chung.
export function useUserChatViewport() {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chat = chatRef.current;
    const container = chat?.parentElement;
    if (!chat || !container) return;

    let frameId = 0;

    // Quy đổi kích thước hiển thị về CSS pixel để giữ đúng tỷ lệ zoom của dự án.
    const updateHeight = () => {
      const bounds = chat.getBoundingClientRect();
      const scale = bounds.width / chat.offsetWidth || 1;
      const documentTop = bounds.top + window.scrollY;
      const bottomPadding = parseFloat(getComputedStyle(container).paddingBottom) || 0;
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const height = Math.max(0, (viewportHeight - documentTop) / scale - bottomPadding);

      chat.style.setProperty("--user-chat-height", `${height}px`);
    };

    // Gom thay đổi kích thước vào một frame, tránh ghi style trong callback ResizeObserver.
    const scheduleUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateHeight);
    };

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(container);
    if (container.parentElement) observer.observe(container.parentElement);
    window.addEventListener("resize", scheduleUpdate);
    window.visualViewport?.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", scheduleUpdate);
      window.visualViewport?.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return chatRef;
}
