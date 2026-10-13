"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useRecoverSessionMutation } from "@/lib/redux/services/auth-api";
import { setUser } from "@/lib/redux/slices/auth-slice";
import { isSessionRefreshRequiredError } from "@/lib/auth/session-recovery-error";

// Chặn recovery tự động lặp lại liên tục nếu request gốc vẫn bị 401 sau khi kiểm tra phiên.
const automaticAttempts = new Map<string, number>();

// Khôi phục phiên qua BFF một lần trước khi retry cây Server Component bị lỗi.
export function useSessionRecovery(error: Error & { digest?: string }, retry: () => void) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [recoverSession] = useRecoverSessionMutation();
  const needsRecovery = isSessionRefreshRequiredError(error);
  // Lưu trạng thái recovery hoặc yêu cầu đăng nhập, không lưu token.
  const [status, setStatus] = useState<"recovering" | "failed" | "login">(needsRecovery ? "recovering" : "failed");
  // Điều khiển modal đăng nhập dùng chung khi phiên không thể cấp lại.
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const attempted = useRef(false);
  const lastError = useRef(error);

  // BFF giữ toàn bộ refresh/token; client chỉ nhận thông tin user an toàn.
  const recover = useCallback(async () => {
    setStatus("recovering");
    try {
      const result = await recoverSession().unwrap();
      if (!result.success || !result.data) {
        setStatus("failed");
        return;
      }
      dispatch(setUser(result.data));
      retry();
    } catch (cause) {
      const unauthorized = typeof cause === "object" && cause !== null && "status" in cause && cause.status === 401;
      setStatus(unauthorized ? "login" : "failed");
    }
  }, [dispatch, recoverSession, retry]);

  useEffect(() => {
    // Retry vẫn lỗi thì dừng recovery, không giữ spinner hoặc lặp request vô hạn.
    if (attempted.current) {
      if (lastError.current !== error) {
        lastError.current = error;
        void Promise.resolve().then(() => setStatus("failed"));
      }
      return;
    }
    if (!needsRecovery) return;
    attempted.current = true;
    const now = Date.now();
    for (const [path, timestamp] of automaticAttempts) {
      if (now - timestamp >= 30_000) automaticAttempts.delete(path);
    }
    const lastAttempt = automaticAttempts.get(pathname) ?? 0;
    if (now - lastAttempt < 30_000) {
      void Promise.resolve().then(() => setStatus("failed"));
      return;
    }
    automaticAttempts.set(pathname, now);
    void Promise.resolve().then(recover);
  }, [error, needsRecovery, pathname, recover]);

  // Đăng nhập thành công qua modal sẽ chạy lại request server ban đầu.
  useEffect(() => {
    if (status === "login" && user) retry();
  }, [status, user, retry]);

  return {
    status, needsRecovery, isLoginOpen,
    retry: needsRecovery ? recover : retry,
    openLogin: () => setIsLoginOpen(true),
    closeLogin: () => setIsLoginOpen(false),
  };
}
