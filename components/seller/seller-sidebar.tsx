"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Settings,
  Store,
  ChevronRight,
  X,
  BarChart3,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

const sellerNavigation = [
  {
    title: "Tổng quan Shop",
    href: "/seller",
    icon: LayoutDashboard,
    badge: null,
  },
  {
    title: "Quản lý Sản phẩm",
    href: "/seller/products",
    icon: Package,
    badge: "142 sp",
  },
  {
    title: "Quản lý Đơn hàng",
    href: "/seller/orders",
    icon: ShoppingCart,
    badge: "8 mới",
    badgeColor: "bg-gradient-to-r from-orange-500 to-red-600",
  },
  {
    title: "Doanh thu & Tài chính",
    href: "/seller/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Mã giảm giá Shop",
    href: "/seller/vouchers",
    icon: Tag,
    badge: "3 mã",
    badgeColor: "bg-emerald-500",
  },
  {
    title: "Tin nhắn & Chat",
    href: "/seller/chat",
    icon: MessagesSquare,
    badge: "2",
    badgeColor: "bg-primary",
  },
  {
    title: "Hồ sơ & Cài đặt",
    href: "/seller/settings",
    icon: Settings,
    badge: null,
  },
];

interface SellerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SellerSidebar({ isOpen, onClose }: SellerSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link
              href="/seller"
              onClick={onClose}
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 via-cta to-red-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-cta/25 group-hover:scale-105 transition-transform">
                S
              </div>
              <div>
                <div className="font-black text-white text-base tracking-tight leading-none">
                  SELLER<span className="text-cta">CENTER</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider mt-0.5 block">
                  KÊNH NGƯỜI BÁN
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Switch to Customer View */}
          <div className="px-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-bold text-slate-200 border border-slate-700/60 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Về Trang Mua Hàng</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">
              Quản lý Cửa Hàng
            </p>
            {sellerNavigation.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/seller" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-gradient-to-r from-orange-500 via-cta to-red-600 text-white font-bold shadow-md shadow-cta/30"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4.5 h-4.5 transition-colors",
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-white"
                      )}
                    />
                    <span>{item.title}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-full text-white shadow-xs",
                        item.badgeColor || "bg-slate-700"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Shop Info Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-cta flex items-center justify-center text-white font-bold text-xs shadow-md shadow-cta/20">
              TS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                TechStore Official
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 truncate font-medium">
                  Đang hoạt động (Online)
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
