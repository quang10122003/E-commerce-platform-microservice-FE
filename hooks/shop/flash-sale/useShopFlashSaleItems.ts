"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useGetShopFlashSaleItemsQuery } from "@/lib/redux/services/flash-sale-api";
import { getApiErrorMessage } from "@/lib/utils";

// Quản lý tìm kiếm debounce, tải danh sách và thử lại qua RTK Query.
export function useShopFlashSaleItems(campaignId: string) {
  const router = useRouter();
  // Lưu từ khóa đang nhập; chỉ gửi API khi người dùng ngừng gõ.
  const [keywordInput, setKeywordInput] = useState("");
  const debouncedKeyword = useDebouncedValue(keywordInput.trim(), 300);
  const query = useGetShopFlashSaleItemsQuery(
    { campaignId, keyword: debouncedKeyword },
    { refetchOnMountOrArgChange: true },
  );
  const response = query.currentData;
  const error = query.error
    ? getApiErrorMessage(query.error, "Không thể tải danh sách phân loại. Vui lòng thử lại.")
    : response && (!response.success || !Array.isArray(response.data))
      ? response.message || "Không thể tải danh sách phân loại. Vui lòng thử lại."
      : null;

  // Gọi lại đúng request hiện tại thay vì chỉ cập nhật từ khóa không đổi.
  const handleRetry = () => { void query.refetch(); };
  // Đóng modal về trang trước, giữ nguyên lịch sử điều hướng hiện có.
  const close = () => router.back();

  return {
    keywordInput, setKeywordInput, debouncedKeyword,
    items: response?.success && Array.isArray(response.data) ? response.data : [],
    loading: query.isFetching, error, handleRetry, close,
  };
}
