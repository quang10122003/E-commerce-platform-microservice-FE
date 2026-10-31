import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { normalizeSessionReturnPath } from "@/lib/auth/session-refresh-redirect";
import { useAppSelector } from "@/lib/redux/hooks";

// Mở form theo redirect của Proxy và chỉ quay lại page nội bộ sau khi có user.
export function useRouteLogin() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useAppSelector((state) => state.auth.user);
  const isCheckingAuth = useAppSelector((state) => state.auth.isCheckingAuth);
  // Phân biệt đăng nhập vừa hoàn tất với người đã có phiên khi mở URL yêu cầu đăng nhập.
  const isReturningAfterLogin = useRef(false);
  const requiresLogin = searchParams.get("login") === "required";
  // Chờ kiểm tra phiên để không nháy form với người đã đăng nhập.
  const isOpen = requiresLogin && !isCheckingAuth && !user;
  const nextPath = normalizeSessionReturnPath(searchParams.get("next"));

  // Người đã đăng nhập bỏ URL mở form và về trang chủ, không tự đi theo next.
  useEffect(() => {
    if (requiresLogin && !isCheckingAuth && user && !isReturningAfterLogin.current) {
      router.replace("/", { scroll: false });
    }
  }, [requiresLogin, isCheckingAuth, user, router]);

  // Hủy đăng nhập thì bỏ tham số mở form, không đi vào route được bảo vệ.
  const close = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("login");
    params.delete("next");
    const query = params.toString();
    router.replace(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
  };

  // Tải lại page đích bằng cookie mới, tránh cache redirect và refresh đè navigation.
  const onAuthenticated = () => {
    isReturningAfterLogin.current = true;
    window.location.replace(nextPath);
  };

  return { isOpen, close, onAuthenticated };
}
