import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ShopFlashSaleCampaign } from "@/types/shop/flash-sale";

// Điều hướng qua route đăng ký để hỗ trợ popup, refresh và liên kết trực tiếp.
export function ShopFlashSaleRegistrationAction({
  campaign,
  disabled = false,
}: {
  campaign: ShopFlashSaleCampaign;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled
        className="h-8 w-full justify-center rounded-lg border border-slate-200/60 bg-slate-100 text-xs text-muted-foreground shadow-none"
      >
        Đã đóng đăng ký
      </Button>
    );
  }

  return (
    <Link
      href={`/shop/flash-sales/${campaign.id}/register`}
      scroll={false}
      className={buttonVariants({
        variant: "primary",
        size: "sm",
        className: "h-8 w-full justify-center rounded-lg text-xs font-medium shadow-none hover:shadow-none",
      })}
    >
      Đăng ký sản phẩm
      <ArrowRight className="size-3.5" aria-hidden="true" />
    </Link>
  );
}
