"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  PlusCircle,
  Store,
} from "lucide-react";
import { Button, Input } from "@/components/ui";

interface SellerTopbarProps {
  onToggleSidebar: () => void;
}

export function SellerTopbar({ onToggleSidebar }: SellerTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button on Mobile/Tablet */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-700 hover:text-main rounded-xl"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <div className="hidden sm:block w-64 md:w-80">
          <Input
            placeholder="Tìm mã đơn, tên sản phẩm..."
            leftIcon={<Search className="w-3.5 h-3.5 text-slate-400" />}
            className="h-9 bg-slate-50 border-slate-200 text-xs rounded-xl focus-visible:bg-white"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Quick Add Product Button */}
        <Link href="/seller/products/new">
          <Button
            variant="gradient-cta"
            size="sm"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            className="h-9 text-xs font-bold px-3.5 rounded-xl hidden sm:inline-flex shadow-glow-cta"
          >
            Đăng Sản Phẩm
          </Button>
        </Link>

        {/* View Public Shop Page */}
        <Link href="/" target="_blank">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-xs font-bold text-slate-700 gap-1.5 hidden md:inline-flex rounded-xl border-slate-200"
          >
            <Store className="w-3.5 h-3.5 text-cta" />
            <span>Xem Gian Hàng</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Button>
        </Link>

        {/* Notifications */}
        <Button
          variant="outline"
          size="icon-sm"
          className="relative text-slate-600 hover:text-main h-9 w-9 rounded-xl border-slate-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cta animate-pulse"></span>
        </Button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200"></div>

        {/* Shop Avatar & Status */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
            TS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-main leading-none truncate max-w-[120px]">
              TechStore Official
            </p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              Shop Yêu Thích+
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
