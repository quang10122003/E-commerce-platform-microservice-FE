"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PRICE_PREVIEW_DEBOUNCE_MS } from "@/lib/constants";
import { usePreviewFlashSalePriceQuery } from "@/lib/redux/services/flash-sale-api";
import { getApiErrorMessage } from "@/lib/utils";
import { isValidDiscountPercent } from "@/lib/utils/flash-sale.utils";

// Dùng chung luồng preview cho form đăng ký và chỉnh sửa trực tiếp trên bảng.
export function useFlashSalePricePreview(variantId: number | null | undefined, discountPercent: number, enabled = true) {
  // Chỉ gửi request khi có đúng variant và mức giảm hợp lệ.
  const canPreview = enabled && !!variantId && Number.isSafeInteger(variantId) && variantId > 0 && isValidDiscountPercent(discountPercent);
  // Debounce toàn bộ khóa request để không gọi API khi input còn thay đổi.
  const previewKey = canPreview ? `${variantId}:${discountPercent}` : null;
  const stablePreviewKey = useDebouncedValue(previewKey, PRICE_PREVIEW_DEBOUNCE_MS);
  const previewReady = canPreview && previewKey === stablePreviewKey;
  const preview = usePreviewFlashSalePriceQuery(previewReady
    ? { variantId: variantId!, discountPercent } : skipToken,
    { refetchOnMountOrArgChange: true });
  // currentData chỉ thuộc bộ input hiện tại, không dùng giá của request trước.
  const salePrice = previewReady && !preview.isFetching && preview.currentData?.success
    ? preview.currentData.data?.salePrice : undefined;
  const priceLoading = canPreview && (!previewReady || preview.isFetching);
  const priceError = !previewReady ? undefined : preview.error
    ? getApiErrorMessage(preview.error, "Không thể tính giá sale. Vui lòng thử lại.")
    : preview.currentData && (!preview.currentData.success || !preview.currentData.data)
      ? preview.currentData.message || "Không thể tính giá sale. Vui lòng thử lại." : undefined;
  // Thử lại đúng bộ thông số đã ổn định, không gửi mức giảm đang gõ.
  const retryPrice = () => { if (previewReady) void preview.refetch(); };
  return { salePrice, priceLoading, priceError, retryPrice };
}
