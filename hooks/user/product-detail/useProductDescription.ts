"use client";

import { useMemo, useState } from "react";
import { getRichTextDisplayContent } from "@/lib/utils/rich-text.utils";
import { useProductDetailContext } from "./useProductDetailContext";

// Chỉ lấy mô tả từ API, giữ thao tác mở rộng và thu gọn hiện có.
export function useProductDescription() {
  const { product } = useProductDetailContext();
  // Trạng thái mở rộng toàn bộ mô tả dài, mặc định chỉ hiện phần tóm tắt.
  const [isExpanded, setIsExpanded] = useState(false);
  const description = useMemo(() => getRichTextDisplayContent(product?.description ?? ""), [product?.description]);

  // Mở rộng hoặc thu gọn mô tả.
  function toggleExpanded() {
    setIsExpanded((previous) => !previous);
  }

  return { isExpanded, description, toggleExpanded };
}