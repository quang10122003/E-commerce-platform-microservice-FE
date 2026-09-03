"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  LogIn,
  UserPlus,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks";

type AuthTab = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
}

export function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const mounted = useMounted();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form states
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Khóa thao tác cuộn trang khi modal đang mở.
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleLoginSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Integrate with auth API
      console.log("Login:", loginForm);
    },
    [loginForm]
  );

  const handleRegisterSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      // TODO: Integrate with auth API
      console.log("Register:", registerForm);
    },
    [registerForm]
  );

  const switchTab = (tab: AuthTab) => {
    setActiveTab(tab);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300",
        isOpen
          ? "visible pointer-events-auto"
          : "invisible pointer-events-none"
      )}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative z-[10000] w-full max-w-md bg-white rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary via-indigo-600 to-indigo-700 px-6 pt-6 pb-10">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 active:scale-90 transition-all"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <h2 className="text-xl font-bold text-white mb-1">
            {activeTab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </h2>
          <p className="text-sm text-indigo-200">
            {activeTab === "login"
              ? "Chào mừng trở lại! Đăng nhập để tiếp tục mua sắm."
              : "Tạo tài khoản mới để nhận ưu đãi hấp dẫn."}
          </p>
        </div>

        {/* Tab Switcher - overlapping the header gradient */}
        <div className="relative -mt-5 mx-6 mb-4">
          <div className="flex bg-slate-100 rounded-xl p-1 shadow-sm">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === "login"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LogIn className="w-4 h-4" />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === "register"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <UserPlus className="w-4 h-4" />
              Đăng ký
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6">
          {/* ========== LOGIN FORM ========== */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-main">
                    Mật khẩu
                  </label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer select-none"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                leftIcon={<LogIn className="w-4 h-4" />}
                className="rounded-xl shadow-md shadow-primary/20"
              >
                Đăng nhập
              </Button>

              {/* Divider */}
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-muted-foreground font-medium">
                    hoặc đăng nhập bằng
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="text-xs font-semibold gap-2 rounded-xl"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="text-xs font-semibold gap-2 rounded-xl"
                >
                  <svg
                    className="w-4 h-4 text-[#1877F2]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              {/* Switch to register */}
              <p className="text-center text-sm text-muted-foreground pt-1">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="text-primary font-semibold hover:underline"
                >
                  Đăng ký ngay
                </button>
              </p>
            </form>
          )}

          {/* ========== REGISTER FORM ========== */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Họ và tên
                </label>
                <Input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  leftIcon={<User className="w-4 h-4" />}
                  value={registerForm.fullName}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      fullName: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      email: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Số điện thoại
                </label>
                <Input
                  type="tel"
                  placeholder="0912 345 678"
                  leftIcon={<Phone className="w-4 h-4" />}
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      phone: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Mật khẩu
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-main">
                  Xác nhận mật khẩu
                </label>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  }
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="h-11"
                />
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-0.5 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="text-xs text-muted-foreground cursor-pointer select-none leading-relaxed"
                >
                  Tôi đồng ý với{" "}
                  <span className="text-primary font-medium hover:underline cursor-pointer">
                    Điều khoản dịch vụ
                  </span>{" "}
                  và{" "}
                  <span className="text-primary font-medium hover:underline cursor-pointer">
                    Chính sách bảo mật
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="cta"
                size="lg"
                fullWidth
                leftIcon={<UserPlus className="w-4 h-4" />}
                className="rounded-xl shadow-md shadow-cta/20"
              >
                Tạo tài khoản
              </Button>

              {/* Switch to login */}
              <p className="text-center text-sm text-muted-foreground pt-1">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-primary font-semibold hover:underline"
                >
                  Đăng nhập
                </button>
              </p>
            </form>
          )}

         
        </div>
      </div>
    </div>,
    document.body
  );
}
