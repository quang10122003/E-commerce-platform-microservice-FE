"use client";

import { useRouteLogin } from "@/hooks/auth/useRouteLogin";
import { AuthModal } from "./auth-modal";

// Dùng lại form tài khoản cho các route yêu cầu đăng nhập.
export function RouteLoginPrompt() {
  const login = useRouteLogin();
  if (!login.isOpen) return null;

  return <AuthModal isOpen onClose={login.close} onAuthenticated={login.onAuthenticated} />;
}
