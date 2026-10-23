import { TIME } from "@/lib/constants";
import { parseOffsetDateTime } from "@/utils/date-time.utils";

// Cộng tháng theo lịch địa phương, chặn tràn ngày cuối tháng như 31/01 sang tháng 02.
function addMembershipMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setDate(1);
  result.setMonth(result.getMonth() + months);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDay));
  return result;
}

// Dưới một tháng hiện ngày; tháng lẻ làm tròn lên rồi tách thành năm và tháng.
export function formatShopMembershipDuration(createdAt: string | null, now = new Date()): string {
  const created = parseOffsetDateTime(createdAt);
  if (!created || !Number.isFinite(now.getTime()) || created > now) return "—";

  // So mốc tháng theo múi giờ trình duyệt sau khi Date đã đọc offset của backend.
  if (now < addMembershipMonths(created, 1)) {
    const days = Math.floor((now.getTime() - created.getTime()) / (TIME.HOUR_MS * TIME.HOURS_PER_DAY));
    return `${days} ngày`;
  }

  let months = (now.getFullYear() - created.getFullYear()) * 12 + now.getMonth() - created.getMonth();
  if (now > addMembershipMonths(created, months)) months += 1;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  if (!years) return `${months} tháng`;
  return remainingMonths ? `${years} năm ${remainingMonths} tháng` : `${years} năm`;
}
