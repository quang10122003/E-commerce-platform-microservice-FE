"use client";

import { useEffect, useRef } from "react";
import { TIME } from "@/lib/constants";
import { useLazyGetCheckoutQuery } from "@/lib/redux/services/checkout-api";
import { isCheckoutResultResponse } from "@/utils/checkout.utils";
import type { CreateCheckoutResponse } from "@/types/user/checkout";

const CHECKOUT_RESULT_FALLBACK_MS = 30 * TIME.SECOND_MS;

// SSE chỉ giữ event trong thời gian ngắn nên hỏi trực tiếp order service khi chờ quá lâu để không kẹt màn hình chờ.
export function useCheckoutResultFallback(result: CreateCheckoutResponse | null, waiting: boolean, onResult: (data: CreateCheckoutResponse) => void) {
  const [getCheckout] = useLazyGetCheckoutQuery();
  const onResultRef = useRef(onResult);
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);

  useEffect(() => {
    if (!waiting || !result) return;
    if (result.status !== "PROCESSING") {
      onResultRef.current(result);
      return;
    }
    const checkoutId = result.checkoutId;
    const timer = window.setInterval(async () => {
      try {
        const response = await getCheckout(checkoutId).unwrap();
        if (response.success && isCheckoutResultResponse(response.data, checkoutId) && response.data.status !== "PROCESSING") onResultRef.current(response.data);
      } catch {
        // Lỗi tạm thời không chặn luồng: SSE vẫn đang chờ và lần hỏi kế tiếp sẽ thử lại.
      }
    }, CHECKOUT_RESULT_FALLBACK_MS);
    return () => window.clearInterval(timer);
  }, [waiting, result, getCheckout]);
}
