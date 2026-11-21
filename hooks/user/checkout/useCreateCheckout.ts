"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useSse } from "@/hooks/shared/useSse";
import { useCheckoutResultFallback } from "./useCheckoutResultFallback";
import { useForm, useWatch } from "react-hook-form";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PRICE_PREVIEW_DEBOUNCE_MS } from "@/lib/constants";
import { useCreateCheckoutMutation } from "@/lib/redux/services/checkout-api";
import { getApiErrorMessage } from "@/lib/utils";
import { buildCreateCheckoutRequest, getCheckoutPaymentUrl, isCheckoutStreamResult } from "@/utils/checkout.utils";
import type { CheckoutItem, CheckoutPaymentMethod, CreateCheckoutResponse } from "@/types/user/checkout";

interface CheckoutOrderFields {
  note: string;
  paymentMethod: CheckoutPaymentMethod;
}

const CHECKOUT_EVENTS = ["CHECKOUT_SUCCEEDED", "CHECKOUT_FAILED"] as const;

// Gửi đúng dữ liệu đang hiển thị, không gọi lại API sản phẩm hoặc báo giá.
export function useCreateCheckout(items: CheckoutItem[], total: number | null, shippingAddress: string | null, recipientName: string | null, phone: string | null, ready: boolean, reloadCheckout: () => void) {
  const router = useRouter();
  const { notifyError } = useNotification();
  const [createCheckout] = useCreateCheckoutMutation();
  const form = useForm<CheckoutOrderFields>({ defaultValues: { note: "", paymentMethod: "VNPAY" } });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const note = useWatch({ control: form.control, name: "note" });
  const stableNote = useDebouncedValue(note, PRICE_PREVIEW_DEBOUNCE_MS);
  // Giữ phản hồi checkout đã được BE tiếp nhận để chặn tạo lại sau khi đóng thông báo.
  const [result, setResult] = useState<CreateCheckoutResponse | null>(null);
  // Giữ lỗi nghiệp vụ đến khi người mua xác nhận tải lại dữ liệu.
  const [failureReason, setFailureReason] = useState<string | null>(null);
  // Dừng stream sau khi có kết quả cuối cùng được xử lý.
  const [streamComplete, setStreamComplete] = useState(false);
  // Cho phép nối lại stream mà không tạo lại checkout khi mất kết nối.
  const [streamError, setStreamError] = useState(false);
  const terminalRef = useRef(false);
  const submittingRef = useRef(false);
  const acceptedRef = useRef(false);
  const attemptRef = useRef<{ payload: string; key: string; note: string; paymentMethod: CheckoutPaymentMethod } | null>(null);
  const overlayRef = useRef<HTMLDialogElement>(null);
  const overlayOpen = form.formState.isSubmitting || result !== null;

  useEffect(() => {
    if (!overlayOpen) return;
    overlayRef.current?.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [overlayOpen]);

  useEffect(() => {
    // Sửa nội dung đơn là một lần đặt hàng mới, kể cả khi quay lại giá trị cũ.
    if (attemptRef.current?.note === stableNote && attemptRef.current.paymentMethod === paymentMethod) return;
    attemptRef.current = null;
  }, [paymentMethod, stableNote]);

  useEffect(() => {
    if (shippingAddress) form.clearErrors("root.address");
  }, [shippingAddress, form]);

  const noteField = form.register("note", { maxLength: { value: 1000, message: "Ghi chú tối đa 1.000 ký tự." } });
  const paymentField = form.register("paymentMethod", {
    required: "Vui lòng chọn phương thức thanh toán.",
    validate: (value) => ["COD", "VNPAY"].includes(value) || "Phương thức thanh toán không hợp lệ.",
  });

  // Giữ UUID cho cùng payload khi thử lại để backend không tạo checkout trùng.
  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(async (values) => {
    if (submittingRef.current || acceptedRef.current) return;
    form.clearErrors("root");
    if (!shippingAddress || !recipientName || !phone) {
      form.setError("root.address", { message: "Vui lòng nhập và xác nhận địa chỉ nhận hàng." });
      return;
    }
    if (!ready || !items.length || total === null || !Number.isInteger(total) || total < 1) {
      form.setError("root.checkout", { message: "Chưa có đủ sản phẩm và tổng tiền hợp lệ để đặt hàng." });
      return;
    }
    const body = buildCreateCheckoutRequest(items, total, shippingAddress, recipientName, phone, values.paymentMethod, values.note);
    const payload = JSON.stringify(body);
    if (attemptRef.current?.payload !== payload) attemptRef.current = { payload, key: crypto.randomUUID(), note: values.note, paymentMethod: values.paymentMethod };
    const idempotencyKey = attemptRef.current.key;
    submittingRef.current = true;
    try {
      const response = await createCheckout({ body, idempotencyKey }).unwrap();
      const data = response.data;
      if (!response.success || !data || !Number.isSafeInteger(data.checkoutId) || data.checkoutId <= 0 || !["PROCESSING", "DONE", "CANCEL"].includes(data.status)) {
        notifyError(response.error?.message || "Không thể xác nhận kết quả tạo checkout. Vui lòng thử lại.");
        return;
      }
      acceptedRef.current = true;
      setResult(data);
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể gửi checkout. Vui lòng thử lại."));
    } finally {
      submittingRef.current = false;
    }
  })(event);

  const finishCheckout = () => {
    terminalRef.current = true;
    setStreamComplete(true);
  };
  const failCheckout = (reason: string) => {
    finishCheckout();
    setFailureReason(reason);
  };
  // COD sang trang thành công; VNPAY chuyển trình duyệt đến URL thanh toán. Trả false khi URL thanh toán không hợp lệ.
  const completeCheckout = (method: CheckoutPaymentMethod, orderIds: number[], urlPayment: string | null) => {
    if (method === "COD") {
      finishCheckout();
      router.replace(orderIds.length ? `/checkout/success?orderIds=${orderIds.join(",")}` : "/user/orders");
      return true;
    }
    const paymentUrl = getCheckoutPaymentUrl(urlPayment);
    if (!paymentUrl) return false;
    finishCheckout();
    window.location.assign(paymentUrl);
    return true;
  };

  const handleEvent = (name: string, value: unknown) => {
    if (!result || terminalRef.current) return;
    if (!isCheckoutStreamResult(value, result.checkoutId)) {
      setStreamError(true);
      notifyError("Dữ liệu kết quả checkout không hợp lệ. Vui lòng kết nối lại.");
      return;
    }
    if (name === "CHECKOUT_FAILED" && "reason" in value) {
      failCheckout(value.reason);
    } else if (name === "CHECKOUT_SUCCEEDED" && "paymentMethod" in value && !completeCheckout(value.paymentMethod, value.orderIds, value.urlPayment)) {
      setStreamError(true);
      notifyError("Đường dẫn thanh toán không hợp lệ. Vui lòng kết nối lại để nhận kết quả checkout.");
    }
  };
  const applyCheckoutResult = (data: CreateCheckoutResponse) => {
    if (!result || terminalRef.current || data.checkoutId !== result.checkoutId) return;
    if (data.status === "CANCEL") {
      failCheckout(data.reason || "Không thể tiếp tục checkout.");
    } else if (data.status === "DONE" && data.paymentMethod && !completeCheckout(data.paymentMethod, data.orderIds, data.urlPayment)) {
      notifyError("Đường dẫn thanh toán không hợp lệ. Vui lòng kiểm tra lại trong danh sách đơn hàng.");
    }
  };
  const handleStreamError = () => {
    setStreamError(true);
    notifyError("Mất kết nối nhận kết quả checkout. Hệ thống sẽ kết nối lại, không cần đặt hàng lại.");
  };
  useCheckoutResultFallback(result, result !== null && !streamComplete, applyCheckoutResult);
  const { reconnect } = useSse(result?.status === "PROCESSING" && !streamComplete ? `/api/notifications/checkouts/${result.checkoutId}/stream` : null,
    CHECKOUT_EVENTS, handleEvent, handleStreamError, () => setStreamError(false));

  // Chỉ tải lại sản phẩm và báo giá sau khi người mua xác nhận lỗi nghiệp vụ.
  const acknowledgeFailure = () => {
    if (!failureReason) return;
    acceptedRef.current = false;
    terminalRef.current = false;
    attemptRef.current = null;
    setFailureReason(null);
    setResult(null);
    setStreamComplete(false);
    setStreamError(false);
    reloadCheckout();
  };

  return {
    submit, noteField, paymentField, paymentMethod, result, failureReason, overlayRef, streamError, reconnect, acknowledgeFailure,
    isSubmitting: form.formState.isSubmitting,
    locked: form.formState.isSubmitting || result !== null,
    errors: form.formState.errors,
  };
}
