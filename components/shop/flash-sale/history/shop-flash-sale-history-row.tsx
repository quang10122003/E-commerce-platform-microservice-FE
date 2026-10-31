"use client";

import Link from "next/link";
import { Calendar, Clock, History, Package } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useMounted } from "@/lib/hooks";
import { toLocalDateTimeInput } from "@/utils/date-time.utils";
import { formatSellerProductDate } from "@/lib/utils/shop-product.utils";
import { formatCampaignDuration } from "@/lib/utils/flash-sale.utils";
import type { ShopCompletedFlashSaleCampaign } from "@/types/shop/flash-sale";

// Dòng hiển thị thông tin một chiến dịch Flash Sale đã hoàn thành theo chuẩn font của shop/products.
export function ShopFlashSaleHistoryRow({ campaign }: { campaign: ShopCompletedFlashSaleCampaign }) {
  const mounted = useMounted();
  const { id, name, startsAt, endsAt } = campaign;
  const start = mounted ? toLocalDateTimeInput(startsAt) : "";
  const end = mounted ? toLocalDateTimeInput(endsAt) : "";
  const duration = formatCampaignDuration(startsAt, endsAt);

  return (
    <TableRow className="transition-colors hover:bg-slate-50/80">
      {/* Tên chiến dịch, icon và mã định danh theo chuẩn typography của shop/products */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-slate-200/80 bg-slate-100 text-slate-500">
            <History className="size-4" aria-hidden="true" />
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

      {/* Mốc thời gian bắt đầu */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Calendar className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>{start ? formatSellerProductDate(start) : "—"}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {start ? start.slice(11) : "—"}
        </p>
      </TableCell>

      {/* Mốc thời gian kết thúc */}
      <TableCell className="px-4 py-3.5">
        <div className="flex items-center gap-1.5 text-sm text-slate-700">
          <Calendar className="size-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>{end ? formatSellerProductDate(end) : "—"}</span>
        </div>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {end ? end.slice(11) : "—"}
        </p>
      </TableCell>

      {/* Thời lượng diễn ra */}
      <TableCell className="px-4 py-3.5">
        <Badge variant="outline" size="xs" className="gap-1 text-[11px] font-medium bg-slate-50 text-slate-600 border-slate-200">
          <Clock className="size-3 text-slate-400" aria-hidden="true" />
          {duration}
        </Badge>
      </TableCell>

      {/* Thao tác xem sản phẩm đã tham gia */}
      <TableCell className="px-4 py-3.5">
        <div className="w-full min-w-[140px] max-w-[165px]">
          <Link
            href={`/shop/flash-sales/history/${id}/items`}
            scroll={false}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 w-full justify-center rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-800 shadow-none"
            )}
          >
            <Package className="size-3.5" aria-hidden="true" />
            Chi tiết
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
}
