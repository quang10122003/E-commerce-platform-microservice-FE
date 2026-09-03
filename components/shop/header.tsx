"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/hooks";
import Link from "next/link";
import {
  Search,
  ShoppingCart,
  Store,
  LogIn,
  Menu,
  X,
  User,
  UserPlus,
  Bell,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Package,
  Heart,
} from "lucide-react";
import { Button, Input, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { AuthModal } from "./auth-modal";

export function ShopHeader() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mounted = useMounted();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const closeMenu = () => setIsMobileMenuOpen(false);
  const openMenu = () => setIsMobileMenuOpen(true);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-surface-border shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3">
          <div className="flex items-center justify-between gap-3 sm:gap-6">
            {/* 1. LOGO */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-white font-black text-xl shadow-md shadow-primary/20">
                M
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg sm:text-xl font-black tracking-tight text-main leading-none">
                  MODERN<span className="text-cta">SHOP</span>
                </span>
                <span className="text-[9px] text-muted-foreground font-semibold tracking-wider">
                  PLATFORM
                </span>
              </div>
            </Link>

            {/* 2. COMPACT SEARCH BAR */}
            <div className="flex-1 max-w-md mx-1 sm:mx-4">
              <div className="relative flex items-center">
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 text-xs sm:text-sm bg-slate-50/80 rounded-lg pr-14 sm:pr-16 focus-visible:bg-white"
                />
                <Button
                  variant="primary"
                  size="sm"
                  className="absolute right-1 h-7 px-2.5 sm:px-3 text-xs font-semibold rounded-md"
                >
                  Tìm
                </Button>
              </div>
            </div>

            {/* 3. DESKTOP ACTIONS (>= md: 768px) */}
            <div className="hidden md:flex items-center gap-2.5 shrink-0">
              {/* Kênh Người Bán */}
              <Link href="/seller">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-semibold text-slate-700 hover:text-cta gap-1.5"
                >
                  <Store className="w-3.5 h-3.5 text-cta" />
                  <span>Kênh Người Bán</span>
                </Button>
              </Link>

              {/* Giỏ hàng */}
              <Link href="/cart">
                <Button
                  variant="outline"
                  size="sm"
                  className="relative rounded-lg border-slate-200 hover:border-primary hover:text-primary h-9 px-3 gap-2"
                >
                  <div className="relative">
                    <ShoppingCart className="w-4 h-4" />
                    <span className="absolute -top-2 -right-2 bg-cta text-white text-[9px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-xs">
                      3
                    </span>
                  </div>
                  <span className="font-semibold text-xs">Giỏ hàng</span>
                </Button>
              </Link>

              {/* Nút Đăng nhập */}
              <Button
                variant="primary"
                size="sm"
                leftIcon={<LogIn className="w-3.5 h-3.5" />}
                className="h-9 px-3.5 text-xs font-semibold rounded-lg shadow-xs"
                onClick={() => {
                  setAuthModalTab("login");
                  setIsAuthModalOpen(true);
                }}
              >
                Đăng nhập
              </Button>
            </div>

            {/* 4. MOBILE HAMBURGER BUTTON (< md: 768px) */}
            <div className="md:hidden flex items-center shrink-0">
              <button
                type="button"
                onClick={openMenu}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 5. MOBILE DRAWER PORTAL (ATTACHED DIRECTLY TO BODY TO FIX STACKING CONTEXT) */}
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
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-slate-50 border border-indigo-100/60 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-main">Chào mừng bạn!</h4>
                      <p className="text-[11px] text-muted-foreground">
                        Đăng nhập để nhận voucher 50k
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Button
                      variant="primary"
                      size="sm"
                      fullWidth
                      className="text-xs font-semibold"
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
                      className="text-xs font-semibold bg-white"
                      onClick={() => {
                        closeMenu();
                        setAuthModalTab("register");
                        setIsAuthModalOpen(true);
                      }}
                    >
                      Đăng ký
                    </Button>
                  </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Chức Năng Nổi Bật
                  </p>

                  {/* Kênh Người Bán */}
                  <Link
                    href="/seller"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl bg-orange-50/70 hover:bg-orange-100/60 text-cta border border-orange-200/80 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-cta text-white flex items-center justify-center shadow-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-bold block leading-tight">
                          Kênh Người Bán
                        </span>
                        <span className="text-[10px] text-orange-700/80">
                          Quản lý gian hàng Shop
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-cta group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  {/* Giỏ hàng */}
                  <Link
                    href="/cart"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 text-cta flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block leading-tight">Giỏ Hàng</span>
                        <span className="text-[10px] text-muted-foreground">3 sản phẩm đang chờ</span>
                      </div>
                    </div>
                    <Badge variant="cta" size="sm" className="h-5 px-2 font-bold">
                      3
                    </Badge>
                  </Link>

                  {/* Đơn mua của tôi */}
                  <Link
                    href="/user/orders"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors border border-surface-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold block leading-tight">Đơn Mua</span>
                        <span className="text-[10px] text-muted-foreground">Theo dõi hành trình đơn</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>

                  {/* Thông báo */}
                  <Link
                    href="/notifications"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Bell className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium">Thông Báo Khuyến Mãi</span>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-cta"></span>
                  </Link>

                  {/* Trợ giúp */}
                  <Link
                    href="/help"
                    onClick={closeMenu}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-main transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
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

      {/* Auth Modal */}
      <AuthModal
        key={authModalTab}
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authModalTab}
      />
    </>
  );
}
