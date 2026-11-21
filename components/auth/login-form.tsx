import { Eye, EyeOff, Lock, Mail, LogIn } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { GoogleLoginButton } from "./google-login-button";
import type { LoginRequest } from "@/types/shared/auth";
import type { UseFormReturn } from "react-hook-form";

type LoginFormProps = {
  form: UseFormReturn<LoginRequest>;
  onSubmit: (credentials: LoginRequest) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
};

export function LoginForm({ form, onSubmit, error, isLoading, showPassword, onTogglePassword }: LoginFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5"><label className="text-xs font-bold text-main">Email</label><Input type="email" placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} {...form.register("email", { required: "Email là bắt buộc.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không đúng định dạng." } })} error={form.formState.errors.email?.message} className="h-11" /></div>
      <div className="space-y-1.5"><div className="flex items-center justify-between"><label className="text-xs font-bold text-main">Mật khẩu</label><button type="button" className="text-xs text-primary hover:text-primary-hover font-semibold hover:underline transition-colors cursor-pointer">Quên mật khẩu?</button></div>
        <Input type={showPassword ? "text" : "password"} placeholder="Nhập mật khẩu" leftIcon={<Lock className="w-4 h-4" />} rightIcon={<button type="button" onClick={onTogglePassword} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>} {...form.register("password", { required: "Mật khẩu là bắt buộc." })} error={form.formState.errors.password?.message} className="h-11" />
      </div>
      <div className="flex items-center gap-2"><input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary/20 cursor-pointer" /><label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer select-none font-medium">Ghi nhớ đăng nhập</label></div>
      <Button type="submit" variant="gradient-primary" size="lg" fullWidth isLoading={isLoading} leftIcon={<LogIn className="w-4 h-4" />} className="rounded-xl font-bold shadow-glow-primary">Đăng Nhập</Button>
      {error && <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200" role="alert">{error}</p>}
      <GoogleLoginButton />
    </form>
  );
}
