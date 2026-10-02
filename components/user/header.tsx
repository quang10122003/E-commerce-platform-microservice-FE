"use client";

import React from "react";
import { HeaderMobileDrawer } from "./header-mobile-drawer";
import { HeaderSearch } from "./header-search";
import Link from "next/link";
import {
  ShoppingCart,
  Store,
  LogIn,
  Menu,
  User,
  ChevronDown,
  Package,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AuthModal } from "./auth-modal";
import { useShopHeader } from "@/hooks/useShopHeader";

export function ShopHeader() {
  const {
    accountMenuRef,
    authModalTab,
    canAccessSellerChannel,
    closeMenu,
    isAccountMenuOpen,
    isAuthChecking,
    isAuthModalOpen,
    isMobileMenuOpen,
    isLogoutLoading,
    mounted,
    openMenu,
    searchQuery,
    setAuthModalTab,
    setIsAccountMenuOpen,
    setIsAuthModalOpen,
    setSearchQuery,
    handleLogout,
    handleSearch,
    user,
  } = useShopHeader();

  return (
    <>
      {/* Khu vực header chính của trang mua sắm. */}
      <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-200/80 shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* 2.1 LOGO */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary via-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/25 group-hover:scale-105 transition-transform">
                M
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-main leading-none">
                  MODERN<span className="text-cta">SHOP</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-bold tracking-widest mt-0.5">
                  PREMIUM STORE
                </span>
              </div>
            </Link>

            <HeaderSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearch={handleSearch} />

            {/* 2.3 DESKTOP ACTIONS */}
            <div className="hidden md:flex items-center gap-3 shrink-0">
              {/* Giỏ hàng */}
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-xl border-slate-200 hover:border-primary/50 hover:bg-indigo-50/40 h-10 px-3.5 gap-2"
                >
                  <div className="relative">
                    <ShoppingCart className="w-4 h-4 text-slate-700" />
                    <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] font-black rounded-full h-4.5 w-4.5 flex items-center justify-center shadow-md shadow-cta/30 animate-pulse">
                      3
                    </span>
                  </div>
                  <span className="font-semibold text-xs text-slate-800">Giỏ hàng</span>
                </Button>
              </Link>

              {/* Khu vực tài khoản và các thao tác nhanh của người dùng. */}
              {isAuthChecking ? (
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3 py-1.5" aria-label="Đang kiểm tra tài khoản">
                  <div className="skeleton-shimmer h-7 w-7 rounded-full" />
                  <div className="space-y-1.5">
                    <div className="skeleton-shimmer h-2.5 w-20 rounded-full" />
                    <div className="skeleton-shimmer h-2 w-12 rounded-full" />
                  </div>
                </div>
              ) : user ? (
                <div ref={accountMenuRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsAccountMenuOpen((isOpen) => !isOpen)}
                    className="flex items-center gap-2 bg-indigo-50/80 border border-indigo-100 rounded-xl px-3 py-1.5 hover:bg-indigo-100/80 transition-colors"
                    aria-expanded={isAccountMenuOpen}
                    aria-haspopup="menu"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-xs">
                      {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                      {user.fullName ?? "Tài khoản"}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-slate-500 transition-transform", isAccountMenuOpen && "rotate-180")} />
                  </button>

                  {isAccountMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-3d z-50" role="menu">
                      <Link href="/user/profile" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                        <User className="w-4 h-4 text-primary" /> Tài khoản của tôi
                      </Link>
                      <Link href="/user/orders" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                        <Package className="w-4 h-4 text-primary" /> Đơn mua
                      </Link>
                      {canAccessSellerChannel && (
                        <Link href="/shop" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                          <Store className="w-4 h-4 text-cta" /> Kênh người bán
                        </Link>
                      )}
                      <Link href="/user/settings" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                        <Settings className="w-4 h-4 text-slate-500" /> Cài đặt
                      </Link>
                      <div className="my-1 border-t border-slate-100" />
                      <button type="button" onClick={handleLogout} disabled={isLogoutLoading} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60" role="menuitem">
                        <LogOut className="w-4 h-4" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="gradient-primary"
                  size="sm"
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                  className="h-10 px-4 text-xs font-bold rounded-xl shadow-md shadow-primary/25"
                  onClick={() => {
                    setAuthModalTab("login");
                    setIsAuthModalOpen(true);
                  }}
                >
                  Đăng nhập
                </Button>
              )}
            </div>

            {/* 2.4 MOBILE HAMBURGER BUTTON */}
            <div className="md:hidden flex items-center gap-2 shrink-0">
              <Link href="/cart" className="relative p-2 text-slate-700 hover:text-primary">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-0 right-0 bg-cta text-white text-[9px] font-black rounded-full h-4 w-4 flex items-center justify-center">
                  3
                </span>
              </Link>
              <button
                type="button"
                onClick={openMenu}
                className="h-9 w-9 flex items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <HeaderMobileDrawer
        mounted={mounted}
        isMobileMenuOpen={isMobileMenuOpen}
        isAuthChecking={isAuthChecking}
        isLogoutLoading={isLogoutLoading}
        canAccessSellerChannel={canAccessSellerChannel}
        user={user}
        closeMenu={closeMenu}
        setAuthModalTab={setAuthModalTab}
        setIsAuthModalOpen={setIsAuthModalOpen}
        handleLogout={handleLogout}
      />

      {/* 4. AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
