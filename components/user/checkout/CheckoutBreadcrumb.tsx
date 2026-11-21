import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Thanh điều hướng tiến trình đặt hàng.
export function CheckoutBreadcrumb() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-surface-border bg-surface-card px-4 py-3 sm:px-6 rounded-xl shadow-xs">
      {/* Cụm breadcrumb điều hướng */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs sm:text-sm font-medium">
        <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
          Giỏ hàng
        </Link>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
        <span className="font-bold text-main">Thanh toán</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
        <span className="text-slate-400">Hoàn tất đơn hàng</span>
      </nav>
    </div>
  );
}
