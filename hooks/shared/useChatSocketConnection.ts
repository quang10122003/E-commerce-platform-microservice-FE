"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { Client, IPublishParams } from "@stomp/stompjs";
import { useAppDispatch } from "@/lib/redux/hooks";
import { requestChatWsTicket } from "@/lib/redux/services/chat-api";
import { createChatStompClient } from "@/lib/socket/createChatStompClient";
import type { ChatConnectionStatus, ChatSocketInterruptionReason } from "@/types/user/chat";

interface ChatSocketConnectionOptions {
  connectionId: number | null;
  onConnected: (client: Client, isCurrent: () => boolean, reportError: (message: string) => void) => void;
  onInterrupted: (message: string, reason: ChatSocketInterruptionReason) => void;
}

// Dùng chung vòng đời ticket, reconnect và cleanup cho socket room và hộp thư.
export function useChatSocketConnection({ connectionId, onConnected, onInterrupted }: ChatSocketConnectionOptions) {
  // Trạng thái kết nối và lỗi được tách khỏi trạng thái online của shop.
  const [status, setStatus] = useState<ChatConnectionStatus>("connecting");
  const [error, setError] = useState("");
  const clientRef = useRef<Client | null>(null);
  const dispatch = useAppDispatch();
  const connected = useEffectEvent(onConnected);
  const interrupted = useEffectEvent(onInterrupted);

  useEffect(() => {
    if (!connectionId) return;
    let stopped = false;
    let attempts = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let ticketRequest: ReturnType<ReturnType<typeof requestChatWsTicket>> | undefined;
    let activeClient: Client | null = null;

    // Retry kết nối có backoff; caller quyết định cách xử lý tin chưa xác nhận.
    const retry = () => {
      if (stopped || timer) return;
      interrupted("Mất kết nối. Hãy kiểm tra lịch sử trước khi gửi lại tin.", "connection");
      setStatus("reconnecting");
      setError("Kết nối bị gián đoạn, đang thử kết nối lại…");
      timer = setTimeout(() => { timer = undefined; void connect(); }, Math.min(3000 * 2 ** Math.min(attempts, 3), 30000));
    };

    // Ticket chỉ nằm trong bộ nhớ ngắn hạn, không lưu Redux hay ghi log.
    const connect = async () => {
      if (stopped) return;
      attempts += 1;
      try {
        ticketRequest = dispatch(requestChatWsTicket());
        const response = await ticketRequest.unwrap();
        if (stopped) return;
        if (!response.success || !response.data?.ticket) throw new Error("Không cấp được vé kết nối chat.");
        const client = createChatStompClient(response.data.ticket);
        activeClient = client;
        clientRef.current = client;
        const isCurrent = () => !stopped && clientRef.current === client;
        client.onConnect = () => {
          client.connectHeaders = {};
          if (!isCurrent()) { void client.deactivate(); return; }
          attempts = 0;
          setError("");
          setStatus("connected");
          try { connected(client, isCurrent, setError); }
          catch { client.forceDisconnect(); }
        };
        client.onStompError = () => {
          client.connectHeaders = {};
          client.forceDisconnect();
        };
        client.onWebSocketClose = () => {
          client.connectHeaders = {};
          if (!isCurrent()) return;
          clientRef.current = null;
          retry();
        };
        client.activate();
      } catch {
        if (stopped) return;
        setError("Chưa thể kết nối chat. Vui lòng kiểm tra kết nối và cấu hình WebSocket.");
        setStatus("error");
        retry();
      }
    };
    void connect();
    return () => {
      stopped = true;
      clearTimeout(timer);
      ticketRequest?.abort();
      if (activeClient) {
        activeClient.connectHeaders = {};
        void activeClient.deactivate({ force: true });
      }
      clientRef.current = null;
    };
  }, [connectionId, dispatch]);

  // Chỉ publish qua client đang kết nối và thuộc scope đã xác thực.
  const publish = useCallback((params: IPublishParams) => {
    const client = clientRef.current;
    if (!client?.connected || !connectionId) throw new Error("Chat chưa kết nối. Vui lòng thử lại sau.");
    client.publish(params);
  }, [connectionId]);

  return { status, error, publish };
}
