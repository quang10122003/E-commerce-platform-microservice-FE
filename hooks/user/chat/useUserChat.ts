"use client";

import { useEffect, useState } from "react";
import { useChatInboxNavigation } from "@/hooks/shared/useChatInboxNavigation";
import { useChatInboxSelection } from "@/hooks/shared/useChatInboxSelection";
import type { ChatInboxServerData } from "@/types/shared/chat-inbox";
import type { UserChatConversation } from "@/types/user/chat";
import { filterUserChatConversations, getUserChatViewModel } from "@/utils/user-chat.utils";

// Nhận hộp thư từ server, chỉ mở hội thoại do người dùng chọn.
export function useUserChat(inbox: ChatInboxServerData<UserChatConversation>) {
  const navigation = useChatInboxNavigation(inbox.viewerId);
  const { user, isCheckingAuth } = navigation;
  // Lấy trang từ server; giữ room đang mở và bộ lọc trong phiên hiện tại.
  const page = inbox.data.page;
  const [keyword, setKeyword] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  // Mobile chuyển giữa hộp thư và room mà không ngắt hàng đợi khi quay lại.
  const [showMobileList, setShowMobileList] = useState(true);
  // Chỉ đánh dấu đọc khi room thực sự hiện trên breakpoint hiện tại.
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  const canAccess = !isCheckingAuth && !!user;
  // Dữ liệu server chỉ hiển thị cho đúng tài khoản đang xem.
  const data = canAccess && user?.userId === inbox.viewerId ? inbox.data : null;
  const conversations = data?.items ?? [];
  const selection = useChatInboxSelection({
    conversations, viewerId: user?.userId ?? null, enabled: !!data,
    page, pending: navigation.pending || navigation.refreshing, error: inbox.error, navigate: navigation.navigate,
  });
  const { selected } = selection;
  const error = isCheckingAuth || navigation.pending ? "" : !user ? "Vui lòng đăng nhập để xem hộp thư." : inbox.error;

  // Chuyển trang đóng room cũ và dọn socket/hàng đợi bằng cleanup sẵn có.
  const changePage = (next: number) => {
    if (navigation.pending || next < 1 || next > (data?.totalPages ?? 1)) return;
    selection.close();
    setShowMobileList(true);
    navigation.navigate(next);
  };

  // Mở cửa sổ room sau khi chọn hội thoại từ danh sách.
  const select = (conversationId: number) => {
    if (selection.select(conversationId)) setShowMobileList(false);
  };

  // Bỏ chọn để unmount room, ngắt socket và hủy thao tác đọc đang chờ.
  const closeConversation = () => {
    selection.close();
    setShowMobileList(true);
  };

  return {
    selected: selected ? getUserChatViewModel(selected) : null, select, closeConversation, userId: user?.userId,
    showMobileList, showConversations: () => setShowMobileList(true), roomVisible: desktop || !showMobileList,
    conversations: navigation.pending ? [] : filterUserChatConversations(conversations, keyword, unreadOnly).map(getUserChatViewModel),
    unreadRoomsInPage: conversations.filter((item) => item.unreadMessageCount > 0).length,
    keyword, setKeyword, unreadOnly, setUnreadOnly, canAccess, error,
    loading: isCheckingAuth || navigation.pending, refreshing: navigation.pending,
    page, totalPages: data?.totalPages ?? 0, totalItems: data?.totalItems ?? 0,
    previousPage: () => changePage(page - 1), nextPage: () => changePage(page + 1),
    retry: navigation.refresh,
  };
}

export type UserChatState = ReturnType<typeof useUserChat>;
