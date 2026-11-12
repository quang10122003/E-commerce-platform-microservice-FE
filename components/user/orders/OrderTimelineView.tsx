import { Check, Circle, XCircle } from "lucide-react";
import { buildOrderTimeline } from "@/lib/utils/order.utils";
import type { UserOrder } from "@/types/user/order";
import { OrderTimeView } from "./OrderTimeView";

type OrderTimelineViewProps = {
  order: Pick<UserOrder, "status" | "createdAt" | "confirmedAt" | "shippedAt" | "deliveredAt" | "cancelledAt" | "payment">;
};

// Dòng thời gian dọc của đơn: bước đã qua có dấu tích và giờ theo trình duyệt, bước chưa tới để xám.
export function OrderTimelineView({ order }: OrderTimelineViewProps) {
  const steps = buildOrderTimeline(order);

  return (
    <ol className="relative space-y-4">
      {steps.map((step, index) => {
        const Icon = step.state === "done" ? Check : step.state === "cancelled" ? XCircle : Circle;
        return (
          <li key={step.key} className="relative flex gap-3">
            {/* Đường nối giữa các bước. */}
            {index < steps.length - 1 && (
              <span aria-hidden="true" className={`absolute left-[11px] top-6 h-[calc(100%-4px)] w-px ${step.state === "done" ? "bg-emerald-300" : "bg-slate-200"}`} />
            )}
            <span className={`relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full ${
              step.state === "done" ? "bg-emerald-500 text-white" : step.state === "cancelled" ? "bg-rose-100 text-rose-600" : "border border-slate-300 bg-white text-slate-300"
            }`}>
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className={`text-xs font-semibold sm:text-sm ${step.state === "upcoming" ? "text-slate-400" : step.state === "cancelled" ? "text-rose-700" : "text-slate-800"}`}>
                {step.label}
              </p>
              {step.time && <p className="text-[11px] text-slate-500"><OrderTimeView value={step.time} /></p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
