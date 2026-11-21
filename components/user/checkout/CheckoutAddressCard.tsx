import { MapPin, ChevronRight } from "lucide-react";

interface CheckoutAddressCardProps {
  onChangeAddress?: () => void;
  address: string | null;
}

// Khối thông tin địa chỉ nhận hàng của khách hàng theo chuẩn giao diện thương mại điện tử.
export function CheckoutAddressCard({ onChangeAddress, address }: CheckoutAddressCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-surface-border bg-surface-card shadow-xs" aria-label="Địa chỉ nhận hàng">
      {/* Dải màu phong bì thư trang trí phong cách sàn TMĐT hiện đại */}
      <div
        className="h-1 w-full"
        style={{
          background: "repeating-linear-gradient(45deg, #4F46E5 0px, #4F46E5 16px, #ffffff 16px, #ffffff 26px, #FF5722 26px, #FF5722 42px, #ffffff 42px, #ffffff 52px)",
        }}
      />

      <div className="p-4 sm:p-5 space-y-3">
        {/* Tiêu đề mục địa chỉ */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-cta font-bold text-sm sm:text-base">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
            <span>Địa Chỉ Nhận Hàng</span>
          </div>
          <button
            type="button"
            onClick={onChangeAddress}
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer"
          >
            <span>Chỉnh sửa địa chỉ</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Hiển thị địa chỉ người mua đã xác nhận. */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {address ?? "Vui lòng nhập địa chỉ nhận hàng."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
