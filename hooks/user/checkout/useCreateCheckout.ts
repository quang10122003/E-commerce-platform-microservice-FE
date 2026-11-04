"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PRICE_PREVIEW_DEBOUNCE_MS } from "@/lib/constants";
import { useCreateCheckoutMutation } from "@/lib/redux/services/checkout-api";
import { getApiErrorMessage } from "@/lib/utils";
import { buildCreateCheckoutRequest } from "@/utils/checkout.utils";
import type { CheckoutItem, CheckoutPaymentMethod, CreateCheckoutResponse } from "@/types/user/checkout";

interface CheckoutOrderFields {
  note: string;
  paymentMethod: CheckoutPaymentMethod;
}

// Gửi đúng dữ liệu đang hiển thị, không gọi lại API sản phẩm hoặc báo giá.
export function useCreateCheckout(items: CheckoutItem[], total: number | null, shippingAddress: string | null, ready: boolean) {
  const [createCheckout] = useCreateCheckoutMutation();
  const form = useForm<CheckoutOrderFields>({ defaultValues: { note: "", paymentMethod: "VNPAY" } });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const note = useWatch({ control: form.control, name: "note" });
  const stableNote = useDebouncedValue(note, PRICE_PREVIEW_DEBOUNCE_MS);
  // Giữ phản hồi checkout đã được BE tiếp nhận để chặn tạo lại sau khi đóng thông báo.
  const [result, setResult] = useState<CreateCheckoutResponse | null>(null);
  // Điều khiển thông báo kết quả request tạo checkout.
  const [resultOpen, setResultOpen] = useState(false);
  const submittingRef = useRef(false);
  const acceptedRef = useRef(false);
  const attemptRef = useRef<{ payload: string; key: string; note: string; paymentMethod: CheckoutPaymentMethod } | null>(null);
  const resultDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Sửa nội dung đơn là một lần đặt hàng mới, kể cả khi quay lại giá trị cũ.
    if (attemptRef.current?.note === stableNote && attemptRef.current.paymentMethod === paymentMethod) return;
    attemptRef.current = null;
  }, [paymentMethod, stableNote]);

  useEffect(() => {
    if (resultOpen) resultDialogRef.current?.showModal();
  }, [resultOpen]);

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
    if (!shippingAddress) {
      form.setError("root.address", { message: "Vui lòng nhập và xác nhận địa chỉ nhận hàng." });
      return;
    }
    if (!ready || !items.length || total === null || !Number.isInteger(total) || total < 1) {
      form.setError("root.checkout", { message: "Chưa có đủ sản phẩm và tổng tiền hợp lệ để đặt hàng." });
      return;
    }
    const body = buildCreateCheckoutRequest(items, total, shippingAddress, values.paymentMethod, values.note);
    const payload = JSON.stringify(body);
    if (attemptRef.current?.payload !== payload) attemptRef.current = { payload, key: crypto.randomUUID(), note: values.note, paymentMethod: values.paymentMethod };
    const idempotencyKey = attemptRef.current.key;
    submittingRef.current = true;
    try {
      const response = await createCheckout({ body, idempotencyKey }).unwrap();
      const data = response.data;
      if (!response.success || !data || !Number.isSafeInteger(data.checkoutId) || data.checkoutId <= 0 || !["PROCESSING", "DONE", "CANCEL"].includes(data.status)) {
        form.setError("root.checkout", { message: response.error?.message || "Không thể xác nhận kết quả tạo checkout. Vui lòng thử lại." });
        return;
      }
      acceptedRef.current = true;
      setResult(data);
      setResultOpen(true);
    } catch (error) {
      form.setError("root.checkout", { message: getApiErrorMessage(error, "Không thể gửi checkout. Vui lòng thử lại.") });
    } finally {
      submittingRef.current = false;
    }
  })(event);

  // Đóng thông báo mà vẫn giữ checkout đã được tiếp nhận.
  const closeResult = () => setResultOpen(false);

  return {
    submit, noteField, paymentField, paymentMethod, result, resultOpen, closeResult, resultDialogRef,
    isSubmitting: form.formState.isSubmitting,
    locked: form.formState.isSubmitting || result !== null,
    errors: form.formState.errors,
  };
}
