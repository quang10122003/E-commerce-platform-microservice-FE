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
        <div key={voucher.code} className={`rounded-2xl p-4 bg-gradient-to-r ${voucher.color} text-white shadow-3d hover:shadow-3d-hover hover:-translate-y-1.5 transition-all flex items-center justify-between cursor-pointer group`}>
          <div className="space-y-0.5"><div className="flex items-center gap-1.5"><Ticket className="w-4 h-4 text-white/90" /><span className="font-black text-sm sm:text-base tracking-tight">{voucher.discount}</span></div><p className="text-[11px] text-white/80">{voucher.desc}</p></div>
          <button type="button" className="bg-white/20 hover:bg-white text-white hover:text-slate-900 px-3 py-1.5 rounded-xl text-xs font-black backdrop-blur-xs transition-all cursor-pointer shadow-xs">Lưu</button>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-3d">
      {perks.map(({ title, description, icon: Icon, color }) => (
        <div key={title} className="flex items-center gap-3 p-2"><div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-xs`}><Icon className="w-5 h-5" /></div><div><h4 className="text-xs sm:text-sm font-bold text-main">{title}</h4><p className="text-[11px] text-muted-foreground">{description}</p></div></div>
      ))}
    </div>
  );
}
