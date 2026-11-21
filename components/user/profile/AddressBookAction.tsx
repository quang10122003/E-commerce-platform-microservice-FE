"use client";

import { ChevronRight, MapPin } from "lucide-react";
import { CheckoutAddressModal } from "@/components/user/checkout/CheckoutAddressModal";
import { useCheckoutAddress } from "@/hooks/user/checkout/useCheckoutAddress";

// Mục "Sổ địa chỉ" trong lối tắt, mở popup xem, tạo, xóa và đặt địa chỉ mặc định.
export function AddressBookAction() {
  const addressForm = useCheckoutAddress();

  return (
    <>
      <button type="button" onClick={addressForm.open} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">
        <MapPin className="size-4 text-primary" aria-hidden="true" />
        <span className="flex-1">Sổ địa chỉ</span>
        <ChevronRight className="size-4 text-slate-400" aria-hidden="true" />
      </button>
      {addressForm.isOpen && <CheckoutAddressModal addressForm={addressForm} manage />}
    </>
  );
}
