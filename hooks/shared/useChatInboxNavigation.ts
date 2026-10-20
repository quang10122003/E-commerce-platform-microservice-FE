"use client";

import { useCallback, useEffect, useRef, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/lib/redux/hooks";
import { useMounted } from "@/lib/hooks";
import { useChatInboxSocket } from "@/hooks/shared/useChatInboxSocket";

// Điều hướng phân trang và đồng bộ lại Server Component sau thay đổi read/socket.
export function useChatInboxNavigation(viewerId: number | null) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();
  // Read/socket chỉ cập nhật nền, không kích hoạt skeleton của thao tác chuyển trang.
  const [refreshing, startRefreshTransition] = useTransition();
  const { user, isCheckingAuth: authChecking } = useAppSelector((state) => state.auth);
  // Redux có thể xác thực xong trước khi segment streaming hydrate; giữ snapshot đầu giống server.
  const mounted = useMounted();
  const isCheckingAuth = !mounted || authChecking;
  // Chỉ subscribe hộp thư sau khi xác nhận cùng tài khoản với dữ liệu server.
  useChatInboxSocket(!isCheckingAuth && user?.userId === viewerId ? viewerId : null);
  const revision = useAppSelector((state) => state.chatInbox[viewerId ?? 0] ?? 0);
  const previousRevision = useRef(revision);
  const previousViewer = useRef(user?.userId);

  // Refresh giữ state và room đang mount, không tạo lại socket hoặc mất hàng đợi.
  const refresh = useCallback(() => startRefreshTransition(() => router.refresh()), [router]);
  useEffect(() => {
    // Đợi điều hướng hoặc lượt refresh hiện tại xong, không làm gián đoạn chuyển trang.
    if (isCheckingAuth || user?.userId !== viewerId || pending || refreshing) return;
    if (revision === previousRevision.current) return;
    const timer = setTimeout(() => {
      previousRevision.current = revision;
      refresh();
    }, 180);
    return () => clearTimeout(timer);
  }, [revision, refresh, isCheckingAuth, user?.userId, viewerId, pending, refreshing]);

  // Khi đăng nhập hoặc đổi tài khoản, không dùng hộp thư từ phiên server cũ.
  useEffect(() => {
    if (isCheckingAuth) return;
    const changed = previousViewer.current !== user?.userId;
    previousViewer.current = user?.userId;
    if (changed || (user && user.userId !== viewerId)) refresh();
  }, [user, isCheckingAuth, viewerId, refresh]);

  // Giữ bộ lọc URL khác và không cuộn trang khi chuyển hộp thư.
  const navigate = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    startTransition(() => router.replace(`${pathname}?${params}`, { scroll: false }));
  };

  return { pending, refreshing, refresh, navigate, user, isCheckingAuth };
}
