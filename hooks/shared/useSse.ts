"use client";

import { useEffect, useRef, useState } from "react";
import { connectSse } from "@/lib/service/sseService";

// Quản lý vòng đời SSE, tự reconnect theo EventSource và giữ Last-Event-ID của trình duyệt.
export function useSse(url: string | null, events: readonly string[], onEvent: (name: string, data: unknown) => void, onError: () => void, onOpen?: () => void) {
  const callbacksRef = useRef({ onEvent, onError, onOpen });
  // Cho phép kết nối lại thủ công khi trình duyệt đã đóng stream do lỗi HTTP.
  const [version, setVersion] = useState(0);
  useEffect(() => { callbacksRef.current = { onEvent, onError, onOpen }; }, [onEvent, onError, onOpen]);
  useEffect(() => {
    if (!url) return;
    const source = connectSse(url);
    let notified = false;
    const handlers = events.map((name) => {
      const handler = (event: Event) => {
        try {
          const data: unknown = JSON.parse((event as MessageEvent<string>).data);
          callbacksRef.current.onEvent(name, data);
        } catch { callbacksRef.current.onError(); }
      };
      source.addEventListener(name, handler);
      return { name, handler };
    });
    source.onopen = () => { notified = false; callbacksRef.current.onOpen?.(); };
    source.onerror = () => {
      if (!notified) callbacksRef.current.onError();
      notified = true;
    };
    return () => {
      handlers.forEach(({ name, handler }) => source.removeEventListener(name, handler));
      source.close();
    };
  }, [url, events, version]);

  // Chỉ nối lại stream, không gửi lại thao tác nghiệp vụ đã được BE tiếp nhận.
  const reconnect = () => setVersion((value) => value + 1);
  return { reconnect };
}
