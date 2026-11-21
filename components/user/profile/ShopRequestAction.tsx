"use client";

import { useId } from "react";
import { ChevronRight, Loader2, Store, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useShopRequest } from "@/hooks/user/profile/useShopRequest";

// Mục "Đăng ký mở shop" trong lối tắt: xem đơn gần nhất, nộp đơn mới hoặc hủy đơn đang chờ duyệt.
export function ShopRequestAction() {
  const titleId = useId();
  const {
    dialogRef, open, close, form, rules, submit, cancel, isCancelling, latest, isLoadingLatest, latestError,
    provinces, provincesFailed, wards, wardsFailed, hasProvince, hasWard,
  } = useShopRequest();
  const { register, formState: { errors, isSubmitting } } = form;
  const pending = latest?.status === "PENDING";

  return (
    <>
      <button type="button" onClick={open} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">
        <Store className="size-4 text-primary" aria-hidden="true" />
        <span className="flex-1">Đăng ký mở shop</span>
        <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
      </button>

      <dialog ref={dialogRef} aria-labelledby={titleId}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-xs">
        <header className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4">
          <h2 id={titleId} className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Store className="size-4 text-primary" aria-hidden="true" /> Đăng ký mở shop
          </h2>
          <button type="button" onClick={close} aria-label="Đóng" className="rounded-md p-1 text-slate-400 hover:text-slate-600">
            <X className="size-5" aria-hidden="true" />
          </button>
        </header>

        {isLoadingLatest ? (
          <p className="px-5 py-6 text-sm text-slate-500">Đang tải thông tin đơn đăng ký...</p>
        ) : latestError ? (
          <p role="alert" className="px-5 py-6 text-sm text-danger">Không thể tải thông tin đơn đăng ký.</p>
        ) : pending && latest ? (
          <div className="space-y-3 px-5 py-5 text-sm">
            <p className="rounded-lg bg-amber-50 px-3 py-2 font-semibold text-amber-700">Đơn đang chờ quản trị viên duyệt.</p>
            <dl className="space-y-1.5 text-slate-700">
              <div><dt className="inline text-slate-500">Tên shop: </dt><dd className="inline font-semibold">{latest.shopName}</dd></div>
              <div><dt className="inline text-slate-500">Số điện thoại: </dt><dd className="inline">{latest.shopPhone}</dd></div>
              <div><dt className="inline text-slate-500">Địa chỉ: </dt><dd className="inline">{latest.addressDetail}, {latest.ward}, {latest.provinceName}</dd></div>
            </dl>
            <div className="flex justify-end border-t border-slate-100 pt-4">
              <button type="button" onClick={cancel} disabled={isCancelling}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-red-200 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50">
                {isCancelling && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                Hủy đơn
              </button>
            </div>
          </div>
        ) : provincesFailed ? (
          <p role="alert" className="px-5 py-6 text-sm text-danger">Không tải được danh sách tỉnh/thành phố, vui lòng thử lại sau. Hiện chưa thể gửi đơn đăng ký mở shop.</p>
        ) : !provinces ? (
          <p role="status" className="px-5 py-6 text-sm text-slate-500">Đang tải danh sách tỉnh/thành phố...</p>
        ) : (
          <form onSubmit={submit} noValidate aria-busy={isSubmitting} className="space-y-4 px-5 py-5">
            {latest?.status === "REJECTED" && (
              <p role="status" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Đơn trước bị từ chối{latest.rejectReason ? `: ${latest.rejectReason}` : "."} Bạn có thể gửi đơn mới.
              </p>
            )}
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-name`} className="text-sm font-semibold text-slate-700">Tên shop</label>
              <Input id={`${titleId}-name`} {...register("shopName", rules.shopName)} autoFocus maxLength={100}
                aria-required="true" aria-invalid={!!errors.shopName} error={errors.shopName?.message} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-desc`} className="text-sm font-semibold text-slate-700">Mô tả shop (không bắt buộc)</label>
              <Textarea id={`${titleId}-desc`} {...register("shopDescription", rules.shopDescription)} rows={3} maxLength={2000}
                aria-invalid={!!errors.shopDescription} error={errors.shopDescription?.message} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-phone`} className="text-sm font-semibold text-slate-700">Số điện thoại shop</label>
              <Input id={`${titleId}-phone`} type="tel" autoComplete="tel" placeholder="VD: 0373106887 hoặc +84373106887"
                {...register("shopPhone", rules.shopPhone)} aria-required="true" aria-invalid={!!errors.shopPhone} error={errors.shopPhone?.message} />
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-province`} className="text-sm font-semibold text-slate-700">Tỉnh/Thành phố</label>
              <Input id={`${titleId}-province`} list={`${titleId}-provinces`} autoComplete="off" placeholder="Nhập để tìm tỉnh/thành phố"
                {...register("provinceName", rules.provinceName)} aria-required="true" aria-invalid={!!errors.provinceName} error={errors.provinceName?.message} />
              <datalist id={`${titleId}-provinces`}>
                {provinces.map((item) => <option key={item.code} value={item.name} />)}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-ward`} className="text-sm font-semibold text-slate-700">Xã/Phường</label>
              <Input id={`${titleId}-ward`} list={`${titleId}-wards`} autoComplete="off" disabled={!hasProvince}
                placeholder={hasProvince ? "Nhập để tìm xã/phường" : "Chọn tỉnh/thành phố trước"}
                {...register("ward", rules.ward)} aria-required="true" aria-invalid={!!errors.ward}
                error={errors.ward?.message ?? (wardsFailed ? "Không tải được danh sách xã/phường, vui lòng thử lại sau." : undefined)} />
              <datalist id={`${titleId}-wards`}>
                {wards.map((ward) => <option key={ward} value={ward} />)}
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label htmlFor={`${titleId}-detail`} className="text-sm font-semibold text-slate-700">Địa chỉ chi tiết</label>
              <Input id={`${titleId}-detail`} disabled={!hasWard} placeholder={hasWard ? "Số nhà, tên đường..." : "Chọn xã/phường trước"}
                {...register("addressDetail", rules.addressDetail)} aria-required="true" aria-invalid={!!errors.addressDetail} error={errors.addressDetail?.message} />
            </div>
            {errors.root && <p role="alert" className="text-sm text-danger">{errors.root.message}</p>}
            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <button type="button" onClick={close} disabled={isSubmitting}
                className="h-9 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 disabled:opacity-50">
                Đóng
              </button>
              <button type="submit" disabled={isSubmitting || wardsFailed}
                className="inline-flex h-9 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">
                {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
                Gửi đơn
              </button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
