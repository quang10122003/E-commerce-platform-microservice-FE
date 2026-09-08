import React from "react";
import Link from "next/link";
import { ShieldCheck, Store } from "lucide-react";
import { Button } from "@/components/ui";

export function ShopFooter() {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 mt-16 text-xs">
      {/* 1. NEWSLETTER SUBSCRIPTION STRIP */}
      <div className="border-b border-slate-800 py-10 px-4 sm:px-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              Đăng Ký Nhận Bản Tin Ưu Đãi
            </h3>
            <p className="text-xs text-slate-400">
              Nhận ngay voucher <span className="text-amber-400 font-bold">100.000đ</span> và cập nhật các deal flash sale sớm nhất.
            </p>
          </div>

          <div className="w-full md:w-auto flex items-center gap-2 max-w-md">
            <input
              type="email"
              placeholder="Nhập email của bạn..."
              className="h-10.5 px-4 bg-slate-800/90 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl text-xs w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button
              variant="gradient-cta"
              size="md"
              className="rounded-xl px-5 font-bold shrink-0 shadow-glow-cta"
            >
              Đăng Ký
            </Button>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER LINKS */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">
            Chăm Sóc Khách Hàng
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="/help" className="hover:text-white transition-colors">Trung tâm trợ giúp</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Trả hàng & Hoàn tiền</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">
            Về ModernShop
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li><Link href="#" className="hover:text-white transition-colors">Giới thiệu về ModernShop</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Tuyển dụng</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
            <li><Link href="#" className="hover:text-white transition-colors">Chính hãng 100%</Link></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">
            Phương Thức Thanh Toán
          </h4>
          <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-200">
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">VNPAY QR</span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">MOMO</span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">VISA / MASTER</span>
            <span className="px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">COD</span>
          </div>
          <div className="pt-2 text-emerald-400 font-semibold flex items-center gap-1.5 text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Thanh toán bảo mật SSL 256-bit</span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-bold text-white uppercase tracking-wider text-xs">
            Dành Cho Người Bán Hàng
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mở gian hàng kinh doanh cùng hàng triệu khách hàng tiềm năng toàn quốc.
          </p>
          <Link
            href="/seller"
            className="inline-flex items-center gap-2 font-bold text-amber-400 hover:text-amber-300 hover:underline pt-1"
          >
            <Store className="w-4 h-4" />
            <span>Vào Kênh Người Bán (Seller Center) →</span>
          </Link>
        </div>
      </div>

      {/* 3. COPYRIGHT */}
      <div className="border-t border-slate-800 py-6 px-4 text-center text-[11px] text-slate-500">
        © 2026 ModernShop E-Commerce Platform. Nền tảng thương mại điện tử hiện đại.
      </div>
    </footer>
  );
}
