"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface ChatHistoryScrollOptions {
  visible?: boolean;
  reverse?: boolean;
}

// Giữ vị trí đọc tin cũ; chỉ tự bám đáy nếu người dùng đang ở cuối lịch sử.
export function useChatHistoryScroll(messageCount: number, { visible = true, reverse = false }: ChatHistoryScrollOptions = {}) {
  const historyRef = useRef<HTMLDivElement>(null);
  const historyContentRef = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);
  const currentCount = useRef(messageCount);
  const observedCount = useRef(messageCount);
  // Đánh dấu có tin mới đến trong lúc người dùng đang xem phần lịch sử phía trên.
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Hỗ trợ cả vùng cuộn thường và flex-col-reverse đang có ở hộp thư shop.
  const writeBottom = useCallback(() => {
    const viewport = historyRef.current;
    if (viewport) viewport.scrollTop = reverse ? 0 : viewport.scrollHeight;
  }, [reverse]);

  // Nút xuống cuối cũng xóa dấu tin mới, không thay đổi trạng thái đã xem của BE.
  const scrollToLatest = useCallback(() => {
    pinnedToBottom.current = true;
    setHasNewMessages(false);
    writeBottom();
  }, [writeBottom]);

  // Cập nhật bộ đếm trước observer; không kéo người đang đọc tin cũ xuống cuối khi có tin mới.
  useLayoutEffect(() => {
    currentCount.current = messageCount;
    if (visible && pinnedToBottom.current) writeBottom();
  }, [messageCount, visible, writeBottom]);

  useEffect(() => {
    const viewport = historyRef.current;
    const content = historyContentRef.current;
    if (!visible || !viewport || !content) return;
    const onScroll = () => {
      const distance = reverse ? Math.abs(viewport.scrollTop) : viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      pinnedToBottom.current = distance <= 32;
      if (pinnedToBottom.current) setHasNewMessages(false);
    };
    const onContentChange = () => {
      const arrived = currentCount.current > observedCount.current;
      observedCount.current = currentCount.current;
      if (pinnedToBottom.current) writeBottom();
      else if (arrived) setHasNewMessages(true);
    };
    // MutationObserver nhận biết tin mới kể cả khi gom nhóm làm chiều cao không đổi.
    const mutations = new MutationObserver(onContentChange);
    // Gom/tách trạng thái làm đổi chiều cao dù số tin không đổi; giữ đáy nếu đang đọc tin mới nhất.
    const sizes = new ResizeObserver(onContentChange);
    viewport.addEventListener("scroll", onScroll, { passive: true });
    mutations.observe(content, { childList: true, subtree: true, characterData: true });
    sizes.observe(content);
    sizes.observe(viewport);
    return () => {
      mutations.disconnect();
      sizes.disconnect();
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [visible, reverse, writeBottom]);

  return { historyRef, historyContentRef, hasNewMessages, scrollToLatest };
}

