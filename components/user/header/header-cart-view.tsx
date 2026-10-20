import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Button } from "@/components/ui";

type HeaderCartViewProps = {
  isAuthChecking: boolean;
  itemCount: number;
  showCartBadge: boolean;
  variant: "desktop" | "mobile";
};

// Hiển thị giỏ hàng hoặc skeleton theo trạng thái kiểm tra phiên của navbar.
export function HeaderCartView({ isAuthChecking, itemCount, showCartBadge, variant }: HeaderCartViewProps) {
  // Rút gọn badge nhưng giữ số item thật trong slice và nhãn hỗ trợ đọc màn hình.
  const badgeCount = itemCount > 99 ? "99+" : itemCount;

  // Giữ kích thước khu vực giỏ hàng và không cho điều hướng khi phiên chưa kiểm tra xong.
  if (isAuthChecking) {
    return (
      <div
        className={variant === "desktop"
          ? "flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5"
          : "flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/80"}
        aria-label="Đang kiểm tra giỏ hàng"
        aria-busy="true"
        role="status"
      >
        <div className={`skeleton-shimmer rounded-md ${variant === "desktop" ? "h-4 w-4" : "h-5 w-5"}`} aria-hidden="true" />
        {variant === "desktop" ? <div className="skeleton-shimmer h-2.5 w-14 rounded-full" aria-hidden="true" /> : null}
      </div>
    );
  }

  // Giỏ hàng gọn trên mobile dùng cùng số item với nút desktop.
  if (variant === "mobile") {
    return (
      <Link href="/cart" data-cart-flight-target className="relative p-2 text-slate-700 hover:text-primary" aria-label="Giỏ hàng">
        <ShoppingCart className="w-5 h-5" />
        {showCartBadge ? (
          <span className="absolute top-0 right-0 bg-cta text-white text-[9px] font-black rounded-full h-4 min-w-4 px-1 flex items-center justify-center" aria-label={`${itemCount} sản phẩm trong giỏ`}>
            {badgeCount}
          </span>
        ) : null}
      </Link>
    );
  }

  // Nút giỏ hàng desktop giữ nguyên style và đích của hiệu ứng thêm sản phẩm.
  return (
    <Link href="/cart">
      <Button
        data-cart-flight-target
        variant="outline"
        size="sm"
        className="relative rounded-xl border-slate-200 hover:border-primary/50 hover:bg-indigo-50/40 h-10 px-3.5 gap-2"
      >
        <div className="relative">
          <ShoppingCart className="w-4 h-4 text-slate-700" />
          {showCartBadge ? (
            <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black rounded-full h-4.5 min-w-4.5 px-1 flex items-center justify-center shadow-md shadow-cta/30 animate-pulse" aria-label={`${itemCount} sản phẩm trong giỏ`}>
              {badgeCount}
            </span>
          ) : null}
        </div>
        <span className="font-semibold text-xs text-slate-800">Giỏ hàng</span>
      </Button>
    </Link>
  );
}
