import React from "react";
import { Zap, Sparkles, Truck, ShieldCheck, Gift, Tag } from "lucide-react";

interface SlideData {
  id: number;
  tag: string;
  tagIcon: React.ReactNode;
  tagColor: string;
  title: string;
  highlight: string;
  titleFont?: string;
  highlightFont?: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  ctaVariant: "gradient-cta" | "gradient-primary" | "perk";
  bgGradient: string;
  imageUrl: string;
  perks: { icon: React.ReactNode; text: string }[];
}

const slides: SlideData[] = [
  {
    id: 1,
    tag: "Siêu Hội Công Nghệ 2026",
    tagIcon: <Sparkles className="w-3.5 h-3.5 text-amber-300" />,
    tagColor: "bg-white/20 text-white border-white/30",
    title: "Thiết Bị Thông Minh",
    highlight: "GIẢM ĐẾN 50%",
    titleFont: "font-display font-extrabold tracking-tight",
    highlightFont: "font-display font-black tracking-normal",
    description:
      "Ưu đãi độc quyền hôm nay: Tặng voucher 200k cho đơn từ 1 triệu + Miễn phí vận chuyển toàn quốc.",
    ctaText: "Săn Deal Ngay",
    ctaLink: "/flash-sale",
    ctaVariant: "gradient-cta",
    bgGradient: "from-primary via-indigo-700 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "100% Chính Hãng" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Giao Nhanh 2H" },
    ],
  },
  {
    id: 2,
    tag: "Đại Tiệc Mua Sắm",
    tagIcon: <Gift className="w-3.5 h-3.5 text-yellow-300" />,
    tagColor: "bg-orange-400/20 text-orange-100 border-orange-300/30",
    title: "Voucher Hoàn Xu 20%",
    highlight: "FREESHIP EXTRA 0Đ",
    titleFont: "font-display font-extrabold tracking-tight",
    highlightFont: "font-display font-black tracking-normal",
    description:
      "Hàng triệu mã giảm giá hấp dẫn đang chờ bạn. Áp dụng đồng thời nhiều voucher khi thanh toán.",
    ctaText: "Thu Thập Mã Ngay",
    ctaLink: "/vouchers",
    ctaVariant: "gradient-cta",
    bgGradient: "from-orange-600 via-rose-600 to-purple-900",
    imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <Tag className="w-4 h-4 text-amber-300" />, text: "Giảm Đến 500k" },
      { icon: <Zap className="w-4 h-4 text-yellow-300" />, text: "Áp Dụng Toàn Sàn" },
    ],
  },
  {
    id: 3,
    tag: "Xu Hướng Thời Trang Mới",
    tagIcon: <Sparkles className="w-3.5 h-3.5 text-emerald-300" />,
    tagColor: "bg-emerald-400/20 text-emerald-100 border-emerald-300/30",
    title: "Bộ Sưu Tập Lifestyle",
    highlight: "ĐỒNG GIÁ TỪ 99K",
    titleFont: "font-serif italic font-bold tracking-normal",
    highlightFont: "font-display font-black not-italic tracking-normal",
    description:
      "Cập nhật phong cách thời thượng với hàng ngàn mẫu áo quần, giày sneaker năng động xu hướng mới.",
    ctaText: "Khám Phá BST",
    ctaLink: "/fashion",
    ctaVariant: "gradient-primary",
    bgGradient: "from-emerald-700 via-teal-800 to-slate-900",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80",
    perks: [
      { icon: <ShieldCheck className="w-4 h-4 text-emerald-300" />, text: "Đổi Trả 15 Ngày" },
      { icon: <Truck className="w-4 h-4 text-cyan-300" />, text: "Freeship Đơn 99k" },
    ],
  },
];

export { slides };
