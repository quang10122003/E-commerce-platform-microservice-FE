import type { ReactNode } from "react";

interface AnalyticsPanelProps {
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

// Khung chung của một khối thống kê: tiêu đề, mô tả cách tính và nội dung.
export function AnalyticsPanel({ title, description, className = "", children }: AnalyticsPanelProps) {
  return (
    <section className={`min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 ${className}`}>
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {description && <p className="mt-0.5 text-[11px] text-slate-500">{description}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

export function AnalyticsEmpty({ label = "Chưa có dữ liệu trong khoảng thời gian này" }: { label?: string }) {
  return <p className="py-8 text-center text-xs text-slate-400">{label}</p>;
}
