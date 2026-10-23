import type { Metadata } from "next";
import { CheckoutView } from "@/components/user/checkout/CheckoutView";

export const metadata: Metadata = {
  title: "Thanh Toán Đơn Hàng | ModernShop",
  description: "Trang xác nhận và thanh toán đơn hàng an toàn, bảo mật tại ModernShop.",
};

// Trang thanh toán đơn hàng của người mua.
export default function CheckoutPage() {
  return <CheckoutView />;
}
