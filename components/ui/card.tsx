import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  variant?: "default" | "elevated" | "glass" | "bordered" | "3d";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "border border-slate-200/90 bg-white shadow-card",
      elevated: "border border-slate-200/80 bg-white shadow-3d hover:shadow-3d-hover",
      "3d": "border border-slate-200/90 bg-white shadow-3d",
      glass: "border border-white/60 bg-white/90 backdrop-blur-md shadow-card",
      bordered: "border-2 border-slate-200 bg-white shadow-card",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl text-main transition-all duration-300",
          variantStyles[variant],
          hoverEffect &&
            "hover:shadow-3d-hover hover:-translate-y-1.5 hover:border-indigo-300/80",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-5 sm:p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold leading-none tracking-tight text-main text-base sm:text-lg",
      "font-black leading-none tracking-tight text-main text-base sm:text-lg",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs sm:text-sm text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-5 sm:p-6 pt-0 sm:pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-5 sm:p-6 pt-0 sm:pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
