import { X, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { useCheckoutAddress } from "@/hooks/user/checkout/useCheckoutAddress";

type CheckoutAddressModalProps = {
  addressForm: ReturnType<typeof useCheckoutAddress>;
};

// Form địa chỉ ba cấp dùng gợi ý địa phương từ dữ liệu hành chính của dự án.
export function CheckoutAddressModal({ addressForm }: CheckoutAddressModalProps) {
  const { dialogRef, close, submit, provinceField, wardField, detailField, provinces, wards, hasProvince, hasWard, errors } = addressForm;

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
      {/* Chọn tỉnh, xã rồi mới nhập địa chỉ chi tiết. */}
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="checkout-province" className="text-sm font-semibold">Tỉnh/Thành phố</label>
          <Input {...provinceField} id="checkout-province" list="checkout-provinces" autoFocus autoComplete="off"
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
            aria-required="true" aria-invalid={!!errors.ward} error={errors.ward?.message} />
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
        {/* Xác nhận áp dụng một địa chỉ cho toàn bộ checkout. */}
        <div className="flex justify-end gap-2.5 border-t border-surface-border pt-4">
          <button type="button" onClick={close} className="h-10 cursor-pointer rounded-lg border border-surface-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">Hủy</button>
          <button type="submit" className="h-10 cursor-pointer rounded-lg bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">Xác nhận</button>
        </div>
      </form>
    </dialog>
  );
}
