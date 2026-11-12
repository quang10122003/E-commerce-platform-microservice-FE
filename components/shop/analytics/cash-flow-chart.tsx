"use client";

import { Bar, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/utils";
import { ANALYTICS_MONTHLY_FROM_DAYS, formatCompactAmount, groupTimelineByMonth } from "@/lib/utils/shop-analytics.utils";
import type { AnalyticsDailyPoint } from "@/types/shop/analytics";

const SERIES = [
  { key: "receivedAmount", name: "Đã về", color: "#10B981" },
  { key: "paidOnlineAmount", name: "Thanh toán online", color: "#4F46E5" },
  { key: "cancelledAmount", name: "Đã hủy", color: "#F43F5E" },
] as const;

// bucketStart là 00:00 theo offset đã gửi lên nên đổi sang giờ trình duyệt vẫn ra đúng ngày.
const formatDay = (value: string) => new Date(value).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
// Nhãn tháng tự ghép dạng MM/yyyy vì định dạng vi-VN có sẵn ("tháng 01, 2026") quá dài cho trục.
const formatMonth = (value: string) => {
  const date = new Date(value);
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

// Dòng tiền theo ngày, hoặc theo tháng khi khoảng dài; mỗi chuỗi tính theo mốc thời gian riêng (đặt, giao xong, thanh toán, hủy).
export function CashFlowChart({ timeline }: { timeline: AnalyticsDailyPoint[] }) {
  const monthly = timeline.length >= ANALYTICS_MONTHLY_FROM_DAYS;
  const data = monthly ? groupTimelineByMonth(timeline) : timeline;
  const formatBucket = monthly ? formatMonth : formatDay;

  return (
    <div className="h-72 w-full sm:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#EEF2F6" vertical={false} />
          <XAxis dataKey="bucketStart" tickFormatter={formatBucket} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={{ stroke: "#E2E8F0" }} interval="equidistantPreserveStart" minTickGap={2} angle={-45} textAnchor="end" height={44} />
          <YAxis tickFormatter={formatCompactAmount} tick={{ fontSize: 11, fill: "#64748B" }} tickLine={false} axisLine={false} width={52} />
          <Tooltip labelFormatter={(value) => formatBucket(String(value))} formatter={(value, name) => [formatCurrency(Number(value)), name]}
            contentStyle={{ borderRadius: 8, border: "1px solid #E2E8F0", fontSize: 12 }} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="placedAmount" name="Giá trị đặt" fill="#C7D2FE" radius={[3, 3, 0, 0]} maxBarSize={28} />
          {SERIES.map((series) => (
            <Line key={series.key} type="monotone" dataKey={series.key} name={series.name} stroke={series.color} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
