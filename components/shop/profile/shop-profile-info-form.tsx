"use client";

import { Loader2, Pencil } from "lucide-react";
import type { RegisterOptions } from "react-hook-form";
import { OrderTimeView } from "@/components/user/orders/OrderTimeView";
import { useShopProfileForm } from "@/hooks/shop/profile/useShopProfileForm";
import type { SellerShopProfile, UpdateShopProfileForm } from "@/types/shop/profile";

interface ShopProfileField {
  name: keyof UpdateShopProfileForm;
  label: string;
  maxLength: number;
  multiline: boolean;
  emptyText: string;
  rules: RegisterOptions<UpdateShopProfileForm, keyof UpdateShopProfileForm>;
}

// Thêm trường sửa được mới chỉ cần khai báo ở đây và trong UpdateShopProfileForm; giới hạn khớp BE.
const SHOP_FIELDS: ShopProfileField[] = [
  {
    name: "shopName", label: "Tên shop", maxLength: 100, multiline: false, emptyText: "—",
    rules: {
      validate: (value) => value.trim().length > 0 || "Tên shop không được để trống.",
      maxLength: { value: 100, message: "Tên shop tối đa 100 ký tự." },
    },
  },
  {
    name: "shopDescription", label: "Mô tả", maxLength: 2000, multiline: true, emptyText: "Chưa có mô tả.",
    rules: { maxLength: { value: 2000, message: "Mô tả shop tối đa 2000 ký tự." } },
  },
];

const INPUT_CLASS = "w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:bg-slate-50 aria-[invalid=true]:border-red-400";

function InfoRow({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-start sm:gap-6">
      <dt className="w-36 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {htmlFor ? <label htmlFor={htmlFor}>{label}</label> : label}
      </dt>
      <dd className="min-w-0 flex-1 whitespace-pre-line break-words text-sm font-medium text-slate-800">{children}</dd>
    </div>
  );
}

// Thông tin shop: trường sửa được có bút chì; đang sửa thì hiện Hủy/Lưu cuối khung, Lưu gửi một request.
export function ShopProfileInfoForm({ shop }: { shop: SellerShopProfile }) {
  const { form, editing, isEditing, isSaving, startEdit, cancel, save } = useShopProfileForm(shop);
  const { register, watch, formState: { errors, isValid } } = form;
  const values = watch();

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white px-6 py-2 lg:col-span-2" aria-labelledby="shop-info-title">
      <h2 id="shop-info-title" className="border-b border-slate-100 py-3 text-sm font-bold text-slate-900">Thông tin shop</h2>
      <form onSubmit={save} aria-busy={isSaving} noValidate>
        <dl className="divide-y divide-slate-100">
          {SHOP_FIELDS.map(({ name, label, maxLength, multiline, emptyText, rules }) => {
            const inputId = `shop-${name}`;
            const error = errors[name]?.message;
            const inputProps = {
              id: inputId, ...register(name, rules), maxLength, autoFocus: true, disabled: isSaving,
              "aria-invalid": Boolean(error), "aria-describedby": error ? `${inputId}-error` : undefined,
              onKeyDown: (event: React.KeyboardEvent) => { if (event.key === "Escape") cancel(); },
            };
            return (
              <InfoRow key={name} label={label} htmlFor={editing.has(name) ? inputId : undefined}>
                {editing.has(name) ? (
                  <>
                    {multiline
                      ? <textarea {...inputProps} rows={4} className={`${INPUT_CLASS} resize-y py-2`} />
                      : <input {...inputProps} className={`${INPUT_CLASS} h-9 max-w-sm`} />}
                    <div className="mt-1 flex justify-between gap-2 text-xs">
                      <span className="text-red-500" id={`${inputId}-error`}>{error}</span>
                      {multiline && <span className="text-slate-400">{values[name].length}/{maxLength}</span>}
                    </div>
                  </>
                ) : (
                  <span className="inline-flex items-start gap-2">
                    <span>{values[name].trim() || emptyText}</span>
                    <button type="button" onClick={() => startEdit(name)} aria-label={`Sửa ${label.toLowerCase()}`}
                      className="shrink-0 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-primary focus-visible:outline-2 focus-visible:outline-primary">
                      <Pencil className="size-3.5" aria-hidden="true" />
                    </button>
                  </span>
                )}
              </InfoRow>
            );
          })}
          <InfoRow label="Địa chỉ">{shop.location || "—"}</InfoRow>
          <InfoRow label="Ngày mở shop">{shop.shopCreatedAt ? <OrderTimeView value={shop.shopCreatedAt} /> : "—"}</InfoRow>
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
