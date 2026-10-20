import { Client } from "@stomp/stompjs";

// Mỗi client chỉ kết nối một lần; hook cấp ticket mới trước mọi lần reconnect.
export function createChatStompClient(ticket: string) {
  const brokerURL = process.env.NEXT_PUBLIC_CHAT_WS_URL
    || (process.env.NODE_ENV === "development" ? "ws://localhost:8080/ws-notifications" : "");
  if (!brokerURL || !/^wss?:\/\//.test(brokerURL)) {
    throw new Error("Chưa cấu hình NEXT_PUBLIC_CHAT_WS_URL hợp lệ cho chat.");
  }
  return new Client({
    brokerURL,
    connectHeaders: { Authorization: `Bearer ${ticket}` },
    reconnectDelay: 0,
    connectionTimeout: 15000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    debug: () => {},
  });
}
