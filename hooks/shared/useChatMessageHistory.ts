"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "@/lib/redux/hooks";
import { requestChatConversationMessages } from "@/lib/redux/services/chat-api";
import { getApiErrorMessage } from "@/lib/utils";
import { mergeChatMessages } from "@/utils/chat.utils";
import { isChatCursorInvalid, isChatMessagePage } from "@/utils/chat-history.utils";
import type { ChatMessage } from "@/types/user/chat";

type HistoryRequest = ReturnType<ReturnType<typeof requestChatConversationMessages>>;
const emptyHistory = { scope: "", messages: [] as ChatMessage[], ready: false, refreshing: false, olderLoading: false, error: "", olderError: "", hasOlder: false };
type HistoryState = typeof emptyHistory;
interface HistoryContext {
  scope: string; roomId: number; viewerId: number; active: boolean; messages: ChatMessage[];
  cursor: string | null; hasOlder: boolean; initialized: boolean; cursorInvalid: boolean;
  syncedId: number | null;
  requests: Set<HistoryRequest>; latest?: Promise<boolean>; older?: Promise<void>;
}

// Quản lý cursor và các batch riêng theo room/tài khoản, gộp HTTP với socket theo ID.
export function useChatMessageHistory(conversationId: number | undefined, viewerId: number | undefined, observe: (messages: ChatMessage[]) => void) {
  const dispatch = useAppDispatch();
  const scope = `${viewerId ?? 0}:${conversationId ?? 0}`;
  const context = useRef<HistoryContext | null>(null);
  // Dữ liệu hiển thị tách scope để response room cũ không lọt sang room mới.
  const [state, setState] = useState(emptyHistory);

  // Bỏ mọi kết quả đến muộn sau cleanup hoặc sau khi đã đổi room.
  const commit = useCallback((ctx: HistoryContext, patch: Partial<HistoryState>) => {
    if (ctx.active && context.current === ctx) setState((current) => ({
      ...(current.scope === ctx.scope ? current : emptyHistory), scope: ctx.scope, ...patch,
    }));
  }, []);

  // Cập nhật hợp nhất trước khi observe để hàng đợi không mất echo khi HTTP tới muộn.
  const receiveBatch = useCallback((ctx: HistoryContext, incoming: ChatMessage[]) => {
    if (!ctx.active || context.current !== ctx) return;
    ctx.messages = mergeChatMessages(ctx.messages, incoming, ctx.roomId);
    observe(incoming);
    commit(ctx, { messages: ctx.messages });
  }, [commit, observe]);

  // Mỗi request giải phóng subscription RTK; cleanup có thể abort khi đóng room.
  const fetchPage = useCallback(async (ctx: HistoryContext, cursor?: string) => {
    const request = dispatch(requestChatConversationMessages({ conversationId: ctx.roomId, viewerId: ctx.viewerId, cursor }));
    ctx.requests.add(request);
    try {
      const response = await request.unwrap();
      if (!response.success) throw new Error(response.message || "Không tải được lịch sử tin nhắn.");
      if (!isChatMessagePage(response.data, ctx.roomId)) throw new Error("Dữ liệu tin nhắn không hợp lệ.");
      return response.data;
    } finally {
      request.unsubscribe();
      ctx.requests.delete(request);
    }
  }, [dispatch]);

  // Reconnect có thể bỏ lỡ hơn 20 tin: đọc tiếp đến batch giao với lịch sử đã biết.
  const refresh = useCallback((): Promise<boolean> => {
    const ctx = context.current;
    if (!ctx?.active) return Promise.resolve(false);
    if (ctx.latest) return ctx.latest;
    const anchorId = ctx.syncedId;
    const hadHistory = ctx.initialized;
    ctx.latest = (async () => {
      await ctx.older;
      if (!ctx.active) return false;
      commit(ctx, { refreshing: true, error: "" });
      const seedCursor = !ctx.initialized || anchorId === null;
      const visited = new Set<string>();
      let cursor: string | undefined;
      let newestId: number | null = null;
      try {
        do {
          const page = await fetchPage(ctx, cursor);
          if (!ctx.active) return false;
          if (cursor === undefined) newestId = page.items[0]?.id ?? null;
          if (seedCursor && cursor === undefined) {
            ctx.cursor = page.nextCursor; ctx.hasOlder = page.hasNext; ctx.initialized = true;
          }
          // Đảo từng batch mới → cũ; merge giữ thứ tự và không làm mất tin đã tải trước đó.
          receiveBatch(ctx, [...page.items].reverse());
          // Mốc chỉ lấy từ HTTP đã đồng bộ, không để tin socket mới che mất khoảng tin bị lỡ.
          if (!hadHistory || !page.hasNext || page.items.some((message) => message.id === anchorId)) {
            if (hadHistory && anchorId === null && !page.hasNext) { ctx.cursor = null; ctx.hasOlder = false; }
            break;
          }
          if (visited.has(page.nextCursor!) || !page.items.length) throw new Error("Cursor lịch sử không tiến triển.");
          visited.add(page.nextCursor!);
          cursor = page.nextCursor!;
        } while (ctx.active);
        ctx.syncedId = newestId;
        commit(ctx, { ready: true, hasOlder: ctx.hasOlder });
        return ctx.active;
      } catch (failure) {
        commit(ctx, { error: getApiErrorMessage(failure, "Không tải được lịch sử tin nhắn. Vui lòng thử lại.") });
        return false;
      } finally {
        ctx.latest = undefined;
        commit(ctx, { refreshing: false });
      }
    })();
    return ctx.latest;
  }, [commit, fetchPage, receiveBatch]);

  // Chặn tải trùng; giữ nguyên cursor khi lỗi để người dùng chủ động thử lại.
  const loadOlder = useCallback((): Promise<void> => {
    const ctx = context.current;
    if (!ctx?.active || !ctx.initialized || !ctx.hasOlder || ctx.latest || ctx.older) return Promise.resolve();
    ctx.older = (async () => {
      commit(ctx, { olderLoading: true, olderError: "" });
      try {
        const cursor = ctx.cursorInvalid ? undefined : ctx.cursor ?? undefined;
        const page = await fetchPage(ctx, cursor);
        if (!ctx.active) return;
        if (page.hasNext && (page.nextCursor === cursor || !page.items.length)) throw new Error("Cursor lịch sử không tiến triển.");
        receiveBatch(ctx, [...page.items].reverse());
        ctx.cursor = page.nextCursor; ctx.hasOlder = page.hasNext; ctx.cursorInvalid = false;
        commit(ctx, { hasOlder: ctx.hasOlder });
      } catch (failure) {
        ctx.cursorInvalid = isChatCursorInvalid(failure);
        commit(ctx, { olderError: ctx.cursorInvalid ? "Cursor đã hết hiệu lực. Thử lại để tải lại mốc lịch sử." : getApiErrorMessage(failure, "Không tải được tin cũ. Vui lòng thử lại.") });
      } finally {
        ctx.older = undefined;
        commit(ctx, { olderLoading: false });
      }
    })();
    return ctx.older;
  }, [commit, fetchPage, receiveBatch]);

  useEffect(() => {
    if (!conversationId || !viewerId) return;
    const ctx: HistoryContext = {
      scope, roomId: conversationId, viewerId, active: true, messages: [], requests: new Set(),
      cursor: null, hasOlder: false, initialized: false, cursorInvalid: false, syncedId: null,
    };
    context.current = ctx;
    void Promise.resolve().then(() => { if (ctx.active) void refresh(); });
    return () => {
      ctx.active = false;
      ctx.requests.forEach((request) => { request.abort(); request.unsubscribe(); });
      ctx.requests.clear();
      if (context.current === ctx) context.current = null;
    };
  }, [scope, conversationId, viewerId, refresh]);

  // Socket đi qua cùng bộ gộp với các batch HTTP để không lặp hoặc mất tin.
  const receive = useCallback((message: ChatMessage) => {
    const ctx = context.current;
    if (ctx && message.conversationId === ctx.roomId) receiveBatch(ctx, [message]);
  }, [receiveBatch]);
  const data = state.scope === scope ? state : emptyHistory;
  return { ...data, loading: !!conversationId && !!viewerId && !data.ready && !data.error, refresh, loadOlder, receive };
}
