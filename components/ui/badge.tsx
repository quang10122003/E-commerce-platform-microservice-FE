import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Tag Thương hiệu chính (Indigo)
        primary:
          "bg-primary text-white hover:bg-primary-hover",
        // Tag Thương hiệu nhạt
        "primary-soft":
          "bg-primary-light text-primary border border-primary/20",
        // Tag Mua sắm / Sale đậm (Sunset Coral)
        cta:
          "bg-cta text-white hover:bg-cta-hover",
        // Tag Giảm giá % (nền cam nhạt chữ cam đậm)
        "cta-soft":
          "bg-cta-light text-cta border border-cta/20 font-bold",
        // Tag Freeship / Tiện ích (Emerald Mint)
        perk:
          "bg-perk text-white",
        // Tag Freeship nhạt
        "perk-soft":
          "bg-perk-light text-perk border border-perk/20 font-medium",
        // Tag Sao đánh giá / Top Bán chạy (Warm Amber)
        star:
          "bg-amber-100 text-amber-800 border border-amber-300/40",
        // Tag Cảnh báo / Hết hàng / Hủy (Rose Red)
        danger:
          "bg-danger text-white",
        "danger-soft":
          "bg-danger-light text-danger border border-danger/20",
        // Tag Trung tính
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200",
        outline:
          "border border-surface-border text-main bg-white",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px] rounded",
        md: "px-2.5 py-0.5 text-xs rounded-md",
        lg: "px-3 py-1 text-sm rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, size, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };

