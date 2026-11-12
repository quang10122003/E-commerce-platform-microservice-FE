"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Số đơn đặt theo từng giờ trong ngày; nhãn chỉ ghi số giờ để đủ 24 nhãn trên màn hình hẹp; BE đã gom giờ theo offset của trình duyệt gửi lên.
export function OrdersByHourChart({ ordersByHour }: { ordersByHour: number[] }) {
  const data = ordersByHour.map((orders, hour) => ({ hour, orders }));

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#EEF2F6" vertical={false} />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} interval="equidistantPreserveStart" minTickGap={1} />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} width={24} />
          <Tooltip labelFormatter={(hour) => `${hour}:00 – ${hour}:59`} formatter={(value) => [`${value} đơn`, "Đơn đặt"]} contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
          <Bar dataKey="orders" fill="#4F46E5" radius={[3, 3, 0, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
