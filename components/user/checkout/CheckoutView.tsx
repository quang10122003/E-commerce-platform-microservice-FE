"use client";

import { useState } from "react";
import { CheckoutBreadcrumb } from "./CheckoutBreadcrumb";
import { CheckoutAddressCard } from "./CheckoutAddressCard";
import { CheckoutAddressModal } from "./CheckoutAddressModal";
import { CheckoutItemsGroup } from "./CheckoutItemsGroup";
import { CheckoutVoucherCard } from "./CheckoutVoucherCard";
import { CheckoutPaymentCard } from "./CheckoutPaymentCard";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";

// Giao diện trang thanh toán (Checkout) hoàn chỉnh theo chuẩn ModernShop.
export function CheckoutView() {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Xử lý khi người dùng ấn nút Đặt Hàng Ngay.
  const handlePlaceOrder = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* 1. Breadcrumb điều hướng */}
      <CheckoutBreadcrumb />

      {/* 2. Khung bố cục 2 cột: Cột trái nội dung chính, cột phải tóm tắt chi phí */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] items-start gap-5">
        {/* Cột trái: Địa chỉ, Danh sách kiện hàng, Voucher, Phương thức thanh toán */}
        <div className="space-y-4 min-w-0">
          <CheckoutAddressCard onChangeAddress={() => setIsAddressModalOpen(true)} />
          <CheckoutItemsGroup />
          <CheckoutVoucherCard />
          <CheckoutPaymentCard />
        </div>

        {/* Cột phải: Bảng tóm tắt đơn hàng và CTA Đặt Hàng */}
        <div className="min-w-0">
          <CheckoutOrderSummary onPlaceOrder={handlePlaceOrder} isSubmitting={isSubmitting} />
        </div>
      </div>

      {/* 3. Modal quản lý địa chỉ nhận hàng */}
      <CheckoutAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
      />

      {/* 4. Modal thông báo đặt hàng thành công */}
      <CheckoutSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
      />
    </div>
  );
}
