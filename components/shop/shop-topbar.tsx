"use client";

import React from "react";
import Link from "next/link";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui";
import { useShopHeader } from "@/hooks/useShopHeader";

interface SellerTopbarProps {
  onToggleSidebar: () => void;
}

export function SellerTopbar({ onToggleSidebar }: SellerTopbarProps) {
  const {
    accountMenuRef,
    isAccountMenuOpen,
    isAuthChecking,
    isLogoutLoading,
    setIsAccountMenuOpen,
    handleLogout,
    user,
  } = useShopHeader();

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Nút mở sidebar trên mobile. */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={onToggleSidebar}
          className="lg:hidden text-slate-700 hover:text-main rounded-xl"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Thông báo và thông tin shop trên topbar. */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="relative text-slate-600 hover:text-main h-9 w-9 rounded-xl border-slate-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-cta animate-pulse"></span>
        </Button>

        <div className="h-5 w-px bg-slate-200" />

        <div ref={accountMenuRef} className="relative">
          {isAuthChecking ? (
            <div className="flex items-center gap-2 px-1.5 py-1" aria-label="Đang kiểm tra tài khoản">
              <div className="skeleton-shimmer h-9 w-9 rounded-full" />
              <div className="hidden sm:block space-y-1.5">
                <div className="skeleton-shimmer h-2.5 w-28 rounded-full" />
                <div className="skeleton-shimmer h-2 w-20 rounded-full" />
              </div>
            </div>
          ) : user ? (
            <>
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
                className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-slate-50 transition-colors"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                  {user.fullName?.charAt(0).toUpperCase() || ""}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-main leading-none truncate max-w-[140px]">
                    {user.fullName}
                  </p>
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                    Đang hoạt động (Online)
                  </span>
                </div>
                <ChevronDown className={`hidden sm:block w-3.5 h-3.5 text-slate-500 transition-transform ${isAccountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isAccountMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-3d z-50" role="menu">
              <Link
                href="/user/profile"
                onClick={() => setIsAccountMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
              >
                <User className="w-4 h-4 text-primary" />
                Tài khoản của tôi
              </Link>
              <Link
                href="/user/settings"
                onClick={() => setIsAccountMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                role="menuitem"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                Cài đặt
              </Link>
              <div className="my-1 border-t border-slate-100" />
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLogoutLoading}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                role="menuitem"
              >
                <LogOut className="w-4 h-4" />
                {isLogoutLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
