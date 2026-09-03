"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  Search,
  ExternalLink,
  PlusCircle,
  LogOut,
  Store,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";

interface SellerTopbarProps {
  onToggleSidebar: () => void;
}

export function SellerTopbar({ onToggleSidebar }: SellerTopbarProps) {
  return (
    <header className="h-16 bg-white border-b border-surface-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      {/* Left: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3">
        {/* Hamburger Menu Button on Mobile/Tablet */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-700 hover:text-main"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search */}
        <div className="hidden sm:block w-64 md:w-80">
          <Input
            placeholder="Tìm sản phẩm, đơn hàng của Shop..."
            leftIcon={<Search className="w-3.5 h-3.5 text-muted-foreground" />}
            className="h-9 bg-slate-50 border-slate-200 text-xs"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Add Product Button */}
        <Link href="/seller/products/new">
          <Button
            variant="cta"
            size="sm"
            leftIcon={<PlusCircle className="w-3.5 h-3.5" />}
            className="h-8 text-xs font-semibold px-3 hidden sm:inline-flex"
          >
            Đăng Sản Phẩm
          </Button>
        </Link>

        {/* View Public Shop Page */}
        <Link href="/shop/techstore-official" target="_blank">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs font-medium text-slate-700 gap-1.5 hidden md:inline-flex"
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
          className="relative text-slate-600 hover:text-main h-8 w-8"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cta"></span>
        </Button>

        {/* Divider */}
        <div className="h-5 w-px bg-slate-200"></div>

        {/* Shop Avatar & Status */}
        <div className="flex items-center gap-2 pl-1">
          <div className="w-8 h-8 rounded-full bg-cta text-white font-bold text-xs flex items-center justify-center shrink-0">
            TS
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-main leading-none truncate max-w-[120px]">
              TechStore
            </p>
            <span className="text-[10px] text-emerald-600 font-semibold">
              Shop Yêu Thích
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

