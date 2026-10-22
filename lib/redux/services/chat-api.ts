import { baseApi } from "./base-api";
import type { ApiResponse, ScrollResponse } from "@/types/shared/api";
import type { ChatConversation, ChatWsTicket, ChatMessage, ChatConversationMessagesQuery, ChatReadReceipt } from "@/types/user/chat";

// HTTP chat đi qua BFF để serverFetch quản lý cookie và refresh token.
export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChatConversationMessages: builder.query<ApiResponse<ScrollResponse<ChatMessage>>, ChatConversationMessagesQuery>({
      query: ({ conversationId, cursor }) => ({
        url: `/api/chat/chat_conversations/${conversationId}/messages`,
        params: cursor === undefined ? undefined : { cursor },
      }),
      keepUnusedDataFor: 0,
    }),
    getProductConversation: builder.mutation<ApiResponse<ChatConversation>, number>({
      query: (productId) => ({ url: `/api/chat/chat_conversations/${productId}`, method: "POST" }),
    }),
    readChatConversation: builder.mutation<ApiResponse<ChatReadReceipt>, number>({
      query: (conversationId) => ({ url: `/api/chat/conversations/${conversationId}/read`, method: "PUT" }),
    }),
    createChatWsTicket: builder.mutation<ApiResponse<ChatWsTicket>, void>({
      query: () => ({ url: "/api/chat/ws-ticket", method: "POST" }),
    }),
  }),
});

// Không lưu kết quả mở room hoặc ticket trong mutation cache.
export const requestProductConversation = (productId: number) =>
  chatApi.endpoints.getProductConversation.initiate(productId, { track: false });
// Giữ subscription trong lúc tải để RTK không hủy request trùng; caller giải phóng ở finally.
export const requestChatConversationMessages = (query: ChatConversationMessagesQuery) =>
  chatApi.endpoints.getChatConversationMessages.initiate(query, { subscribe: true, forceRefetch: true });
export const requestChatWsTicket = () =>
  chatApi.endpoints.createChatWsTicket.initiate(undefined, { track: false });


export const { useGetChatConversationMessagesQuery } = chatApi;


// Chỉ gửi ID room, danh tính người đọc được BE lấy từ phiên cookie hiện tại.
export const requestReadChatConversation = (conversationId: number) =>
  chatApi.endpoints.readChatConversation.initiate(conversationId, { track: false });
