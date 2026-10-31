import Image from "next/image";
import { Store, ShieldCheck, MessageSquare } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

// Danh sách các shop và sản phẩm mock hiển thị trong trang thanh toán.
const MOCK_CHECKOUT_SHOPS = [
  {
    shopId: 101,
    shopName: "Apple Authorised Reseller",
    isMall: true,
    items: [
      {
        id: 1,
        name: "Tai nghe không dây AirPods Pro 2 MagSafe USB-C (Chính Hãng VN/A)",
        variant: "Màu Trắng · Cổng Type-C",
        price: 5690000,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: 2,
        name: "Củ sạc nhanh 20W Type-C Power Adapter hỗ trợ sạc nhanh iPhone",
        variant: "Trắng · Chân dẹt US/VN",
        price: 490000,
        quantity: 1,
        imageUrl: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    shopId: 102,
    shopName: "Anker Việt Nam Official",
    isMall: true,
    items: [
      {
        id: 3,
        name: "Cáp sạc Anker PowerLine III Flow USB-C to Lightning Silicon Siêu Bền",
        variant: "Xanh Mint · Dài 0.9m",
        price: 290000,
        quantity: 2,
        imageUrl: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
];

// Hiển thị danh sách sản phẩm cần thanh toán phân theo từng gian hàng.
export function CheckoutItemsGroup() {
  return (
    <div className="space-y-4" aria-label="Danh sách kiện hàng">
      {MOCK_CHECKOUT_SHOPS.map((shop) => (
        <section
          key={shop.shopId}
          className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-xs"
        >
          {/* Header thông tin Shop */}
          <div className="flex items-center justify-between border-b border-surface-border bg-slate-50/80 px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Store className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-white bg-gradient-to-r from-red-600 to-rose-600 px-1.5 py-0.5 rounded-xs tracking-wide">
                Mall
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-main">{shop.shopName}</h2>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
              <ShieldCheck className="h-3 w-3" /> Đảm bảo chính hãng
            </span>
          </div>

          {/* Danh sách từng mặt hàng trong Shop */}
          <div className="divide-y divide-surface-border">
            {shop.items.map((item) => (
              <div key={item.id} className="grid grid-cols-[auto_1fr] sm:grid-cols-[auto_1fr_auto] items-center gap-3 p-4 sm:p-5">
                <div className="relative h-18 w-18 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-lg border border-surface-border bg-slate-50">
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-main hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="inline-block rounded-xs bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                    Phân loại: {item.variant}
                  </p>
                  <div className="flex items-center gap-3 text-xs sm:hidden pt-0.5">
                    <span className="text-muted-foreground">x{item.quantity}</span>
                    <span className="font-bold text-cta">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                </div>
                <div className="hidden sm:block text-right space-y-0.5 pl-4">
                  <p className="text-xs text-muted-foreground">Đơn giá: {formatCurrency(item.price)}</p>
                  <p className="text-xs text-slate-500 font-medium">Số lượng: x{item.quantity}</p>
                  <p className="text-sm font-bold text-cta">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Khu vực ghi chú đơn hàng */}
          <div className="border-t border-surface-border bg-slate-50/60 p-4 sm:p-5 space-y-3">
            {/* Ô nhập lời nhắn cho người bán */}
            <div className="flex items-center gap-2 rounded-lg border border-surface-border bg-white px-3 py-2">
              <MessageSquare className="h-4 w-4 shrink-0 text-slate-400" />
              <input
                type="text"
                placeholder="Lời nhắn cho người bán (ví dụ: giao giờ hành chính, đóng gói cẩn thận...)"
                className="w-full bg-transparent text-xs text-main placeholder:text-placeholder outline-none"
              />
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
