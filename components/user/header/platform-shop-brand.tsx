import Link from "next/link";
import { PlatformShopLogoIcon } from "@/components/shared/brand/platform-shop-logo-icon";
import { PlatformShopLogoText } from "@/components/shared/brand/platform-shop-logo-text";

// Hiển thị logo trên mobile và tên thương hiệu trên tablet, desktop.
export function PlatformShopBrand() {
  return (
    <Link
      href="/"
      aria-label="platform shop — Trang chủ"
      className="inline-flex h-12 shrink-0 items-center rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-primary"
    >
      <PlatformShopLogoIcon className="sm:hidden" />

      {/* Wordmark thay logo từ breakpoint tablet để tránh hiển thị trùng. */}
      <PlatformShopLogoText className="hidden sm:flex" />
    </Link>
  );
}
