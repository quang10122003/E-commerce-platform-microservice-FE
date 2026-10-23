import Link from "next/link";
import { ChevronRight, ShieldCheck } from "lucide-react";

// Thanh điều hướng tiến trình đặt hàng và cam kết an toàn.
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

      {/* Huy hiệu bảo mật thanh toán chuẩn SSL */}
      <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80">
        <ShieldCheck className="h-4 w-4" />
        <span>Thanh toán bảo mật SSL 256-bit</span>
      </div>
    </div>
  );
}
