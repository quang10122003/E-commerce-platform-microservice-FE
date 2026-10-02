import { Lock, Mail, User, UserPlus } from "lucide-react";
import { Button, Input } from "@/components/ui";
import type { RegisterRequest } from "@/types/auth";
import type { UseFormReturn } from "react-hook-form";

type RegisterFormProps = {
  form: UseFormReturn<RegisterRequest>;
  onSubmit: (formData: RegisterRequest) => Promise<void>;
  error: string | null;
  isLoading: boolean;
  showPassword: boolean;
};

export function RegisterForm({ form, onSubmit, error, isLoading, showPassword }: RegisterFormProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
      <div className="space-y-1"><label className="text-xs font-bold text-main">Họ và tên</label><Input type="text" placeholder="Nguyễn Văn A" leftIcon={<User className="w-4 h-4" />} {...form.register("fullName", { validate: (value) => value.trim().length > 0 || "Họ tên là bắt buộc.", maxLength: { value: 30, message: "Họ tên không được vượt quá 30 ký tự." } })} error={form.formState.errors.fullName?.message} className="h-10.5" /></div>
      <div className="space-y-1"><label className="text-xs font-bold text-main">Email</label><Input type="email" placeholder="you@example.com" leftIcon={<Mail className="w-4 h-4" />} {...form.register("email", { required: "Email là bắt buộc.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email không đúng định dạng." } })} error={form.formState.errors.email?.message} className="h-10.5" /></div>
      <div className="space-y-1"><label className="text-xs font-bold text-main">Mật khẩu</label><Input type={showPassword ? "text" : "password"} placeholder="Tối thiểu 6 ký tự" leftIcon={<Lock className="w-4 h-4" />} {...form.register("password", { required: "Mật khẩu là bắt buộc.", minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự." } })} error={form.formState.errors.password?.message} className="h-10.5" /></div>
      <Button type="submit" variant="gradient-cta" size="lg" fullWidth isLoading={isLoading} leftIcon={<UserPlus className="w-4 h-4" />} className="rounded-xl font-bold shadow-glow-cta mt-2">Đăng Ký Thành Viên</Button>
      {error && <p className="text-center text-xs font-semibold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200" role="alert">{error}</p>}
    </form>
  );
}
