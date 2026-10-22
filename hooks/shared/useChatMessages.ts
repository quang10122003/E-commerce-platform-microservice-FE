"use client";

import { useCallback } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useChatReadState } from "@/hooks/shared/useChatReadState";
import { syncChatMessagePreview } from "@/lib/redux/services/chat-cache";
import { useChatHistoryScroll } from "@/hooks/shared/useChatHistoryScroll";
import { useChatMessageHistory } from "@/hooks/shared/useChatMessageHistory";
import { useChatRoomSocket } from "@/hooks/shared/useChatRoomSocket";
import { useChatMessageQueue } from "@/hooks/shared/useChatMessageQueue";
import { getChatDisplayMessages } from "@/utils/chat.utils";
import { getShopChatUiState, groupShopChatMessages } from "@/utils/shop-chat.utils";

// Tải lịch sử và nhận realtime đúng room; component được key theo tài khoản và room.
export function useChatMessages(conversationId?: number, viewerId?: number, visible = true, reverse = true) {
  const dispatch = useAppDispatch();
  const enabled = !!conversationId && !!viewerId;
  const { pending, identities, enqueue, observe, interrupt, pause, resume, retry } = useChatMessageQueue(viewerId ?? 0);
  const history = useChatMessageHistory(conversationId, viewerId, observe);
  const read = useChatReadState(conversationId ?? null, viewerId ?? 0, history.messages, visible, enabled && history.ready && !history.error && !history.refreshing);

  // Tải bù đủ các batch bị lỡ và đối chiếu tin đã lưu trước khi tiếp tục publish.
  const { refresh } = history;
  const syncHistory = useCallback(async (publish: (content: string) => void) => {
    pause();
    if (await refresh()) resume(publish);
  }, [refresh, pause, resume]);

  const { publish, status, error: socketError } = useChatRoomSocket({
    // Chỉ mở socket sau khi đã tải được lịch sử bằng quyền của tài khoản hiện tại.
    conversationId: enabled && history.ready ? conversationId ?? null : null,
    onMessage: (message) => {
      history.receive(message);
      if (viewerId) dispatch(syncChatMessagePreview(message, viewerId));
    },
    onRead: read.receiveRead,
    // Tải bù sau subscribe hoặc reconnect; hook socket luôn xin ticket mới.
    onReady: () => { void syncHistory(publish); },
    onInterrupted: interrupt,
  });

  // Ghi nhận vào hàng đợi của room hiện tại, không khóa thao tác khi mất socket.
  const { retryRead } = read;
  const send = useCallback((content: string) => {
    if (!enabled || !history.ready) return Promise.reject(new Error("Chưa tải được hội thoại. Vui lòng thử lại sau."));
    retryRead();
    return enqueue(content, conversationId ?? null);
  }, [enabled, history.ready, enqueue, conversationId, retryRead]);

  const displayMessages = getChatDisplayMessages(read.messages, pending, identities);
  const scroll = useChatHistoryScroll(displayMessages.length, {
    reverse, visible, latestMessageKey: displayMessages.at(-1)?.renderKey,
    hasOlder: history.hasOlder, loadingOlder: history.olderLoading,
    olderError: history.olderError, onLoadOlder: history.loadOlder,
  });
  const uiState = getShopChatUiState({
    enabled, loading: history.loading, connectionStatus: status, refreshing: history.refreshing,
    historyError: history.error, socketError, hasFailedMessage: pending[0]?.deliveryStatus === "failed",
  });
  return {
    ...scroll, send, canSend: enabled && history.ready,
    groups: groupShopChatMessages(displayMessages), messages: displayMessages, count: displayMessages.length,
    hasOlder: history.hasOlder, olderLoading: history.olderLoading, olderError: history.olderError,
    pendingCount: pending.length, pendingHeadId: pending[0]?.id, retryQueuedMessage: retry,
    showQueueNotice: pending.length > 0 && (status !== "connected" || pending[0]?.deliveryStatus === "failed" || !!history.error),
    loading: history.loading, uiState, historyError: history.error, refreshing: history.refreshing,
    connectionStatus: status, unreadCount: read.unreadCount,
    error: history.error || (enabled ? socketError : ""),
    reload: () => { retryRead(); void syncHistory(publish); },
  };
}
