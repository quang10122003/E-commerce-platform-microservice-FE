import { useCallback, useState } from "react";

// Giữ state cho các component mở bộ lọc dạng icon và panel trượt.
export function useFilterDrawer() {
  // Lưu trạng thái hiển thị panel bộ lọc.
  const [isOpen, setIsOpen] = useState(false);

  // Mở panel bộ lọc.
  const open = useCallback(() => setIsOpen(true), []);
  // Đóng panel bộ lọc.
  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, open, close };
}
