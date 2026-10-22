"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getRichTextDisplayContent } from "@/lib/utils/rich-text.utils";
import { useProductDetailContext } from "./useProductDetailContext";

const COLLAPSED_HEIGHT = 320;

// Chỉ lấy mô tả từ API, giữ thao tác mở rộng và thu gọn hiện có.
export function useProductDescription() {
  const { product } = useProductDetailContext();
  // Trạng thái mở rộng toàn bộ mô tả dài, mặc định chỉ hiện phần tóm tắt.
  const [isExpanded, setIsExpanded] = useState(false);
  // Ghi nhận nội dung có vượt chiều cao thu gọn để hiện nút và hiệu ứng mờ.
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentId = useId();
  const description = useMemo(() => getRichTextDisplayContent(product?.description ?? ""), [product?.description]);

  // Đo nội dung tự nhiên và cập nhật khi đổi độ rộng, font hoặc mô tả.
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const observer = new ResizeObserver(() => {
      // Đo chiều cao layout để không bị sai lệch bởi zoom hoặc transform của trang.
      setHasOverflow(content.scrollHeight > COLLAPSED_HEIGHT);
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, [description]);

  // Mở rộng hoặc thu gọn mô tả.
  function toggleExpanded() {
    setIsExpanded((previous) => !previous);
  }

  return { isExpanded, hasOverflow, contentRef, contentId, collapsedHeight: COLLAPSED_HEIGHT, description, toggleExpanded };
}
