"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface ChatHistoryScrollOptions {
  visible?: boolean;
  reverse?: boolean;
  latestMessageKey?: number;
  hasOlder?: boolean;
  loadingOlder?: boolean;
  olderError?: string;
  onLoadOlder?: () => Promise<void>;
}

// Giữ vị trí đọc tin cũ; chỉ tự bám đáy nếu người dùng đang ở cuối lịch sử.
export function useChatHistoryScroll(messageCount: number, {
  visible = true, reverse = false, latestMessageKey = messageCount,
  hasOlder = false, loadingOlder = false, olderError = "", onLoadOlder,
}: ChatHistoryScrollOptions = {}) {
  const historyRef = useRef<HTMLDivElement>(null);
  const historyContentRef = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);
  const currentCount = useRef(messageCount);
  const observedCount = useRef(messageCount);
  const currentLatest = useRef(latestMessageKey);
  const observedLatest = useRef(latestMessageKey);
  const anchor = useRef<{ id?: string; offset: number; top: number; height: number } | null>(null);
  const restoredTop = useRef<number | null>(null);
  const requestFinished = useRef(false);
  // Bảo đảm lượt tải kết thúc được xử lý sau commit DOM, kể cả batch không tăng số tin.
  const [prependVersion, setPrependVersion] = useState(0);
  // Đánh dấu có tin mới đến trong lúc người dùng đang xem phần lịch sử phía trên.
  const [hasNewMessages, setHasNewMessages] = useState(false);

  // Chụp tin đang đọc tại vị trí hiện tại, không giữ cứng vị trí lúc bắt đầu request.
  const captureAnchor = useCallback(() => {
    const viewport = historyRef.current;
    if (!viewport) return null;
    const bounds = viewport.getBoundingClientRect();
    const target = [...viewport.querySelectorAll<HTMLElement>("[data-chat-message-id]")]
      .find((item) => item.getBoundingClientRect().bottom > bounds.top && item.getBoundingClientRect().top < bounds.bottom);
    return { id: target?.dataset.chatMessageId, offset: target ? target.getBoundingClientRect().top - bounds.top : 0, top: viewport.scrollTop, height: viewport.scrollHeight };
  }, []);

  // Neo vào tin đang nhìn thấy, tránh giật cả khi socket thêm tin trong lúc tải batch cũ.
  const restoreAnchor = useCallback(() => {
    const viewport = historyRef.current;
    const saved = anchor.current;
    if (!viewport || !saved) return;
    const target = saved.id ? viewport.querySelector<HTMLElement>(`[data-chat-message-id="${saved.id}"]`) : null;
    const bounds = viewport.getBoundingClientRect();
    const scale = bounds.width / viewport.offsetWidth || 1;
    const top = target ? viewport.scrollTop + (target.getBoundingClientRect().top - bounds.top - saved.offset) / scale
      : saved.top + (reverse ? 0 : viewport.scrollHeight - saved.height);
    if (Math.abs(viewport.scrollTop - top) > 0.5) {
      viewport.scrollTop = top;
      restoredTop.current = viewport.scrollTop;
    }
  }, [reverse]);

  // Nút tải thêm và cuộn lên dùng chung thao tác giữ vị trí, không tải khi room đang ẩn.
  const loadEarlier = useCallback(async () => {
    const viewport = historyRef.current;
    if (!visible || !viewport || !hasOlder || loadingOlder || !onLoadOlder || anchor.current) return;
    anchor.current = captureAnchor();
    requestFinished.current = false;
    pinnedToBottom.current = false;
    try { await onLoadOlder(); }
    finally {
      if (anchor.current) {
        requestFinished.current = true;
        setPrependVersion((version) => version + 1);
      }
    }
  }, [visible, hasOlder, loadingOlder, onLoadOlder, captureAnchor]);

  // Hỗ trợ cả vùng cuộn thường và flex-col-reverse đang có ở hộp thư shop.
  const writeBottom = useCallback(() => {
    const viewport = historyRef.current;
    if (viewport) viewport.scrollTop = reverse ? 0 : viewport.scrollHeight;
  }, [reverse]);

  // Nút xuống cuối cũng xóa dấu tin mới, không thay đổi trạng thái đã xem của BE.
  const scrollToLatest = useCallback(() => {
    anchor.current = null;
    pinnedToBottom.current = true;
    setHasNewMessages(false);
    writeBottom();
  }, [writeBottom]);

  // Cập nhật bộ đếm trước observer; không kéo người đang đọc tin cũ xuống cuối khi có tin mới.
  useLayoutEffect(() => {
    currentCount.current = messageCount;
    currentLatest.current = latestMessageKey;
    if (anchor.current) {
      restoreAnchor();
      // Chỉ bỏ neo khi DOM đã phản ánh cả batch và việc ẩn loading, không bù ở frame sau.
      if (requestFinished.current && !loadingOlder) anchor.current = null;
    }
    else if (visible && pinnedToBottom.current) writeBottom();
  }, [messageCount, latestMessageKey, loadingOlder, prependVersion, visible, writeBottom, restoreAnchor]);

  useEffect(() => {
    const viewport = historyRef.current;
    const content = historyContentRef.current;
    if (!visible || !viewport || !content) return;
    let previousTop = viewport.scrollTop;
    const onScroll = () => {
      const towardOlder = viewport.scrollTop < previousTop;
      previousTop = viewport.scrollTop;
      const distance = reverse ? Math.abs(viewport.scrollTop) : viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
      pinnedToBottom.current = distance <= 32;
      if (pinnedToBottom.current) setHasNewMessages(false);
      const programmed = restoredTop.current !== null && Math.abs(viewport.scrollTop - restoredTop.current) <= 1;
      restoredTop.current = null;
      if (programmed) return;
      // Người dùng vẫn cuộn được trong lúc tải; batch về phải neo vị trí mới nhất của họ.
      if (anchor.current) anchor.current = captureAnchor();
      const distanceToTop = reverse ? viewport.scrollHeight - viewport.clientHeight + viewport.scrollTop : viewport.scrollTop;
      // Tải trước khoảng một màn hình lịch sử, không đợi người dùng chạm tin cũ nhất.
      const prefetchDistance = Math.max(240, Math.min(viewport.clientHeight, 640));
      if (towardOlder && distanceToTop <= prefetchDistance && !olderError) void loadEarlier();
    };
    const onContentChange = () => {
      const arrived = currentCount.current > observedCount.current && currentLatest.current !== observedLatest.current;
      observedCount.current = currentCount.current;
      observedLatest.current = currentLatest.current;
      if (anchor.current) {
        restoreAnchor();
        if (arrived && !pinnedToBottom.current) setHasNewMessages(true);
      } else if (pinnedToBottom.current) writeBottom();
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
  }, [visible, reverse, writeBottom, loadEarlier, olderError, restoreAnchor, captureAnchor]);

  useEffect(() => () => {
    anchor.current = null;
  }, []);

  return { historyRef, historyContentRef, hasNewMessages, scrollToLatest, loadEarlier };
}

