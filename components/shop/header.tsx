"use client";

import React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search,
  Camera,
  ShoppingCart,
  Store,
  LogIn,
  Menu,
  X,
  User,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  Package,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react";
import { Button, Input } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AuthModal } from "./auth-modal";
import { useShopHeader } from "@/hooks/useShopHeader";

const HOT_KEYWORDS = ["iPhone 16", "Tai nghe ANC", "Bàn phím cơ", "Sạc 65W GaN", "Áo Polo"];

export function ShopHeader() {
  const {
    accountMenuRef,
    authModalTab,
    canAccessSellerChannel,
    closeMenu,
    isAccountMenuOpen,
    isAuthModalOpen,
    isMobileMenuOpen,
    mounted,
    openMenu,
    searchQuery,
    setAuthModalTab,
    setIsAccountMenuOpen,
    setIsAuthModalOpen,
    setSearchQuery,
    user,
  } = useShopHeader();

  return (
    <>
      {/* Khu vực header chính của trang mua sắm. */}
      <header className="sticky top-0 z-40 w-full glass-header border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
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

            {/* 2.2 SEARCH BAR WITH HOT KEYWORDS */}
            <div className="flex-1 max-w-xl mx-1 sm:mx-4">
              <div className="relative flex items-center">
                <Input
                  placeholder="Tìm kiếm sản phẩm, thương hiệu chính hãng..."
                  leftIcon={<Search className="w-4 h-4 text-primary" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 text-xs sm:text-sm bg-slate-50/90 rounded-xl pr-18 sm:pr-20 focus-visible:bg-white border-slate-200 focus-visible:ring-primary/25"
                />
                <Button
                  variant="gradient-cta"
                  size="sm"
                  type="button"
                  aria-label="Tìm kiếm sản phẩm bằng hình ảnh"
                  title="Tìm kiếm sản phẩm bằng hình ảnh"
                  className="absolute right-1.5 h-7.5 w-8 p-0 rounded-lg"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>

              {/* Hot search chips (desktop only) */}
              <div className="hidden lg:flex items-center gap-2 mt-1.5 px-1">
                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-cta" /> Gợi ý:
                </span>
                {HOT_KEYWORDS.map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => setSearchQuery(kw)}
                    className="text-[10px] text-slate-600 hover:text-primary transition-colors hover:underline cursor-pointer"
                  >
                    {kw}
                  </button>
                ))}
              </div>
            </div>

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
              {user ? (
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
                        <Link href="/seller" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                          <Store className="w-4 h-4 text-cta" /> Kênh người bán
                        </Link>
                      )}
                      <Link href="/user/settings" onClick={() => setIsAccountMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50" role="menuitem">
                        <Settings className="w-4 h-4 text-slate-500" /> Cài đặt
                      </Link>
                      <div className="my-1 border-t border-slate-100" />
                      <button type="button" onClick={() => setIsAccountMenuOpen(false)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50" role="menuitem">
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

      {/* 3. MOBILE DRAWER PORTAL */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              "fixed inset-0 z-[9999] md:hidden transition-all duration-300",
              isMobileMenuOpen
                ? "visible pointer-events-auto"
                : "invisible pointer-events-none"
            )}
          >
            {/* Backdrop */}
            <div
              onClick={closeMenu}
              className={cn(
                "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300",
                isMobileMenuOpen ? "opacity-100" : "opacity-0"
              )}
              aria-hidden="true"
            />

            {/* Slide-over Drawer Menu */}
            <div
              className={cn(
                "fixed top-0 bottom-0 right-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col justify-between transition-transform duration-300 ease-out z-[10000]",
                isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
              )}
            >
              <div className="p-5 space-y-5 overflow-y-auto">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-surface-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary text-white font-black flex items-center justify-center text-sm shadow-xs">
                      M
                    </div>
                    <div>
                      <span className="font-bold text-main text-sm block leading-none">
                        MODERN<span className="text-cta">SHOP</span>
                      </span>
                      <span className="text-[10px] text-muted-foreground">Menu Điều Hướng</span>
                    </div>
                  </div>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-lg text-slate-400 hover:text-main hover:bg-slate-100 active:scale-90 transition-all"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* User Auth Box */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50 to-orange-50/40 border border-indigo-100 space-y-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-700 text-white flex items-center justify-center shadow-md shadow-primary/20">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-main">
                        {user ? user.fullName ?? "Xin chào bạn!" : "Chào mừng bạn!"}
                      </h4>
                      <p className="text-[11px] text-muted-foreground">
                        {user ? user.email : "Đăng nhập nhận voucher 50.000đ"}
                      </p>
                    </div>
                  </div>
                  {!user && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Button
                        variant="gradient-primary"
                        size="sm"
                        fullWidth
                        className="text-xs font-bold"
                        onClick={() => {
                          closeMenu();
                          setAuthModalTab("login");
                          setIsAuthModalOpen(true);
                        }}
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        fullWidth
                        className="text-xs font-bold bg-white"
                        onClick={() => {
                          closeMenu();
                          setAuthModalTab("register");
                          setIsAuthModalOpen(true);
                        }}
                      >
                        Đăng ký
                      </Button>
                    </div>
                  )}
                  {user && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {canAccessSellerChannel && (
                        <Link href="/seller" onClick={closeMenu} className="flex items-center justify-center gap-1.5 rounded-xl bg-cta px-3 py-2 text-xs font-bold text-white">
                          <Store className="w-3.5 h-3.5" /> Người bán
                        </Link>
                      )}
                      <button type="button" onClick={closeMenu} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-red-600">
                        <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Chức Năng Nổi Bật
                  </p>

                  {/* Liên kết tài khoản và cài đặt cá nhân. */}
                  <Link
                    href="/user/profile"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-primary flex items-center justify-center">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Tài khoản của tôi</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  <Link
                    href="/user/settings"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-semibold">Cài đặt</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Đơn mua của tôi */}
                  <Link
                    href="/user/orders"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block leading-tight">Đơn Mua</span>
                        <span className="text-[10px] text-muted-foreground">Theo dõi hành trình đơn</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Trợ giúp */}
                  <Link
                    href="/help"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Trung Tâm Trợ Giúp</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-surface-border text-center text-[11px] text-muted-foreground bg-slate-50">
                <div className="flex items-center justify-center gap-1.5 font-semibold text-emerald-600 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Sản Phẩm Chính Hãng</span>
                </div>
                <span>ModernShop E-Commerce Platform © 2026</span>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* 4. AUTH MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
