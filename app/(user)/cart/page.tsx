import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { CartView } from "@/components/user/cart/CartView";
import { getCart } from "@/lib/service/cartService";
import type { CartResponse } from "@/types/user/cart";

export default async function CartPage() {
  let cart: CartResponse | null = null;
  let loadError = false;

  // Lấy dữ liệu ban đầu trên server, giữ trạng thái lỗi cho thao tác thử lại.
  try {
    cart = await getCart();
  } catch (error) {
    rethrowSessionRefreshRequired(error);
    loadError = true;
  }

  return <CartView initialCart={cart} loadError={loadError} />;
}
