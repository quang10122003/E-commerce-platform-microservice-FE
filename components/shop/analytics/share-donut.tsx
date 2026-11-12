"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

export interface ShareDonutItem {
  label: string;
  amount: number;
  orderCount: number;
  color: string;
}

// Biểu đồ tròn tỉ trọng giá trị, kèm chú giải có số đơn và phần trăm; chú giải xuống dưới khi khối hẹp (lưới nhiều cột từ tablet).
export function ShareDonut({ items }: { items: ShareDonutItem[] }) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row md:flex-col">
      <div className="h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={items} dataKey="amount" nameKey="label" innerRadius={46} outerRadius={72} paddingAngle={2} strokeWidth={0}>
              {items.map((item) => <Cell key={item.label} fill={item.color} />)}
            </Pie>
            <Tooltip formatter={(value, name) => [formatCurrency(Number(value)), name]} contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="w-full min-w-0 space-y-2">
        {items.map((item) => (
          <li key={item.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex min-w-0 items-center gap-2 font-medium text-slate-700">
              <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: item.color }} aria-hidden="true" />
              <span>{item.label}</span>
            </span>
            <span className="shrink-0 text-right">
              <span className="block font-bold text-slate-900">{formatCurrency(item.amount)}</span>
              <span className="text-[11px] text-slate-500">{item.orderCount} đơn · {total > 0 ? ((item.amount / total) * 100).toFixed(0) : 0}%</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
