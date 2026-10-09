import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ShopFlashSaleCampaign } from "@/types/shop/flash-sale";

// Điều hướng qua route đăng ký để hỗ trợ popup, refresh và liên kết trực tiếp.
export function ShopFlashSaleRegistrationAction({ campaign, disabled = false, preview = false }: {
  campaign?: ShopFlashSaleCampaign; disabled?: boolean; preview?: boolean;
}) {
  if (disabled) return <Button type="button" variant="secondary" size="sm" disabled>Đã đóng đăng ký</Button>;
  return <Link href={`/shop/flash-sales/${campaign?.id ?? "demo"}/register`} scroll={false}
    className={buttonVariants({ variant: preview ? "outline" : "gradient-cta", size: "sm", className: "rounded-lg shadow-none hover:shadow-none" })}>
    {preview ? "Xem trước form đăng ký" : "Đăng ký sản phẩm"}
    <ArrowRight className="size-3.5" aria-hidden="true" />
  </Link>;
}
