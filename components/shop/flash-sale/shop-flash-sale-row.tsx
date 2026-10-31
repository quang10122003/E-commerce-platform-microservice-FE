"use client";

import Link from "next/link";
import { ISO_DATE_LENGTH, FLASH_SALE_CLOSING_SOON_MS } from "@/lib/constants";
import { useMounted } from "@/lib/hooks";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";
import { formatRegistrationRemaining } from "@/lib/utils/flash-sale.utils";
import type { ShopFlashSaleCampaign } from "@/types/shop/flash-sale";
import { useRegistrationCountdown } from "@/hooks/shop/flash-sale/useRegistrationCountdown";
import { Calendar, Package, Timer, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ShopFlashSaleRegistrationAction } from "./shop-flash-sale-registration-action";

// Hiển thị lịch theo múi giờ thiết bị, sử dụng cấu trúc font và cỡ chữ của shop/products.
export function ShopFlashSaleRow({ campaign, now }: { campaign: ShopFlashSaleCampaign; now: number }) {
  const mounted = useMounted();
  const currentNow = useRegistrationCountdown(now);
  const { id, name, registrationOpen, registrationDeadline, startsAt, endsAt } = campaign;

  const localStart = mounted ? toLocalDateTimeInput(startsAt) : "";
  const localEnd = mounted ? toLocalDateTimeInput(endsAt) : "";
  const localDeadline = mounted ? toLocalDateTimeInput(registrationDeadline) : "";
  const date = localStart ? formatSellerProductDate(localStart) : "—";
  const schedule = localStart && localEnd
    ? `${localStart.slice(11)} – ${localEnd.slice(11)}${localStart.slice(0, ISO_DATE_LENGTH) !== localEnd.slice(0, ISO_DATE_LENGTH) ? ` (${formatSellerProductDate(localEnd)})` : ""}`
    : "—";
  const deadline = localDeadline ? `${formatSellerProductDate(localDeadline)} · ${localDeadline.slice(11)}` : "—";
  const registrationActive = registrationOpen && new Date(registrationDeadline).getTime() > currentNow;
  const remaining = registrationActive ? formatRegistrationRemaining(registrationDeadline, currentNow) : "Đã đóng đăng ký";
  const closingSoon = registrationActive && new Date(registrationDeadline).getTime() - currentNow <= FLASH_SALE_CLOSING_SOON_MS;

  return (
    <TableRow className="transition-colors hover:bg-slate-50/80">
      {/* Tên chương trình và mã số theo typography của shop/products */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-500">
            <Zap className="size-4" aria-hidden="true" />
          </div>
          <div className="space-y-0.5 min-w-0">
            <p className="line-clamp-2 font-heading text-sm font-medium leading-snug text-main sm:line-clamp-1">
              {name}
            </p>
            <p className="text-xs text-muted-foreground">
              ID: #{id}
            </p>
          </div>
        </div>
      </TableCell>

      {/* Thời gian diễn ra sự kiện */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Calendar className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>{date}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {schedule}
        </p>
      </TableCell>

      {/* Mốc hạn chót đăng ký sản phẩm */}
      <TableCell className="px-4 py-3.5">
        <p className="text-sm text-slate-700">{deadline}</p>
        <div className={cn("mt-0.5 flex items-center gap-1 text-xs", closingSoon ? "text-amber-700 font-semibold" : registrationActive ? "text-emerald-700 font-medium" : "text-muted-foreground")}>
          <Timer className="size-3 shrink-0" aria-hidden="true" />
          <span>{remaining}</span>
        </div>
      </TableCell>

      {/* Huy hiệu tình trạng đăng ký */}
      <TableCell className="px-4 py-3.5">
        <Badge
          variant="outline"
          size="xs"
          className={cn(
            "whitespace-nowrap text-[11px] font-semibold px-2 py-0.5",
            !registrationActive
              ? "bg-slate-100 text-slate-600 border-slate-200"
              : closingSoon
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-emerald-50 text-emerald-700 border-emerald-200"
          )}
        >
          {!registrationActive ? "Đã hết hạn" : closingSoon ? "Sắp đóng đăng ký" : "Đang mở đăng ký"}
        </Badge>
      </TableCell>

      {/* Cụm nút hành động theo chiều dọc kể cả trên PC */}
      <TableCell className="px-4 py-3.5">
        <div className="flex flex-col items-stretch gap-1.5 w-full min-w-[140px] max-w-[165px]">
          <ShopFlashSaleRegistrationAction campaign={campaign} disabled={!registrationActive} />
          <Link
            href={`/shop/flash-sales/${id}/items`}
            scroll={false}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 w-full justify-center rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-none"
            )}
          >
            <Package className="size-3.5" aria-hidden="true" />
            Sản phẩm đã đăng ký
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
