import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 select-none",
  {
    variants: {
      variant: {
        // Tag Thương hiệu chính (Indigo)
        primary:
          "bg-primary text-white hover:bg-primary-hover shadow-xs",
        // Tag Thương hiệu nhạt
        "primary-soft":
          "bg-primary-light text-primary border border-primary/20",
        // Tag Mua sắm / Sale đậm (Sunset Coral)
        cta:
          "bg-cta text-white hover:bg-cta-hover shadow-xs",
        // Tag Giảm giá % (nền cam nhạt chữ cam đậm)
        "cta-soft":
          "bg-cta-light text-cta border border-cta/30 font-bold",
        // Tag Freeship / Tiện ích (Emerald Mint)
        perk:
          "bg-perk text-white shadow-xs",
        // Tag Freeship nhạt
        "perk-soft":
          "bg-emerald-50 text-emerald-700 border border-emerald-200/80 font-medium",
        // Tag Freeship Xtra (Xanh ngọc Mint đậm rực rỡ)
        "freeship-xtra":
          "bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold tracking-tight shadow-xs",
        // Tag Shopee/Lazada Mall (Đỏ đô rượu cao cấp)
        mall:
          "bg-gradient-to-r from-red-600 to-rose-600 text-white font-black tracking-tight uppercase shadow-xs",
        // Tag Hot / Lửa Flash Sale
        flame:
          "bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold shadow-xs",
        // Tag Yêu Thích+
        favorite:
          "bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-[9px] uppercase shadow-xs",
        // Tag Sao đánh giá / Top Bán chạy (Warm Amber)
        star:
          "bg-amber-50 text-amber-800 border border-amber-300/60 font-semibold",
        // Tag Cảnh báo / Hết hàng / Hủy (Rose Red)
        danger:
          "bg-danger text-white shadow-xs",
        "danger-soft":
          "bg-danger-light text-danger border border-danger/20",
        // Tag Trung tính
        secondary:
          "bg-slate-100 text-slate-700 hover:bg-slate-200",
        outline:
          "border border-surface-border text-main bg-white hover:bg-slate-50",
      },
      size: {
        xs: "px-1 py-0.2 text-[9px] rounded-xs leading-none",
        sm: "px-1.5 py-0.5 text-[10px] rounded-sm",
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
