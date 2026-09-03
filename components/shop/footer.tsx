import React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, RotateCcw, Headphones, Store } from "lucide-react";

export function ShopFooter() {
  return (
    <footer className="w-full bg-white border-t border-surface-border mt-16 text-xs text-muted-foreground">
      {/* 1. PERKS BANNER */}
      <div className="border-b border-surface-border py-8 px-4 sm:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-main text-sm">Giao hàng toàn quốc</h5>
              <p className="text-xs text-muted-foreground">Miễn phí vận chuyển từ 150k</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-perk flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-main text-sm">100% Chính hãng</h5>
              <p className="text-xs text-muted-foreground">Bảo đảm nguồn gốc xuất xứ</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-main text-sm">Đổi trả 15 ngày</h5>
              <p className="text-xs text-muted-foreground">Thủ tục nhanh chóng dễ dàng</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-cta flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-semibold text-main text-sm">Hỗ trợ 24/7</h5>
              <p className="text-xs text-muted-foreground">Tư vấn tận tình chu đáo</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h4 className="font-bold text-main uppercase tracking-wider text-xs">
            Chăm sóc khách hàng
          </h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-primary transition-colors">Trung tâm trợ giúp</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Hướng dẫn mua hàng</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Chính sách vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Trả hàng & Hoàn tiền</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-main uppercase tracking-wider text-xs">
            Về ModernShop
          </h4>
          <ul className="space-y-2">
            <li><Link href="#" className="hover:text-primary transition-colors">Giới thiệu về ModernShop</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Tuyển dụng</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Điều khoản dịch vụ</Link></li>
            <li><Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-main uppercase tracking-wider text-xs">
            Phương thức thanh toán
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
            <span className="px-2.5 py-1.5 bg-slate-100 rounded-md border border-slate-200">VNPAY</span>
            <span className="px-2.5 py-1.5 bg-slate-100 rounded-md border border-slate-200">MOMO</span>
            <span className="px-2.5 py-1.5 bg-slate-100 rounded-md border border-slate-200">VISA / MASTER</span>
            <span className="px-2.5 py-1.5 bg-slate-100 rounded-md border border-slate-200">COD</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-main uppercase tracking-wider text-xs">
            Dành cho Người Bán Hàng
          </h4>
          <p className="text-xs">
            Mở gian hàng kinh doanh cùng hàng triệu khách hàng tiềm năng.
          </p>
          <Link
            href="/seller"
            className="inline-flex items-center gap-1.5 font-semibold text-cta hover:underline"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Truy cập Kênh Người Bán (Seller Center) →</span>
          </Link>
        </div>
      </div>

      {/* 3. COPYRIGHT */}
      <div className="border-t border-surface-border py-4 px-4 text-center text-[11px] text-slate-400">
        © 2026 ModernShop E-Commerce Platform. All rights reserved.
      </div>
    </footer>
  );
}
