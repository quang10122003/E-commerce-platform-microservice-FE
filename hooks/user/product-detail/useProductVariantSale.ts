"use client";

import { useEffect, useState } from "react";
import { skipToken } from "@reduxjs/toolkit/query";
import { TIME } from "@/lib/constants";
import { useGetVariantSaleQuery } from "@/lib/redux/services/product-api";
import { getProductVariantPricing } from "@/lib/utils/product-detail.utils";
import type { UserProductVariant } from "@/types/user/product";

// Đọc sale của variant đang chọn, không dùng response cũ khi đổi tổ hợp thuộc tính.
export function useProductVariantSale(productId: number, variant: UserProductVariant | null) {
  const { currentData, isFetching, isError, isUninitialized } = useGetVariantSaleQuery(
    variant ? { productId, variantId: variant.id } : skipToken,
    { refetchOnMountOrArgChange: true },
  );
  const response = !isFetching && !isError && currentData?.success ? currentData.data : null;
  // Lưu thời gian trình duyệt để cập nhật countdown và tự ẩn sale hết hạn.
  const [now, setNow] = useState(() => Date.now());
  const endsAt = response?.sale?.endsAt ?? null;

  // Chỉ chạy đồng hồ khi có sale; ISO offset được helper hiện có chuyển thành timestamp.
  useEffect(() => {
    if (!endsAt) return;
    const initialTick = window.setTimeout(() => setNow(Date.now()), 0);
    const timer = window.setInterval(() => setNow(Date.now()), TIME.SECOND_MS);
    return () => { window.clearTimeout(initialTick); window.clearInterval(timer); };
  }, [endsAt]);

  return {
    ...getProductVariantPricing(variant, response, now),
    isLoading: isFetching,
    hasSettled: !variant || (!isUninitialized && !isFetching),
  };
}
