import { FIRST_PAGE } from "@/lib/constants";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getShopFlashSalesUrl } from "@/lib/utils/flash-sale.utils";
import { toLocalDateTimeInput, toOffsetDateTime } from "@/utils/date-time.utils";
import type { ShopFlashSaleQuery } from "@/types/shop/flash-sale";

// Giữ lựa chọn bộ lọc và điều hướng để server tải lại dữ liệu theo URL.
export function useShopFlashSaleFilters(query: ShopFlashSaleQuery) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  // Giữ khoảng ngày đang chọn cho đến khi người dùng áp dụng.
  const [draft, setDraft] = useState({ from: toLocalDateTimeInput(query.from), to: toLocalDateTimeInput(query.to), registration: query.registrationOpen === undefined ? "all" : query.registrationOpen ? "open" : "closed" });
  // Giữ lựa chọn mới nhất khi nhiều thao tác xảy ra trước lượt render tiếp theo.
  const latestDraft = useRef(draft);
  // Lưu lỗi khoảng thời gian để hiển thị ngay tại bộ lọc.
  const [error, setError] = useState("");

  // Kiểm tra khoảng thời gian và đưa lựa chọn mới lên URL từ trang đầu.
  function apply(values = latestDraft.current) {
    if ([values.from, values.to].some((value) => value && !toOffsetDateTime(value))) {
      setError("Thời gian không hợp lệ.");
      return false;
    }
    if (values.from && values.to && values.from > values.to) {
      setError("Thời điểm kết thúc phải lớn hơn hoặc bằng thời điểm bắt đầu.");
      return false;
    }
    setError("");
    startTransition(() => router.push(getShopFlashSalesUrl({ page: FIRST_PAGE, from: toOffsetDateTime(values.from), to: toOffsetDateTime(values.to), registrationOpen: values.registration === "all" ? undefined : values.registration === "open" }), { scroll: false }));
    return true;
  }

  // Trạng thái lọc ngay khi desktop đổi; khoảng ngày chỉ áp dụng khi gửi biểu mẫu.
  function change(field: keyof typeof draft, value: string, immediate: boolean) {
    const next = { ...latestDraft.current, [field]: value };
    latestDraft.current = next;
    setDraft(next);
    setError("");
    if (immediate) apply({ ...next, from: toLocalDateTimeInput(query.from), to: toLocalDateTimeInput(query.to) });
  }
  // Đọc giá trị form tại lúc xác nhận để luôn áp dụng đúng nội dung input hiện tại.
  function submit(event: FormEvent<HTMLFormElement>, onApplied?: () => void) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const values = { from: String(fields.get("from") ?? ""), to: String(fields.get("to") ?? ""), registration: String(fields.get("registration") ?? "all") };
    if (apply(values)) onApplied?.();
  }
  return { draft, error, isPending, submit, change, apply };
}
