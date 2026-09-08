import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] select-none cursor-pointer",
  {
    variants: {
      variant: {
        // Nút Brand chính (Indigo)
        primary:
          "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30",
        // Nút Brand Gradient rực rỡ
        "gradient-primary":
          "bg-gradient-to-r from-primary via-indigo-600 to-indigo-700 text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 hover:brightness-105",
        // Nút Mua ngay / CTA chính (Sunset Coral)
        cta:
          "bg-cta text-white hover:bg-cta-hover shadow-md shadow-cta/25 hover:shadow-lg hover:shadow-cta/35 font-bold",
        // Nút CTA Gradient rực lửa
        "gradient-cta":
          "bg-gradient-to-r from-orange-500 via-cta to-red-600 text-white shadow-md shadow-cta/30 hover:shadow-lg hover:shadow-cta/40 hover:brightness-105 font-bold tracking-tight",
        // Nút Thêm vào giỏ hàng (Coral nhạt viền Coral)
        "cta-outline":
          "bg-cta-light border border-cta/30 text-cta hover:bg-orange-100 hover:border-cta font-semibold",
        // Nút Tiện ích / Freeship (Emerald Mint)
        perk:
          "bg-perk text-white hover:bg-perk-hover shadow-md shadow-perk/20",
        // Nút Secondary / Xám trung tính
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200/60",
        // Nút Viền mỏng
        outline:
          "border border-surface-border bg-white text-main hover:bg-slate-50 hover:border-slate-300 shadow-2xs",
        // Nút Trong suốt
        ghost:
          "hover:bg-slate-100/80 text-slate-700 hover:text-main",
        // Nút Hủy / Xóa
        danger:
          "bg-danger text-white hover:bg-danger-hover shadow-md shadow-danger/20",
        // Nút Link text
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        sm: "h-8.5 px-3 text-xs rounded-lg",
        md: "h-10 px-4 py-2 text-sm rounded-xl",
        lg: "h-12 px-6 text-base font-bold rounded-xl",
        icon: "h-10 w-10 p-0 rounded-xl",
        "icon-sm": "h-8.5 w-8.5 p-0 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-current" />
            <span>Đang xử lý...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
