import { ISO_DATE_LENGTH } from "@/lib/constants";
import { useState } from "react";

// Điều khiển lịch inline và ghép ngày được chọn với giờ địa phương.
export function useDateTimeFields(value: string, onChange: (value: string) => void, onConfirm?: () => void, min?: string, max?: string) {
  // Lưu trạng thái mở lịch, không tạo lớp popup ngoài layout.
  const [isOpen, setIsOpen] = useState(false);
  const selected = value ? new Date(value) : undefined;
  const time = value.slice(11, 16) || "00:00";

  // Giới hạn thời điểm trong khoảng cho phép, kể cả khi ngày hợp lệ nhưng giờ vượt mốc.
  function update(next: string) {
    onChange(min && next < min ? min : max && next > max ? max : next);
  }

  // Khóa giờ hoặc phút tạo ra thời điểm ngoài khoảng cho phép.
  function isTimeDisabled(field: "hour" | "minute", next: string) {
    if (!value) return true;
    const [hour, minute] = time.split(":");
    const candidate = `${value.slice(0, ISO_DATE_LENGTH)}T${field === "hour" ? next : hour}:${field === "minute" ? next : minute}`;
    // Giờ hợp lệ khi vẫn có ít nhất một phút nằm trong khoảng.
    if (field === "hour") {
      const beginning = `${value.slice(0, ISO_DATE_LENGTH)}T${next}:00`;
      const ending = `${value.slice(0, ISO_DATE_LENGTH)}T${next}:59`;
      return Boolean((min && ending < min) || (max && beginning > max));
    }
    return Boolean((min && candidate < min) || (max && candidate > max));
  }

  // Giữ giờ đã chọn khi đổi ngày và không chuyển ngày qua UTC.
  function selectDate(date: Date | undefined) {
    if (!date) return;
    const day = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    update(`${day}T${time}`);
  }

  // Đổi giờ hoặc phút mà không làm mất ngày hiện tại.
  function changeTime(field: "hour" | "minute", next: string) {
    if (!value) return;
    const [hour, minute] = time.split(":");
    update(`${value.slice(0, ISO_DATE_LENGTH)}T${field === "hour" ? next : hour}:${field === "minute" ? next : minute}`);
  }

  // Xóa lựa chọn để bỏ điều kiện thời gian khỏi bộ lọc.
  function clear() {
    onChange("");
    setIsOpen(false);
    onConfirm?.();
  }
  // Xác nhận ngày giờ trước khi caller áp dụng bộ lọc.
  function confirm() {
    setIsOpen(false);
    onConfirm?.();
  }
  return { isTimeDisabled, confirm, isOpen, toggle: () => setIsOpen((open) => !open), selected, time, selectDate, changeTime, clear };
}
