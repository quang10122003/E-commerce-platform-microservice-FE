import { Headphones, RotateCcw, ShieldCheck, Ticket, Truck } from "lucide-react";

const vouchers = [
  { code: "FREESHIP50", discount: "Giảm 50k", desc: "Đơn từ 200k", color: "from-emerald-500 to-teal-600" },
  { code: "SALE100K", discount: "Giảm 100k", desc: "Đơn từ 500k", color: "from-orange-500 to-red-600" },
  { code: "HOANXU20", discount: "Hoàn 20%", desc: "Tối đa 50k xu", color: "from-amber-500 to-orange-500" },
  { code: "TECHVIP", discount: "Giảm 250k", desc: "Đồ công nghệ", color: "from-indigo-600 to-purple-600" },
];

export function VoucherStrip() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {vouchers.map((voucher) => (
      <div key={voucher.code} className="group flex overflow-hidden rounded-lg border border-slate-200 bg-gradient-to-r from-white via-white to-orange-50/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-cta/40 hover:shadow-sm">
          <div aria-hidden="true" className={`w-1 shrink-0 bg-gradient-to-b ${voucher.color}`} />
          <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3.5 py-3">
            <div className="min-w-0 space-y-1"><div className="flex items-center gap-2"><Ticket className="h-4 w-4 shrink-0 text-cta" /><span className="text-sm font-semibold tracking-tight text-main sm:text-base">{voucher.discount}</span></div><p className="truncate text-[11px] text-muted-foreground">{voucher.desc}</p></div>
            <button type="button" className="shrink-0 rounded-md border border-cta/25 bg-white px-3 py-1.5 text-xs font-semibold text-cta transition-colors hover:border-cta hover:bg-cta hover:text-white">Lưu</button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function TrustPerks() {
  const perks = [
    { title: "100% Chính Hãng", description: "Cam kết hoàn tiền gấp đôi", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600" },
    { title: "Giao Hàng Siêu Tốc", description: "Nhận hàng trong 2 giờ", icon: Truck, color: "bg-cyan-50 text-cyan-600" },
    { title: "Đổi Trả 15 Ngày", description: "Thủ tục đơn giản nhanh gọn", icon: RotateCcw, color: "bg-amber-50 text-amber-600" },
    { title: "Hỗ Trợ 24/7", description: "Tận tình & chu đáo", icon: Headphones, color: "bg-purple-50 text-purple-600" },
  ];

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-5 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-4 sm:p-5">
      {perks.map(({ title, description, icon: Icon, color }) => (
        <div key={title} className="flex items-center gap-3"><div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md ${color}`}><Icon className="h-5 w-5" /></div><div className="min-w-0"><h4 className="text-xs font-semibold text-main sm:text-sm">{title}</h4><p className="text-[11px] leading-relaxed text-muted-foreground">{description}</p></div></div>
      ))}
    </div>
  );
}
