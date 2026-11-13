"use client";

import { useId, useState } from "react";
import { ChevronRight, Eye, EyeOff, KeyRound, Loader2, X } from "lucide-react";
import { useChangePassword } from "@/hooks/user/profile/useChangePassword";
import type { ChangePasswordForm } from "@/types/user/profile";

interface PasswordField {
  name: keyof ChangePasswordForm;
  label: string;
  autoComplete: string;
}

const FIELDS: PasswordField[] = [
  { name: "currentPassword", label: "Mật khẩu hiện tại", autoComplete: "current-password" },
  { name: "newPassword", label: "Mật khẩu mới", autoComplete: "new-password" },
  { name: "confirmPassword", label: "Nhập lại mật khẩu mới", autoComplete: "new-password" },
];

// Ô mật khẩu có nút hiện/ẩn để người dùng kiểm tra lại khi gõ.
function PasswordInput({ id, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input id={id} type={visible ? "text" : "password"} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props}
        className="h-10 w-full rounded-lg border border-slate-200 pl-3 pr-10 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 aria-[invalid=true]:border-red-400" />
      <button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:text-slate-600">
        {visible ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
      </button>
    </div>
  );
}

// Mục "Đổi mật khẩu" trong lối tắt, bấm vào mở popup gồm mật khẩu hiện tại, mật khẩu mới và nhập lại.
export function ChangePasswordAction() {
  const titleId = useId();
  const { dialogRef, form, rules, open, close, submit } = useChangePassword();
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <>
      <button type="button" onClick={open} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">
        <KeyRound className="size-4 text-primary" aria-hidden="true" />
        <span className="flex-1">Đổi mật khẩu</span>
        <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
      </button>

      <dialog ref={dialogRef} aria-labelledby={titleId}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs">
        <form onSubmit={submit} noValidate aria-busy={isSubmitting}>
          <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <h2 id={titleId} className="flex items-center gap-2 text-base font-bold text-slate-900">
              <KeyRound className="size-4 text-primary" aria-hidden="true" /> Đổi mật khẩu
            </h2>
            <button type="button" onClick={close} disabled={isSubmitting} aria-label="Đóng" className="rounded-md p-1 text-slate-400 hover:text-slate-600 disabled:opacity-50">
              <X className="size-5" aria-hidden="true" />
            </button>
          </header>

          <div className="space-y-4 px-5 py-5">
            {FIELDS.map(({ name, label, autoComplete }) => {
              const id = `${titleId}-${name}`;
              const error = errors[name]?.message;
              return (
                <div key={name}>
                  <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>
                  <PasswordInput id={id} error={error} autoComplete={autoComplete} maxLength={72} disabled={isSubmitting}
                    {...register(name, rules[name])} />
                  {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-500">{error}</p>}
                </div>
              );
            })}
          </div>

          <footer className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button type="button" onClick={close} disabled={isSubmitting}
              className="h-9 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:opacity-50">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Đổi mật khẩu
            </button>
          </footer>
        </form>
      </dialog>
    </>
  );
}
