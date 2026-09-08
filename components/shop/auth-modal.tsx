"use client";

import React from "react";
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
  Sparkles,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuthModal, type AuthTab } from "@/hooks/useAuthModal";


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
  const {
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
  } = useAuthModal({ initialTab, isOpen, onClose });

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
          "relative z-[10000] w-full max-w-md bg-white rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100",
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        )}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-br from-primary via-indigo-600 to-indigo-800 px-6 pt-7 pb-10 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-lg bg-white/20 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-black tracking-tight">
              {activeTab === "login" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}
            </h2>
          </div>
          <p className="text-xs text-indigo-200">
            {activeTab === "login"
              ? "Chào mừng trở lại! Đăng nhập để nhận ưu đãi mua sắm."
              : "Đăng ký thành viên nhận ngay voucher giảm 50.000đ."}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="relative -mt-5 mx-6 mb-4">
          <div className="flex bg-slate-100/90 rounded-2xl p-1 shadow-inner border border-slate-200/60">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer",
                activeTab === "login"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <LogIn className="w-3.5 h-3.5" />
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer",
                activeTab === "register"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              )}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Đăng ký
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="px-6 pb-6">
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-main">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={loginForm.email}
                  required
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-main">Mật khẩu</label>
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary-hover font-semibold hover:underline transition-colors cursor-pointer"
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
                      className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  value={loginForm.password}
                  required
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  className="h-11"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer"
                />
                <label
                  htmlFor="remember"
                  className="text-xs text-slate-600 cursor-pointer select-none font-medium"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <Button
                type="submit"
                variant="gradient-primary"
                size="lg"
                fullWidth
                isLoading={isLoginLoading}
                leftIcon={<LogIn className="w-4 h-4" />}
                className="rounded-xl font-bold shadow-glow-primary"
              >
                Đăng Nhập
              </Button>

              {loginError && (
                <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200" role="alert">
                  {loginError}
                </p>
              )}

              {/* Social login divider */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">
                    hoặc tiếp tục với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="text-xs font-bold rounded-xl gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  className="text-xs font-bold rounded-xl gap-2"
                >
                  <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </form>
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-main">Họ và tên</label>
                <Input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  leftIcon={<User className="w-4 h-4" />}
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  className="h-10.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-main">Email</label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  leftIcon={<Mail className="w-4 h-4" />}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="h-10.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-main">Mật khẩu</label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Tối thiểu 8 ký tự"
                  leftIcon={<Lock className="w-4 h-4" />}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="h-10.5"
                />
              </div>

              <Button
                type="submit"
                variant="gradient-cta"
                size="lg"
                fullWidth
                leftIcon={<UserPlus className="w-4 h-4" />}
                className="rounded-xl font-bold shadow-glow-cta mt-2"
              >
                Đăng Ký Thành Viên
              </Button>
            </form>
          )}

          {/* Trust badge */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-4 pt-3 border-t border-slate-100">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Thông tin được bảo mật chuẩn mã hóa SSL</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
