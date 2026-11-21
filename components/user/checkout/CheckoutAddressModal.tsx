import { X, MapPin, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { useCheckoutAddress } from "@/hooks/user/checkout/useCheckoutAddress";

type CheckoutAddressModalProps = {
  addressForm: ReturnType<typeof useCheckoutAddress>;
  // Hồ sơ dùng để quản lý (xóa, đặt mặc định) thay vì chọn địa chỉ cho đơn hàng.
  manage?: boolean;
};

// Sổ địa chỉ của người mua: chọn địa chỉ giao hàng hoặc tạo địa chỉ mới.
export function CheckoutAddressModal({ addressForm, manage = false }: CheckoutAddressModalProps) {
  const { dialogRef, close, submit, recipientNameField, phoneField, provinceField, wardField, detailField, provinces, wards,
    provincesLoading, provincesFailed, wardsFailed, hasProvince, hasWard, errors, addresses, selectedAddressId, addressesLoading, addressesError, formatAddress, select,
    isCreating, startCreate, cancelCreate, isSubmitting, remove, makeDefault, pendingId } = addressForm;

  return (
    <dialog ref={dialogRef} onClose={close} aria-labelledby="checkout-address-title"
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-xl border border-surface-border bg-surface-card p-5 text-main shadow-xl backdrop:bg-slate-900/60 backdrop:backdrop-blur-sm">
      {/* Tiêu đề và nút đóng form. */}
      <div className="mb-4 flex items-center justify-between border-b border-surface-border pb-3">
        <h2 id="checkout-address-title" className="flex items-center gap-2 text-base font-bold">
          <MapPin className="h-5 w-5 text-cta" aria-hidden="true" />
          Địa chỉ nhận hàng
        </h2>
        <button type="button" onClick={close} aria-label="Đóng form địa chỉ"
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      {!isCreating ? (
        <div className="space-y-3">
          {addressesLoading ? <p className="text-sm text-muted-foreground">Đang tải địa chỉ...</p>
            : addressesError ? <p role="alert" className="text-sm text-danger">Không thể tải danh sách địa chỉ.</p>
            : addresses.length === 0 ? <p className="text-sm text-muted-foreground">Bạn chưa có địa chỉ nào.</p> : (
            <ul className="space-y-2">
              {addresses.map((item) => (
                <li key={item.id}>
                  {manage ? (
                  <div className="rounded-lg border border-surface-border p-3 text-sm">
                    <span className="block text-slate-700">{formatAddress(item)}</span>
                    <div className="mt-2 flex flex-wrap items-center gap-3">
                      {item.defaultAddress
                        ? <span className="inline-block rounded border border-cta px-1.5 text-[11px] font-semibold text-cta">Mặc định</span>
                        : <button type="button" onClick={() => makeDefault(item.id)} disabled={pendingId !== null}
                            className="cursor-pointer text-xs font-semibold text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50">Đặt mặc định</button>}
                      <button type="button" onClick={() => remove(item)} disabled={pendingId !== null}
                        className="cursor-pointer text-xs font-semibold text-danger hover:underline disabled:cursor-not-allowed disabled:opacity-50">Xóa</button>
                    </div>
                  </div>
                  ) : (
                  <button type="button" onClick={() => select(item.id)} aria-pressed={item.id === selectedAddressId}
                    className={`w-full cursor-pointer rounded-lg border p-3 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${item.id === selectedAddressId ? "border-primary bg-primary/5" : "border-surface-border hover:bg-surface-muted"}`}>
                    <span className="block text-slate-700">{formatAddress(item)}</span>
                    {item.defaultAddress && <span className="mt-1 inline-block rounded border border-cta px-1.5 text-[11px] font-semibold text-cta">Mặc định</span>}
                  </button>
                  )}
                </li>
              ))}
            </ul>
          )}
          <button type="button" onClick={startCreate}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-primary px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Tạo địa chỉ
          </button>
        </div>
      ) : provincesLoading || provincesFailed ? (
        <div className="space-y-4">
          <p role={provincesFailed ? "alert" : "status"} className={provincesFailed ? "text-sm text-danger" : "text-sm text-muted-foreground"}>
            {provincesFailed ? "Không tải được danh sách tỉnh/thành phố, vui lòng thử lại sau." : "Đang tải danh sách tỉnh/thành phố..."}
          </p>
          <div className="flex justify-end border-t border-surface-border pt-4">
            <button type="button" onClick={cancelCreate} className="h-10 cursor-pointer rounded-lg border border-surface-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Quay lại</button>
          </div>
        </div>
      ) : (
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="checkout-recipient-name" className="text-sm font-semibold">Tên người nhận</label>
          <Input {...recipientNameField} id="checkout-recipient-name" autoFocus autoComplete="name" placeholder="Họ và tên người nhận"
            className="rounded-lg" aria-required="true" aria-invalid={!!errors.recipientName} error={errors.recipientName?.message} />
        </div>
        <div className="space-y-2">
          <label htmlFor="checkout-phone" className="text-sm font-semibold">Số điện thoại</label>
          <Input {...phoneField} id="checkout-phone" type="tel" autoComplete="tel" placeholder="VD: 0373106887 hoặc +84373106887"
            className="rounded-lg" aria-required="true" aria-invalid={!!errors.phone} error={errors.phone?.message} />
        </div>
        <div className="space-y-2">
          <label htmlFor="checkout-province" className="text-sm font-semibold">Tỉnh/Thành phố</label>
          <Input {...provinceField} id="checkout-province" list="checkout-provinces" autoComplete="off"
            placeholder="Nhập để tìm tỉnh/thành phố" className="rounded-lg" aria-required="true" aria-invalid={!!errors.province}
            error={errors.province?.message} />
          <datalist id="checkout-provinces">
            {provinces.map((province) => <option key={province.name} value={province.name} />)}
          </datalist>
        </div>
        <div className="space-y-2">
          <label htmlFor="checkout-ward" className="text-sm font-semibold">Xã/Phường</label>
          <Input {...wardField} id="checkout-ward" list="checkout-wards" autoComplete="off" disabled={!hasProvince}
            placeholder={hasProvince ? "Nhập để tìm xã/phường" : "Chọn tỉnh/thành phố trước"} className="rounded-lg"
            aria-required="true" aria-invalid={!!errors.ward} error={errors.ward?.message ?? (wardsFailed ? "Không tải được danh sách xã/phường, vui lòng thử lại sau." : undefined)} />
          <datalist id="checkout-wards">
            {wards.map((ward) => <option key={ward} value={ward} />)}
          </datalist>
        </div>
        <div className="space-y-2">
          <label htmlFor="checkout-address-detail" className="text-sm font-semibold">Địa chỉ chi tiết</label>
          <Input {...detailField} id="checkout-address-detail" disabled={!hasWard} autoComplete="street-address"
            placeholder={hasWard ? "Số nhà, tên đường, tòa nhà..." : "Chọn xã/phường trước"} className="rounded-lg"
            aria-required="true" aria-invalid={!!errors.detail} error={errors.detail?.message} />
        </div>
        {errors.root && <p role="alert" className="text-sm text-danger">{errors.root.message}</p>}
        <div className="flex justify-end gap-2.5 border-t border-surface-border pt-4">
          <button type="button" onClick={cancelCreate} className="h-10 cursor-pointer rounded-lg border border-surface-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Hủy</button>
          <button type="submit" disabled={isSubmitting || wardsFailed} className="h-10 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">{isSubmitting ? "Đang tạo..." : "Tạo địa chỉ"}</button>
        </div>
      </form>
      )}
    </dialog>
  );
}
