"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";

import { useMounted } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/redux/hooks";
import { useLoginMutation } from "@/lib/redux/services/auth-api";
import { setUser } from "@/lib/redux/slices/auth-slice";

export type AuthTab = "login" | "register";

type AuthModalOptions = {
  initialTab: AuthTab;
  isOpen: boolean;
  onClose: () => void;
};

// Quản lý form, xác thực đăng nhập và side-effect của modal tài khoản.
export function useAuthModal({ initialTab, isOpen, onClose }: AuthModalOptions) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();

  // Khóa cuộn trang khi modal tài khoản đang mở.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Đóng modal bằng phím Escape.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Gửi thông tin đăng nhập và lưu user vào Redux sau khi thành công.
  const handleLoginSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      setLoginError(null);

      try {
        const response = await login(loginForm).unwrap();
        if (!response.success || !response.data) {
          setLoginError(response.message || "Đăng nhập thất bại.");
          return;
        }

        dispatch(setUser(response.data));
        onClose();
      } catch {
        setLoginError("Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.");
      }
    },
    [dispatch, login, loginForm, onClose]
  );

  // Tiếp nhận form đăng ký theo flow giao diện hiện tại.
  const handleRegisterSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      console.log("Register:", registerForm);
    },
    [registerForm]
  );

  // Chuyển tab và xóa trạng thái lỗi của form đăng nhập.
  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setShowPassword(false);
    setLoginError(null);
  };

  return {
    activeTab,
    handleLoginSubmit,
    handleRegisterSubmit,
    isLoginLoading,
    loginError,
    loginForm,
    mounted,
    registerForm,
    setLoginForm,
    setRegisterForm,
    setShowPassword,
    showPassword,
    switchTab,
  };
}
