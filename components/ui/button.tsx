import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Nút Brand chính (Indigo)
        primary:
          "bg-primary text-white hover:bg-primary-hover shadow-sm",
        // Nút Mua ngay / CTA chính (Sunset Coral)
        cta:
          "bg-cta text-white hover:bg-cta-hover shadow-sm font-semibold",
        // Nút Thêm vào giỏ hàng (Coral nhạt viền Coral)
        "cta-outline":
          "bg-cta-light border border-cta text-cta hover:bg-orange-100/80 font-medium",
        // Nút Tiện ích / Freeship (Emerald Mint)
        perk:
          "bg-perk text-white hover:bg-perk-hover shadow-sm",
        // Nút Secondary / Xám trung tính
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200",
        // Nút Viền mỏng
        outline:
          "border border-surface-border bg-white text-main hover:bg-slate-50 hover:border-slate-300",
        // Nút Trong suốt
        ghost:
          "hover:bg-slate-100 text-slate-700 hover:text-main",
        // Nút Hủy / Xóa
        danger:
          "bg-danger text-white hover:bg-danger-hover shadow-sm",
        // Nút Link text
        link:
          "text-primary underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base font-semibold",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0 rounded-md",
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

