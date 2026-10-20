"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useChatReadState } from "@/hooks/shared/useChatReadState";
import { syncChatMessagePreview } from "@/lib/redux/services/chat-cache";
import { useGetChatConversationMessagesQuery } from "@/lib/redux/services/chat-api";
import { useChatHistoryScroll } from "@/hooks/shared/useChatHistoryScroll";
import { useChatRoomSocket } from "@/hooks/shared/useChatRoomSocket";
import { useChatMessageQueue } from "@/hooks/shared/useChatMessageQueue";
import { getApiErrorMessage } from "@/lib/utils";
import { getChatDisplayMessages, mergeChatMessages } from "@/utils/chat.utils";
import { getShopChatUiState, groupShopChatMessages, prepareShopChatMessages } from "@/utils/shop-chat.utils";
import type { ChatMessage } from "@/types/user/chat";

// Tải lịch sử và nhận realtime đúng room; component được key theo tài khoản và room.
export function useChatMessages(conversationId?: number, viewerId?: number, visible = true, reverse = true) {
  const dispatch = useAppDispatch();
  const enabled = !!conversationId && !!viewerId;
  const { pending, identities, enqueue, observe, interrupt, pause, resume, retry } = useChatMessageQueue(viewerId ?? 0);
  // Giữ tin socket riêng để response REST đến muộn không ghi đè hoặc làm mất tin mới.
  const [liveMessages, setLiveMessages] = useState<ChatMessage[]>([]);
  // Lưu lỗi tải bù để hàng đợi không chạy khi chưa đồng bộ xong lịch sử.
  const [syncError, setSyncError] = useState("");
  const mounted = useRef(false);
  const query = useGetChatConversationMessagesQuery({
    conversationId: conversationId ?? 0,
    viewerId: viewerId ?? 0,
  }, { skip: !enabled, refetchOnMountOrArgChange: true });
  const { refetch } = query;
  // currentData gắn với arg hiện tại, nên response room cũ không lọt sang room mới.
  const data = enabled && query.currentData?.success ? query.currentData.data : null;
  const hasHistory = Array.isArray(data);
  const restMessages = hasHistory ? prepareShopChatMessages(data, conversationId ?? 0) : [];
  const messages = mergeChatMessages(restMessages, liveMessages, conversationId ?? 0);
  const error = !enabled ? "" : query.isError
    ? getApiErrorMessage(query.error, "Không tải được tin nhắn. Vui lòng thử lại.")
    : query.currentData && !query.currentData.success ? query.currentData.message
    : query.currentData?.success && !hasHistory ? "Dữ liệu tin nhắn không hợp lệ." : "";

  const read = useChatReadState(conversationId ?? null, viewerId ?? 0, messages, visible, enabled && hasHistory && !error && !syncError);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  // Tải bù và đối chiếu tin đã lưu trước khi cho phép hàng đợi tiếp tục publish.
  const syncHistory = useCallback(async (publish: (content: string) => void) => {
    if (!enabled || !conversationId) return;
    pause();
    try {
      const response = await refetch().unwrap();
      if (!mounted.current) return;
      if (!response.success || !Array.isArray(response.data)) throw new Error(response.message || "Dữ liệu tin nhắn không hợp lệ.");
      observe(prepareShopChatMessages(response.data, conversationId));
      setSyncError("");
      resume(publish);
    } catch (failure) {
      if (mounted.current) setSyncError(getApiErrorMessage(failure, "Chưa tải bù được lịch sử. Tin đang chờ chưa được gửi."));
    }
  }, [enabled, conversationId, refetch, pause, observe, resume]);

  const { publish, status, error: socketError } = useChatRoomSocket({
    // Chỉ mở socket sau khi đã tải được lịch sử bằng quyền của tài khoản hiện tại.
    conversationId: enabled && hasHistory ? conversationId ?? null : null,
    onMessage: (message) => {
      observe([message]);
      if (viewerId) dispatch(syncChatMessagePreview(message, viewerId));
      setLiveMessages((current) => mergeChatMessages(current, [message], conversationId ?? 0));
    },
    onRead: read.receiveRead,
    // Tải bù sau subscribe hoặc reconnect; hook socket luôn xin ticket mới.
    onReady: () => { void syncHistory(publish); },
    onInterrupted: interrupt,
  });

  // Ghi nhận vào hàng đợi của room hiện tại, không khóa thao tác khi mất socket.
  const { retryRead } = read;
  const send = useCallback((content: string) => {
    if (!enabled || !hasHistory) return Promise.reject(new Error("Chưa tải được hội thoại. Vui lòng thử lại sau."));
    retryRead();
    return enqueue(content, conversationId ?? null);
  }, [enabled, hasHistory, enqueue, conversationId, retryRead]);

  const displayMessages = getChatDisplayMessages(read.messages, pending, identities);
  const scroll = useChatHistoryScroll(displayMessages.length, { reverse, visible });
  const loading = enabled && (query.isLoading || (query.isFetching && !query.currentData));
  const historyError = error || syncError;
  const uiState = getShopChatUiState({
    enabled, loading, connectionStatus: status, refreshing: query.isFetching,
    historyError, socketError, hasFailedMessage: pending[0]?.deliveryStatus === "failed",
  });
  return {
    ...scroll, send, canSend: enabled && hasHistory,
    groups: groupShopChatMessages(displayMessages),
    messages: displayMessages,
    count: displayMessages.length,
    pendingCount: pending.length, pendingHeadId: pending[0]?.id, retryQueuedMessage: retry,
    showQueueNotice: pending.length > 0 && (status !== "connected" || pending[0]?.deliveryStatus === "failed" || !!historyError),
    loading, uiState, historyError,
    refreshing: enabled && query.isFetching,
    connectionStatus: status,
    error: error || syncError || (enabled ? socketError : ""),
    reload: () => { retryRead(); void syncHistory(publish); },
  };
}




