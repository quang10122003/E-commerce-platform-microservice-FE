import type { CartItemSale, CartVariantOption } from "./cart";

export interface CheckoutItemsRequest {
  items: { variantId: number; quantity: number }[];
}

export interface CheckoutItem {
  productId: number;
  variantId: number;
  productName: string;
  imageUrl: string | null;
  shopId: number;
  shopName: string;
  variantOptions: CartVariantOption[];
  quantity: number;
  saleQuantity: number;
  regularQuantity: number;
  price: number;
  sale: CartItemSale | null;
}

export interface CheckoutItemsResponse {
  items: CheckoutItem[];
}

export interface CheckoutQuoteResponse {
  totalAmount: number;
}

export interface CheckoutShopGroup {
  shopId: number;
  shopName: string;
  items: CheckoutItem[];
}

export type CheckoutPaymentMethod = "COD" | "VNPAY";

export interface CreateCheckoutRequest {
  items: { variantId: number; quantity: number; sale: boolean }[];
  paymentMethod: CheckoutPaymentMethod;
  shippingAddress: string;
  totalAmount: number;
  note?: string;
}

export interface CreateCheckoutResponse {
  checkoutId: number;
  status: "PROCESSING" | "DONE" | "CANCEL";
  urlPayment: string | null;
}

export interface CheckoutSucceededResponse {
  checkoutId: number;
  checkoutStatus: string;
  paymentMethod: CheckoutPaymentMethod;
  orderIds: number[];
  totalAmount: number;
  occurredAt: string;
  urlPayment: string | null;
}

export interface CheckoutFailedResponse {
  checkoutId: number;
  checkoutStatus: string;
  reasonCode: string;
  reason: string;
  occurredAt: string;
}
