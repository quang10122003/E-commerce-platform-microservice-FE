import { cn } from "@/lib/utils";

type PlatformShopLogoTextProps = {
  className?: string;
};

// Hiển thị wordmark hai tầng, cho phép tùy chỉnh qua className.
export function PlatformShopLogoText({ className }: PlatformShopLogoTextProps) {
  return (
    <span
      className={cn(
        "group/logo-text flex shrink-0 flex-col items-start gap-0.5 whitespace-nowrap px-[5px] pb-[3px] font-display text-[30px] text-primary lg:text-[34px]",
        className,
      )}
    >
      <span className="pl-0.5 font-heading text-[10px] leading-none font-extrabold tracking-[0.3em] text-main lg:text-[11px]">
        PLATFORM
      </span>
      <span
        className={cn(
          "origin-bottom-left -skew-x-9 leading-none font-black tracking-[-0.04em]",
          "[text-shadow:1px_1px_0_var(--color-primary-hover),3px_3px_0_color-mix(in_srgb,var(--color-primary)_16%,var(--color-primary-foreground))]",
          "transition-[color,text-shadow] duration-[220ms] ease-out motion-reduce:transition-none",
          "[@media(hover:hover)_and_(pointer:fine)]:group-hover/logo-text:text-primary-hover",
          "[@media(hover:hover)_and_(pointer:fine)]:group-hover/logo-text:[text-shadow:1px_1px_0_var(--color-primary-hover),4px_4px_0_color-mix(in_srgb,var(--color-primary)_20%,var(--color-primary-foreground))]",
        )}
      >
        SHOP
      </span>
    </span>
  );
}
