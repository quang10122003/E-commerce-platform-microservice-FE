"use client";

import { createPortal } from "react-dom";
import { LogIn, Sparkles, UserPlus, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthModal, type AuthTab } from "@/hooks/useAuthModal";
import { LoginForm } from "./login-form";
import { RegisterForm } from "./register-form";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: AuthTab;
}

export function AuthModal({ isOpen, onClose, initialTab = "login" }: AuthModalProps) {
  const auth = useAuthModal({ initialTab, isOpen, onClose });
  if (!auth.mounted) return null;

  return createPortal(
    <div className={cn("fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300", isOpen ? "visible pointer-events-auto" : "invisible pointer-events-none")}>
      <div onClick={onClose} className={cn("fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300", isOpen ? "opacity-100" : "opacity-0")} aria-hidden="true" />
      <div className={cn("relative z-[10000] w-full max-w-md bg-white rounded-3xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100", isOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 translate-y-4")}>
        <div className="relative bg-gradient-to-br from-primary via-indigo-600 to-indigo-800 px-6 pt-7 pb-10 text-white">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 active:scale-90 transition-all cursor-pointer" aria-label="Đóng"><X className="w-5 h-5" /></button>
          <div className="flex items-center gap-2 mb-1"><span className="p-1 rounded-lg bg-white/20 text-amber-300"><Sparkles className="w-4 h-4" /></span><h2 className="text-xl font-black tracking-tight">{auth.activeTab === "login" ? "Đăng Nhập Tài Khoản" : "Tạo Tài Khoản Mới"}</h2></div>
          <p className="text-xs text-indigo-200">{auth.activeTab === "login" ? "Chào mừng trở lại! Đăng nhập để nhận ưu đãi mua sắm." : "Đăng ký thành viên nhận ngay voucher giảm 50.000đ."}</p>
        </div>
        <div className="relative -mt-5 mx-6 mb-4"><div className="flex bg-slate-100/90 rounded-2xl p-1 shadow-inner border border-slate-200/60">
          <button type="button" onClick={() => auth.switchTab("login")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer", auth.activeTab === "login" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}><LogIn className="w-3.5 h-3.5" />Đăng nhập</button>
          <button type="button" onClick={() => auth.switchTab("register")} className={cn("flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer", auth.activeTab === "register" ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:text-slate-900")}><UserPlus className="w-3.5 h-3.5" />Đăng ký</button>
        </div></div>
        <div className="px-6 pb-6">
          {auth.activeTab === "login" ? <LoginForm form={auth.loginForm} onSubmit={auth.handleLoginSubmit} error={auth.loginError} isLoading={auth.isLoginLoading} showPassword={auth.showPassword} onTogglePassword={() => auth.setShowPassword(!auth.showPassword)} /> : <RegisterForm form={auth.registerForm} onSubmit={auth.handleRegisterSubmit} error={auth.registerError} isLoading={auth.isRegisterLoading} showPassword={auth.showPassword} />}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-4 pt-3 border-t border-slate-100"><ShieldCheck className="w-3.5 h-3.5" /><span>Thông tin được bảo mật chuẩn mã hóa SSL</span></div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
