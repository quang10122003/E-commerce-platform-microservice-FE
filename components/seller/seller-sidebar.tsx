"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  Tag,
  Settings,
  Store,
  ChevronRight,
  TrendingUp,
  X,
  PlusCircle,
  BarChart3,
  MessagesSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, Badge } from "@/components/ui";

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
    badgeColor: "bg-cta",
  },
  {
    title: "Doanh thu & Tài chính",
    href: "/seller/analytics",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Mã giảm giá của Shop",
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
    title: "Hồ sơ & Cài đặt Shop",
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
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-admin-sidebar text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        )}
      >
        <div className="p-4 space-y-5 overflow-y-auto">
          {/* Header & Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <Link
              href="/seller"
              onClick={onClose}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-cta flex items-center justify-center text-white font-black text-lg shadow-md shadow-cta/20">
                S
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight leading-none">
                  SELLER<span className="text-cta">CENTER</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider">
                  Kênh Người Bán
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Switch to Customer View */}
          <div className="px-1">
            <Link
              href="/"
              onClick={onClose}
              className="flex items-center justify-between w-full px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-700/60 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Về Trang Mua Hàng</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
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
                    "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 group",
                    isActive
                      ? "bg-cta text-white font-semibold shadow-xs"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
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
                        "text-[10px] font-bold px-2 py-0.5 rounded-full text-white",
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
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-cta flex items-center justify-center text-white font-bold text-xs shadow-xs">
              MS
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">
                TechStore Official
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[10px] text-slate-400 truncate">
                  Đang hoạt động
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

