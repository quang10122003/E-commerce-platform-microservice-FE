"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getApiErrorMessage } from "@/lib/utils";
import { CHAT_MAX_CONTENT_LENGTH, type ChatMessage, type ChatMessageRenderIdentity, type PendingChatMessage, type ChatSocketInterruptionReason } from "@/types/user/chat";

// Hàng đợi FIFO trong phiên hội thoại; không lưu bền vững và không thêm trường vào payload BE.
export function useChatMessageQueue(userId: number) {
  // State phục vụ UI; ref giữ hàng đợi đồng bộ giữa thao tác gửi và callback socket.
  const [pending, setPending] = useState<PendingChatMessage[]>([]);
  // Giữ key và vị trí gửi ban đầu khi tin chờ được thay bằng dữ liệu BE.
  const [identities, setIdentities] = useState<Record<number, ChatMessageRenderIdentity>>({});
  const queueRef = useRef<PendingChatMessage[]>([]);
  const readyRef = useRef(false);
  const publishRef = useRef<((content: string) => void) | null>(null);
  const latestId = useRef(0);
  const localId = useRef(0);
  const alive = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cập nhật cả bộ điều phối và UI trong cùng một lượt xử lý.
  const update = useCallback((next: PendingChatMessage[]) => {
    queueRef.current = next;
    if (alive.current) setPending(next);
  }, []);

  // Chỉ có một timeout tương ứng với tin đầu hàng đợi.
  const clearTimer = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  }, []);

  // Dừng tại tin lỗi, không chuyển sang tin phía sau.
  const fail = useCallback((id: number, message: string, reason: "server" | "timeout") => {
    const head = queueRef.current[0];
    if (!alive.current || head?.id !== id || head.deliveryStatus !== "sending") return;
    clearTimer();
    update([{ ...head, deliveryStatus: "failed", deliveryError: message, failureReason: reason }, ...queueRef.current.slice(1)]);
  }, [clearTimer, update]);

  // Chỉ publish tin đầu khi đã đồng bộ lịch sử và không có tin đang chờ xác nhận.
  const pump = useCallback(() => {
    const head = queueRef.current[0];
    if (!alive.current || !readyRef.current || !publishRef.current || head?.deliveryStatus !== "queued") return;
    clearTimer();
    const sending: PendingChatMessage = { ...head, deliveryStatus: "sending", deliveryError: undefined, failureReason: undefined, afterId: latestId.current };
    update([sending, ...queueRef.current.slice(1)]);
    timer.current = setTimeout(() => fail(head.id, "Chưa nhận được xác nhận. Kiểm tra lịch sử trước khi gửi lại.", "timeout"), 15000);
    try { publishRef.current(head.content); }
    catch (error) {
      clearTimer();
      readyRef.current = false;
      update([{ ...sending, deliveryStatus: "queued", deliveryError: getApiErrorMessage(error, "Chưa gửi — chờ kết nối.") }, ...queueRef.current.slice(1)]);
    }
  }, [clearTimer, fail, update]);

  // Đối chiếu echo hoặc lịch sử mới; ID mốc chỉ giảm nhầm lẫn, không thay thế idempotency ở BE.
  const observe = useCallback((incoming: ChatMessage[]) => {
    if (!alive.current) return;
    for (const message of incoming) latestId.current = Math.max(latestId.current, message.id);
    const head = queueRef.current[0];
    const afterId = head?.afterId;
    const confirmed = afterId === undefined ? undefined : incoming.find((message) =>
      message.conversationId === head.conversationId && message.senderId === userId
      && message.id > afterId && message.content === head.content);
    if (confirmed) {
      setIdentities((current) => ({ ...current, [confirmed.id]: { renderKey: head.id, createdAt: head.createdAt } }));
      clearTimer();
      update(queueRef.current.slice(1));
      pump();
    }
  }, [clearTimer, pump, update, userId]);

  // Ghi nhận vào hàng đợi ngay để người dùng tiếp tục nhập dù socket đang mất kết nối.
  const enqueue = useCallback((value: string, conversationId: number | null) => {
    const content = value.trim();
    if (!alive.current || !conversationId) return Promise.reject(new Error("Chưa mở được hội thoại. Vui lòng thử lại."));
    if (!content || content.length > CHAT_MAX_CONTENT_LENGTH) return Promise.reject(new Error("Tin nhắn phải từ 1 đến 4.000 ký tự."));
    const timestamp = new Date().toISOString();
    update([...queueRef.current, {
      id: --localId.current, conversationId, senderId: userId, content, read: false,
      createdAt: timestamp, updatedAt: timestamp, deliveryStatus: "queued",
    }]);
    pump();
    return Promise.resolve();
  }, [pump, update, userId]);

  // Mất kết nối thì chờ reconnect; lỗi nghiệp vụ giữ nguyên điểm dừng để người dùng thử lại.
  const interrupt = useCallback((message: string, reason: ChatSocketInterruptionReason) => {
    const head = queueRef.current[0];
    if (reason === "connection") readyRef.current = false;
    if (head?.deliveryStatus !== "sending") return;
    if (reason === "server") { fail(head.id, message, "server"); return; }
    clearTimer();
    update([{ ...head, deliveryStatus: "queued", deliveryError: message }, ...queueRef.current.slice(1)]);
  }, [clearTimer, fail, update]);

  // Chỉ tiếp tục sau khi tải bù lịch sử; lỗi nghiệp vụ không tự lặp vô hạn.
  const resume = useCallback((publish: (content: string) => void) => {
    if (!alive.current) return;
    publishRef.current = publish;
    readyRef.current = true;
    const head = queueRef.current[0];
    if (head?.deliveryStatus === "failed" && head.failureReason !== "server") {
      update([{ ...head, deliveryStatus: "queued", deliveryError: undefined }, ...queueRef.current.slice(1)]);
    }
    pump();
  }, [pump, update]);

  // Thử lại đúng tin đầu bị lỗi, sau xác nhận mới xử lý các tin còn lại.
  const retry = useCallback(() => {
    const head = queueRef.current[0];
    if (head?.deliveryStatus !== "failed") return;
    update([{ ...head, deliveryStatus: "queued", deliveryError: undefined, failureReason: undefined }, ...queueRef.current.slice(1)]);
    pump();
  }, [pump, update]);

  const pause = useCallback(() => { readyRef.current = false; }, []);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      readyRef.current = false;
      publishRef.current = null;
      queueRef.current = [];
      clearTimer();
    };
  }, [clearTimer]);

  return { pending, identities, enqueue, observe, interrupt, resume, pause, retry };
}



