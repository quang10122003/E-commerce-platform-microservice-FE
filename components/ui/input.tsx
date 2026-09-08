import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, leftIcon, rightIcon, helperText, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}

          <input
            type={type}
            className={cn(
              "flex h-10.5 w-full rounded-xl border bg-surface-card px-3.5 py-2 text-sm text-main placeholder:text-placeholder transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10.5",
              rightIcon && "pr-10.5",
              error
                ? "border-danger focus-visible:ring-danger/20 focus-visible:border-danger bg-rose-50/20"
                : "border-surface-border hover:border-slate-300 focus-visible:border-primary focus-visible:ring-primary/20",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3.5 flex items-center text-muted-foreground">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="text-xs text-danger font-medium flex items-center gap-1">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
