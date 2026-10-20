"use client";

import { useEffect, useState } from "react";
import { useChatInboxNavigation } from "@/hooks/shared/useChatInboxNavigation";
import { useChatInboxSelection } from "@/hooks/shared/useChatInboxSelection";
import type { ChatInboxServerData } from "@/types/shared/chat-inbox";
import type { ShopChatConversation } from "@/types/shop/chat";
import { filterShopChatConversations } from "@/utils/shop-chat.utils";

// Nhận danh sách server đúng tài khoản; quản lý lựa chọn và bộ lọc phía client.
export function useShopChat(inbox: ChatInboxServerData<ShopChatConversation>) {
  const navigation = useChatInboxNavigation(inbox.viewerId);
  const { user, isCheckingAuth } = navigation;
  // Lấy trang từ server; giữ lựa chọn và từ khóa tìm trong trang hiện tại.
  const page = inbox.data.page;
  const [keyword, setKeyword] = useState("");
  // Lọc các room chưa đọc trong trang hiện tại, kết hợp với từ khóa.
  const [unreadOnly, setUnreadOnly] = useState(false);
  // Trên mobile chỉ đổi vùng hiển thị, không unmount room khi quay về hộp thư.
  const [showMobileList, setShowMobileList] = useState(true);
  // Desktop vẫn hiện room khi danh sách mobile được chọn; mobile thì không tự đọc room ẩn.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const canAccess = !isCheckingAuth && !!user?.role.includes("ROLE_SHOP");
  // Dữ liệu server chỉ hiển thị cho đúng tài khoản đang xem.
  const data = canAccess && user?.userId === inbox.viewerId ? inbox.data : null;
  const conversations = data?.items ?? [];
  const filtered = filterShopChatConversations(conversations, keyword, unreadOnly);
  // Chỉ mở room do người dùng chọn; tìm kiếm và refresh không đóng room đang kết nối.
  const selection = useChatInboxSelection({
    conversations, viewerId: user?.userId ?? null, enabled: !!data,
    page, pending: navigation.pending || navigation.refreshing, error: inbox.error, navigate: navigation.navigate,
  });
  const { selected } = selection;
  const error = isCheckingAuth || navigation.pending ? "" : !user ? "Vui lòng đăng nhập để xem hộp thư." : inbox.error;

  // Chặn nhảy ngoài phạm vi hoặc đổi trang trong khi request trước chưa xong.
  const changePage = (nextPage: number) => {
    if (nextPage < 1 || nextPage > (data?.totalPages ?? 1) || navigation.pending) return;
    selection.close();
    setShowMobileList(true);
    navigation.navigate(nextPage);
  };

  // Đóng danh sách mobile sau khi chọn khách hàng.
  const select = (conversationId: number) => {
    if (selection.select(conversationId)) setShowMobileList(false);
  };

  // Bỏ chọn room khi đóng; cleanup hiện có ngắt socket và dọn hàng đợi của room.
  const closeConversation = () => {
    selection.close();
    setShowMobileList(true);
  };
  return {
    conversations: navigation.pending ? [] : filtered, selected, userId: user?.userId, keyword, setKeyword, select,
    unreadOnly, setUnreadOnly,
    unreadRoomsInPage: conversations.filter((conversation) => conversation.unreadMessageCount > 0).length,
    roomVisible: desktop || !showMobileList,
    showMobileList, showConversations: () => setShowMobileList(true), closeConversation,
    page, pageSize: data?.pageSize ?? 20, totalItems: data?.totalItems ?? 0,
    totalPages: data?.totalPages ?? 0, canAccess, error,
    loading: isCheckingAuth || navigation.pending,
    retry: navigation.refresh,
    previousPage: () => changePage(page - 1),
    nextPage: () => changePage(page + 1),
  };
}

export type ShopChatState = ReturnType<typeof useShopChat>;




