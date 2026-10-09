"use client";

import { ISO_DATE_LENGTH, FLASH_SALE_CLOSING_SOON_MS } from "@/lib/constants";

import { useMounted } from "@/lib/hooks";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";
import { formatRegistrationRemaining } from "@/lib/utils/flash-sale.utils";
import type { ShopFlashSaleCampaign } from "@/types/shop/flash-sale";
import { useRegistrationCountdown } from "@/hooks/shop/flash-sale/useRegistrationCountdown";
import { Package, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ShopFlashSaleRegistrationAction } from "./shop-flash-sale-registration-action";

// Hiển thị lịch theo múi giờ thiết bị, giữ kết quả SSR ổn định trước khi mount.
export function ShopFlashSaleRow({ campaign, now }: { campaign: ShopFlashSaleCampaign; now: number }) {
  const mounted = useMounted();
  // Mốc thời gian hiện tại được cập nhật mỗi giây để chạy đồng hồ đếm ngược.
  const currentNow = useRegistrationCountdown(now);
  const { id, name, registrationOpen, registrationDeadline, startsAt, endsAt } = campaign;
  // Chỉ đổi giờ sau khi mount để dùng múi giờ trình duyệt, tránh lấy múi giờ server khi SSR.
  const localStart = mounted ? toLocalDateTimeInput(startsAt) : "";
  const localEnd = mounted ? toLocalDateTimeInput(endsAt) : "";
  const localDeadline = mounted ? toLocalDateTimeInput(registrationDeadline) : "";
  const date = localStart ? formatSellerProductDate(localStart) : "—";
  const schedule = localStart && localEnd
    ? `${localStart.slice(11)} – ${localEnd.slice(11)}${localStart.slice(0, ISO_DATE_LENGTH) !== localEnd.slice(0, ISO_DATE_LENGTH) ? ` (${formatSellerProductDate(localEnd)})` : ""}`
    : "—";
  const deadline = localDeadline ? `${formatSellerProductDate(localDeadline)} · ${localDeadline.slice(11)}` : "—";
  // Chỉ cho đăng ký khi API mở đăng ký và thời hạn chưa kết thúc.
  const registrationActive = registrationOpen && new Date(registrationDeadline).getTime() > currentNow;
  // Chuỗi thời gian còn lại hiển thị ở cột Hạn đăng ký.
  const remaining = registrationActive ? formatRegistrationRemaining(registrationDeadline, currentNow) : "Đã đóng đăng ký";
  // Đánh dấu chương trình sắp đóng trong vòng ba giờ.
  const closingSoon = registrationActive && new Date(registrationDeadline).getTime() - currentNow <= FLASH_SALE_CLOSING_SOON_MS;
  return (
    <tr className="border-t border-surface-border transition-colors hover:bg-surface-subtle">
      <td className="px-5 py-5">
        <p className="font-semibold text-main">{name}</p>
        <p className="mt-1.5 text-xs text-muted-foreground">#{id}</p>
      </td>
      <td className="px-4 py-5">
        <p className="whitespace-nowrap text-main">Ngày {date}</p>
        <p className="mt-1.5 whitespace-nowrap text-sm text-muted-foreground">{schedule}</p>
      </td>
      <td className="px-4 py-5">
        <p className="whitespace-nowrap text-main">{deadline}</p>
        <p className={cn("mt-1.5 flex items-center gap-1.5 text-xs", registrationActive ? "text-perk-hover" : "text-muted-foreground")}>
          <Timer className="size-3.5" aria-hidden="true" />{remaining}
        </p>
      </td>
      <td className="px-4 py-5">
        <span className={cn("inline-flex whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-semibold", !registrationActive ? "bg-surface-muted text-muted-foreground" : closingSoon ? "bg-star-light text-star-hover" : "bg-perk-light text-perk-hover")}>
          {!registrationActive ? "Đã hết hạn" : closingSoon ? "Sắp đóng đăng ký" : "Còn đăng ký"}
        </span>
      </td>
      {/* Nút xem giữ nguyên ở cả chương trình còn hạn và đã đóng đăng ký. */}
      <td className="px-5 py-4">
        <div className="flex flex-col items-stretch gap-2">
          <ShopFlashSaleRegistrationAction campaign={campaign} disabled={!registrationActive} />
          <Button type="button" variant="outline" size="sm" aria-disabled="true" title="Giao diện mẫu, chưa kết nối danh sách sản phẩm" className="rounded-lg text-primary shadow-none">
            <Package className="size-3.5" aria-hidden="true" />Sản phẩm đã đăng ký
          </Button>
        </div>
      </td>
    </tr>
  );
}
