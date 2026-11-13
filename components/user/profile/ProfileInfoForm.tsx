"use client";

import { Loader2, Pencil } from "lucide-react";
import type { RegisterOptions } from "react-hook-form";
import { OrderTimeView } from "@/components/user/orders/OrderTimeView";
import { useProfileForm } from "@/hooks/user/profile/useProfileForm";
import type { UpdateProfileForm, UserProfile } from "@/types/user/profile";

interface ProfileField {
  name: keyof UpdateProfileForm;
  label: string;
  maxLength: number;
  rules: RegisterOptions<UpdateProfileForm, keyof UpdateProfileForm>;
}

// Thêm trường sửa được mới chỉ cần khai báo ở đây và trong UpdateProfileForm.
const PROFILE_FIELDS: ProfileField[] = [
  {
    name: "fullName", label: "Họ và tên", maxLength: 30,
    rules: {
      validate: (value) => value.trim().length > 0 || "Họ và tên không được để trống.",
      maxLength: { value: 30, message: "Họ và tên tối đa 30 ký tự." },
    },
  },
];

function InfoRow({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-center sm:gap-6">
      <dt className="w-36 shrink-0 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}
      </dt>
      <dd className="min-w-0 flex-1 break-words text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

// Thông tin tài khoản: trường sửa được có bút chì; đang sửa thì hiện Hủy/Lưu cuối khung, Lưu gửi một request.
export function ProfileInfoForm({ profile }: { profile: UserProfile }) {
  const { form, editing, isEditing, isSaving, startEdit, cancel, save } = useProfileForm(profile);
  const { register, formState: { errors, isValid }, getValues } = form;

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white px-6 py-2 lg:col-span-2" aria-labelledby="account-info-title">
      <h2 id="account-info-title" className="border-b border-slate-100 py-3 text-sm font-bold text-slate-900">Thông tin tài khoản</h2>
      <form onSubmit={save} aria-busy={isSaving} noValidate>
        <dl className="divide-y divide-slate-100">
          {PROFILE_FIELDS.map(({ name, label, maxLength, rules }) => {
            const inputId = `profile-${name}`;
            const error = errors[name]?.message;
            return (
              <InfoRow key={name} label={label} htmlFor={editing.has(name) ? inputId : undefined}>
                {editing.has(name) ? (
                  <>
                    <input id={inputId} {...register(name, rules)} maxLength={maxLength} autoFocus disabled={isSaving}
                      aria-invalid={Boolean(error)} aria-describedby={error ? `${inputId}-error` : undefined}
                      onKeyDown={(event) => { if (event.key === "Escape") cancel(); }}
                      className="h-9 w-full max-w-sm rounded-lg border border-slate-200 px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 aria-[invalid=true]:border-red-400" />
                    {error && <p id={`${inputId}-error`} className="mt-1 text-xs text-red-500">{error}</p>}
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    {getValues(name)}
                    <button type="button" onClick={() => startEdit(name)} aria-label={`Sửa ${label.toLowerCase()}`}
                      className="rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                )}
              </InfoRow>
            );
          })}
          <InfoRow label="Email">{profile.email}</InfoRow>
          <InfoRow label="Ngày tham gia">{profile.createdAt ? <OrderTimeView value={profile.createdAt} /> : "—"}</InfoRow>
        </dl>

        {isEditing && (
          <div className="flex justify-end gap-2 border-t border-slate-100 py-4">
            <button type="button" onClick={cancel} disabled={isSaving}
              className="h-9 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:opacity-50">
              Hủy
            </button>
            <button type="submit" disabled={isSaving || !isValid}
              className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
              {isSaving && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              Lưu thay đổi
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
