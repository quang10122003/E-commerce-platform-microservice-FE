import "server-only";
import { serverFetch, rethrowSessionRefreshRequired } from "@/lib/api/server-client";
import { getAccessToken, getRefreshToken } from "@/lib/auth/cookies";
import type { AccessTokenValidationResponse } from "@/types/shared/auth";
import type { ChatInboxServerData } from "@/types/shared/chat-inbox";
import type { ChatConversationPage, UserChatConversation } from "@/types/user/chat";
import type { ShopChatConversation } from "@/types/shop/chat";

// Xác thực phiên phía server và tải hộp thư đúng vai trò, không đưa token xuống client.
async function getChatInbox<T>(scope: "user" | "shop", value?: string | string[]): Promise<ChatInboxServerData<T>> {
  const parsed = typeof value === "string" && /^\d+$/.test(value) ? Number(value) : 1;
  const page = Number.isSafeInteger(parsed) && parsed > 0 ? parsed : 1;
  const result: ChatInboxServerData<T> = {
    data: { items: [], page, pageSize: 20, totalItems: 0, totalPages: 0 }, viewerId: null, error: "",
  };
  try {
    const [access, refresh] = await Promise.all([getAccessToken(), getRefreshToken()]);
    if (!access && !refresh) return { ...result, error: "Vui lòng đăng nhập để xem hộp thư." };
    const session = await serverFetch<AccessTokenValidationResponse>("api/auth/check_token", { cache: "no-store" });
    if (!session.payload.success || !session.payload.data) return { ...result, error: "Không xác thực được phiên đăng nhập." };
    result.viewerId = session.payload.data.userId;
    if (scope === "shop" && !session.payload.data.role.includes("ROLE_SHOP")) {
      return { ...result, error: "Tài khoản chưa có quyền truy cập hộp thư shop." };
    }
    const response = await serverFetch<ChatConversationPage<T>>(`api/chat/chat_conversations/${scope}?page=${page}&size=20`, { cache: "no-store" });
    if (!response.payload.success || !response.payload.data || response.status >= 400) {
      return { ...result, error: "Không tải được hộp thư. Vui lòng thử lại." };
    }
    return { ...result, data: response.payload.data };
  } catch (error) {
    rethrowSessionRefreshRequired(error);
    return { ...result, error: "Không tải được hộp thư. Vui lòng thử lại." };
  }
}

// Tải danh sách room người mua từ backend trong Server Component.
export async function getUserChatInbox(page?: string | string[]) {
  return getChatInbox<UserChatConversation>("user", page);
}

// Tải danh sách room của shop từ backend trong Server Component.
export async function getShopChatInbox(page?: string | string[]) {
  return getChatInbox<ShopChatConversation>("shop", page);
}
