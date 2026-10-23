import { MapPin, ChevronRight, Check } from "lucide-react";

interface CheckoutAddressCardProps {
  onChangeAddress?: () => void;
}

// Khối thông tin địa chỉ nhận hàng của khách hàng theo chuẩn giao diện thương mại điện tử.
export function CheckoutAddressCard({ onChangeAddress }: CheckoutAddressCardProps) {
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
            <span>Thay đổi</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Chi tiết người nhận và địa chỉ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-main text-sm sm:text-base">Nguyễn Văn An</span>
              <span className="font-semibold text-slate-700 text-sm">(+84) 987 654 321</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary-light px-2 py-0.5 rounded-sm border border-indigo-200">
                <Check className="h-3 w-3" /> Mặc định
              </span>
              <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-sm border border-slate-200">
                Văn phòng
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Tòa nhà FPT Cầu Giấy, Số 18 Ngõ 86 Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
