import Link from "next/link";
import { Check, Package, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CheckoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal thông báo đặt hàng thành công sau khi người dùng bấm Đặt hàng.
export function CheckoutSuccessModal({ isOpen, onClose }: CheckoutSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-surface-border bg-white shadow-3d p-6 text-center space-y-5 animate-in zoom-in-95 duration-200">
        {/* Biểu tượng thành công với hiệu ứng nổi */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-8 ring-emerald-50">
          <Check className="h-8 w-8 stroke-[3]" />
        </div>

        {/* Lời chúc và tiêu đề đơn hàng */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-main">Đặt Hàng Thành Công!</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Cảm ơn bạn đã mua sắm tại ModernShop. Đơn hàng của bạn đang được người bán chuẩn bị để bàn giao cho đơn vị vận chuyển.
          </p>
        </div>

        {/* Bảng tóm tắt thông tin đơn hàng đã tạo */}
        <div className="rounded-xl border border-surface-border bg-slate-50/80 p-4 text-left text-xs space-y-2.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Mã đơn hàng:</span>
            <span className="font-bold text-primary">MD-20261014-8849</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Thời gian đặt:</span>
            <span className="font-medium text-slate-800">14:15 - 14/10/2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Người nhận:</span>
            <span className="font-medium text-slate-800">Nguyễn Văn An (0987 654 321)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Hình thức thanh toán:</span>
            <span className="font-medium text-slate-800">VietQR / Chuyển khoản</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
            <span className="text-main">Tổng thanh toán:</span>
            <span className="text-cta">{formatCurrency(6735000)}</span>
          </div>
        </div>

        {/* Các nút điều hướng tiếp theo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
          >
            <ShoppingBag className="h-4 w-4" /> Tiếp tục mua sắm
          </Link>
          <Link
            href="/"
            onClick={onClose}
            className="flex h-11 items-center justify-center gap-2 rounded-xl bg-primary text-xs font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-hover active:scale-95 transition-all"
          >
            <Package className="h-4 w-4" /> Xem đơn hàng <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
