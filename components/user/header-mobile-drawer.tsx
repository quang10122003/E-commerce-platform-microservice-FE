import { createPortal } from "react-dom";
import Link from "next/link";
import { LogOut, ShieldCheck, Store, User, X } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AuthTab } from "@/hooks/useAuthModal";
import type { AuthenticatedUser } from "@/types/auth";
import { HeaderMobileNavigation } from "./header-mobile-navigation";

type HeaderMobileDrawerProps = { mounted: boolean; isMobileMenuOpen: boolean; isAuthChecking: boolean; isLogoutLoading: boolean; canAccessSellerChannel: boolean; user: AuthenticatedUser | null; closeMenu: () => void; setAuthModalTab: (tab: AuthTab) => void; setIsAuthModalOpen: (open: boolean) => void; handleLogout: () => Promise<void>; };

export function HeaderMobileDrawer({ mounted, isMobileMenuOpen, isAuthChecking, isLogoutLoading, canAccessSellerChannel, user, closeMenu, setAuthModalTab, setIsAuthModalOpen, handleLogout }: HeaderMobileDrawerProps) {
  return (
    <>
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
                    {isAuthChecking ? (
                      <div className="skeleton-shimmer h-10 w-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-indigo-700 text-white flex items-center justify-center shadow-md shadow-primary/20">
                        <User className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      {isAuthChecking ? (
                        <div className="space-y-2">
                          <div className="skeleton-shimmer h-3 w-36 rounded-full" />
                          <div className="skeleton-shimmer h-2.5 w-28 rounded-full" />
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-sm text-main">
                            {user ? user.fullName ?? "Xin chào bạn!" : "Chào mừng bạn!"}
                          </h4>
                          <p className="text-[11px] text-muted-foreground">
                            {user ? user.email : "Đăng nhập nhận voucher 50.000đ"}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  {!user && !isAuthChecking && (
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
                  {user && !isAuthChecking && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {canAccessSellerChannel && (
                        <Link href="/shop" onClick={closeMenu} className="flex items-center justify-center gap-1.5 rounded-xl bg-cta px-3 py-2 text-xs font-bold text-white">
                          <Store className="w-3.5 h-3.5" /> Người bán
                        </Link>
                      )}
                      <button type="button" onClick={handleLogout} disabled={isLogoutLoading} className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-red-600 disabled:cursor-not-allowed disabled:opacity-60">
                        <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                      </button>
                    </div>
                  )}
                </div>

                <HeaderMobileNavigation closeMenu={closeMenu} />
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

    </>
  );
}
