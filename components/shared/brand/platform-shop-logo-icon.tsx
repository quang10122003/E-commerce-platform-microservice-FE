import { cn } from "@/lib/utils";

type PlatformShopLogoIconProps = {
  className?: string;
};

// Hiển thị biểu tượng túi mua sắm, cho phép tùy chỉnh qua className.
export function PlatformShopLogoIcon({ className }: PlatformShopLogoIconProps) {
  return (
    <svg
      className={cn(
        "size-12 shrink-0 overflow-visible [filter:drop-shadow(0_3px_2px_color-mix(in_srgb,var(--color-primary)_18%,transparent))]",
        "transition-[transform,filter] duration-[220ms] ease-out motion-reduce:transition-none",
        "motion-safe:[@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-0.5 motion-safe:[@media(hover:hover)_and_(pointer:fine)]:hover:-rotate-4",
        className,
      )}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label="platform shop"
      focusable="false"
    >
      {/* Các mặt gấp tạo khối túi mua sắm, chữ P giữ nhận diện khi thu nhỏ. */}
      <path d="M20 25V17a10 10 0 0 1 20 0v6" className="stroke-primary-hover" strokeWidth="4.5" strokeLinecap="round" />
      <path d="m11 23 31-5 12 6-32 6-11-7Z" className="fill-primary-hover" />
      <path d="m42 18 12 6-1 29-12 6 1-41Z" className="fill-cta" />
      <path d="m54 24-7 6 6 23 1-29Z" className="fill-cta-hover" />
      <path d="m11 23 31-5-1 41-31-6 1-30Z" className="fill-primary" />
      <path d="m13 24 26-4" className="stroke-primary-foreground/35" strokeWidth="1.5" strokeLinecap="round" />
      <path d="m20 46 1-17 8-1c8-1 9 11 1 12l-9 1" className="stroke-primary-foreground" strokeWidth="4" strokeLinecap="square" strokeLinejoin="round" />
    </svg>
  );
}
