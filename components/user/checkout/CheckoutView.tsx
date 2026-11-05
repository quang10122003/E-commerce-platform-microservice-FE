"use client";

import Link from "next/link";
import { useCheckout } from "@/hooks/user/checkout/useCheckout";
import { useCheckoutAddress } from "@/hooks/user/checkout/useCheckoutAddress";
import { useCreateCheckout } from "@/hooks/user/checkout/useCreateCheckout";
import { useSaleExpiry } from "@/hooks/shared/useSaleExpiry";
import { Loading } from "@/components/ui";
import { CheckoutBreadcrumb } from "./CheckoutBreadcrumb";
import { CheckoutAddressCard } from "./CheckoutAddressCard";
import { CheckoutAddressModal } from "./CheckoutAddressModal";
import { CheckoutItemsGroup } from "./CheckoutItemsGroup";
import { CheckoutPaymentCard } from "./CheckoutPaymentCard";
import { CheckoutOrderSummary } from "./CheckoutOrderSummary";
import { CheckoutSuccessModal } from "./CheckoutSuccessModal";

// Giao diện trang thanh toán (Checkout) hoàn chỉnh theo chuẩn ModernShop.
export function CheckoutView({ itemsParam }: { itemsParam?: string | string[] }) {
  const checkout = useCheckout(itemsParam);
  const addressForm = useCheckoutAddress();
  const order = useCreateCheckout(checkout.items, checkout.total, addressForm.addressText,
    !checkout.loading && !checkout.error && !checkout.quoteLoading && !checkout.quoteError, checkout.retry);
  useSaleExpiry(checkout.items, checkout.retry, !order.locked);

  return (
    <div className="space-y-5 pb-16">
      {/* 1. Breadcrumb điều hướng */}
      <CheckoutBreadcrumb />

      {/* 2. Khung bố cục 2 cột: Cột trái nội dung chính, cột phải tóm tắt chi phí */}
      <form onSubmit={order.submit} noValidate>
      <fieldset disabled={order.locked} className="grid min-w-0 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] items-start gap-5">
        {/* Cột trái: Địa chỉ, Danh sách kiện hàng và Phương thức thanh toán */}
        <div className="space-y-4 min-w-0">
          <CheckoutAddressCard address={addressForm.addressText} onChangeAddress={addressForm.open} />
          {order.errors.root?.address && <p role="alert" className="text-xs text-danger">{order.errors.root.address.message}</p>}
          {checkout.loading ? <Loading label="Đang tải sản phẩm thanh toán..." /> : checkout.error ? (
            <section role="alert" className="space-y-3 rounded-xl border border-surface-border bg-surface-card p-5">
              <p className="text-sm text-danger">{checkout.error}</p>
              <div className="flex items-center gap-4 text-sm font-semibold text-primary">
                {checkout.canRetry && <button type="button" onClick={checkout.retry} className="cursor-pointer hover:underline">Thử lại</button>}
                <Link href="/cart" className="hover:underline">Quay lại giỏ hàng</Link>
              </div>
            </section>
          ) : <CheckoutItemsGroup groups={checkout.groups} noteField={order.noteField} noteError={order.errors.note?.message} />}
          <CheckoutPaymentCard selectedMethod={order.paymentMethod} paymentField={order.paymentField} error={order.errors.paymentMethod?.message} />
        </div>

        {/* Cột phải: Bảng tóm tắt đơn hàng và CTA Đặt Hàng */}
        <div className="min-w-0">
          <CheckoutOrderSummary isSubmitting={order.isSubmitting}
            total={checkout.total} itemCount={checkout.itemCount} quoteLoading={checkout.quoteLoading}
            quoteError={checkout.quoteError} onRetry={checkout.retry}
            disabled={order.locked || checkout.loading || !!checkout.error || checkout.total === null} />
          {order.errors.root?.checkout && <p role="alert" className="mt-3 text-sm text-danger">{order.errors.root.checkout.message}</p>}
        </div>
      </fieldset>
      </form>

      {/* 3. Modal quản lý địa chỉ nhận hàng */}
      {addressForm.isOpen && <CheckoutAddressModal addressForm={addressForm} />}

      {/* Lớp phủ giữ nguyên checkout phía sau trong suốt quá trình gửi và chờ kết quả. */}
      {(order.isSubmitting || order.result) && <CheckoutSuccessModal submitting={order.isSubmitting}
        failure={order.failure} success={order.success} dialogRef={order.overlayRef}
        streamError={order.streamError} onReconnect={order.reconnect} onConfirmFailure={order.acknowledgeFailure} />}

    </div>
  );
}
