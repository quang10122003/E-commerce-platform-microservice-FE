"use client";

import { AlertCircle, CheckCircle2, Clock, Package, Truck, XCircle } from "lucide-react";

interface OrdersOverviewStatsProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  dataAvailable: boolean;
  counts: {
    all: number;
    pendingConfirmation: number;
    pendingPickup: number;
    shipping: number;
    done: number;
    cancel: number;
  };
}

export function OrdersOverviewStats({
  currentTab,
  onTabChange,
  counts,
  dataAvailable,
}: OrdersOverviewStatsProps) {
  const cards = [
    {
      id: "PENDING_CONFIRMATION",
      title: "Chờ xác nhận",
      subtitle: "Cần duyệt gửi kho",
      count: counts.pendingConfirmation,
      icon: Clock,
      color: "text-amber-600",
      bgHover: "hover:border-amber-400 hover:bg-amber-50/40",
      activeBg: "border-amber-400 bg-amber-50/50 shadow-xs",
      urgent: dataAvailable && counts.pendingConfirmation > 0,
    },
    {
      id: "PENDING_PICKUP",
      title: "Chờ lấy hàng",
      subtitle: "Đang đóng gói & in bill",
      count: counts.pendingPickup,
      icon: Package,
      color: "text-indigo-600",
      bgHover: "hover:border-indigo-400 hover:bg-indigo-50/40",
      activeBg: "border-indigo-400 bg-indigo-50/50 shadow-xs",
      urgent: false,
    },
    {
      id: "SHIPPING",
      title: "Đang vận chuyển",
      subtitle: "Bên ĐVVC đang giao",
      count: counts.shipping,
      icon: Truck,
      color: "text-blue-600",
      bgHover: "hover:border-blue-400 hover:bg-blue-50/40",
      activeBg: "border-blue-400 bg-blue-50/50 shadow-xs",
      urgent: false,
    },
    {
      id: "DONE",
      title: "Giao thành công",
      subtitle: "Khách đã nhận hàng",
      count: counts.done,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bgHover: "hover:border-emerald-400 hover:bg-emerald-50/40",
      activeBg: "border-emerald-400 bg-emerald-50/50 shadow-xs",
      urgent: false,
    },
    {
      id: "CANCEL",
      title: "Đơn đã hủy",
      subtitle: "Khách hoặc shop hủy",
      count: counts.cancel,
      icon: XCircle,
      color: "text-rose-600",
      bgHover: "hover:border-rose-400 hover:bg-rose-50/40",
      activeBg: "border-rose-400 bg-rose-50/50 shadow-xs",
      urgent: false,
    },
  ];

  return (
    <section aria-label="Thống kê tổng quan đơn hàng" className="grid grid-cols-2 gap-3 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        const isActive = currentTab === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onTabChange(isActive ? "ALL" : card.id)}
            className={`group flex flex-col justify-between rounded-xl border bg-white p-3.5 text-left transition-all duration-200 sm:p-4 ${
              isActive ? card.activeBg : `border-slate-200/90 ${card.bgHover}`
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                {card.title}
              </span>
              <span className={`rounded-lg p-1.5 ${card.color} bg-slate-50 transition-colors group-hover:bg-white`}>
                <Icon className="h-4 w-4" />
              </span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
                {dataAvailable ? card.count : "—"}
              </span>
              {card.urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800 animate-pulse">
                  <AlertCircle className="h-3 w-3" /> Cần xử lý
                </span>
              )}
            </div>

            <span className="mt-1 text-[11px] font-medium text-slate-500">
              {card.subtitle}
            </span>
          </button>
        );
      })}
    </section>
  );
}
