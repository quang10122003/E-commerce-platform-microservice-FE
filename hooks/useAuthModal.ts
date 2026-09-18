import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useMounted } from "@/lib/hooks";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  useLoginMutation,
  useRegisterMutation,
} from "@/lib/redux/services/auth-api";
import { setUser } from "@/lib/redux/slices/auth-slice";
import { getApiErrorMessage } from "@/lib/utils";
import type { LoginRequest, RegisterRequest } from "@/types/auth";

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
  const [registerError, setRegisterError] = useState<string | null>(null);
  // Quản lý dữ liệu và validation cho form đăng nhập.
  const loginForm = useForm<LoginRequest>({
    defaultValues: { email: "", password: "" },
  });

  // Quản lý dữ liệu và validation cho form đăng ký theo DTO backend.
  const registerForm = useForm<RegisterRequest>({
    defaultValues: { fullName: "", email: "", password: "" },
  });
  const mounted = useMounted();
  const dispatch = useAppDispatch();
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation();

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
    async (credentials: LoginRequest) => {
      setLoginError(null);

      try {
        const response = await login(credentials).unwrap();
        if (!response.success || !response.data) {
          setLoginError(response.message || "Đăng nhập thất bại.");
          return;
        }

        dispatch(setUser(response.data));
        onClose();
      } catch (err: unknown) {
        setLoginError(
          getApiErrorMessage(
            err,
            "Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu."
          )
        );
      }
    },
    [dispatch, login, onClose]
  );

  // Gửi dữ liệu đăng ký hợp lệ và đồng bộ user sau khi backend phản hồi thành công.
  const handleRegisterSubmit = useCallback(
    async (formData: RegisterRequest) => {
      setRegisterError(null);
      try {
        const response = await register(formData).unwrap();

        if (!response.success || !response.data) {
          setRegisterError(response.message || "Đăng ký thất bại.");
          return;
        }

        dispatch(setUser(response.data));
        onClose();
      } catch (err: unknown) {
        setRegisterError(
          getApiErrorMessage(
            err,
            "Đăng ký thất bại. Vui lòng kiểm tra lại thông tin."
          )
        );
      }
    },
    [dispatch, onClose, register]
  );

  // Chuyển tab và xóa trạng thái lỗi của form đăng nhập.
  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setShowPassword(false);
    setLoginError(null);
    setRegisterError(null);
  };

  return {
    activeTab,
    handleLoginSubmit,
    handleRegisterSubmit,
    isLoginLoading,
    isRegisterLoading,
    loginError,
    loginForm,
    mounted,
    registerForm,
    registerError,
    setShowPassword,
    showPassword,
    switchTab,
  };
}
