import { useState } from "react";
import { X, MapPin, Check, Plus } from "lucide-react";

interface CheckoutAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Modal cho phép người dùng chọn hoặc thêm địa chỉ nhận hàng.
export function CheckoutAddressModal({ isOpen, onClose }: CheckoutAddressModalProps) {
  const [selectedId, setSelectedId] = useState("addr_1");

  if (!isOpen) return null;

  const mockAddresses = [
    {
      id: "addr_1",
      name: "Nguyễn Văn An",
      phone: "(+84) 987 654 321",
      address: "Tòa nhà FPT Cầu Giấy, Số 18 Ngõ 86 Phố Duy Tân, Phường Dịch Vọng Hậu, Quận Cầu Giấy, Hà Nội",
      isDefault: true,
      tag: "Văn phòng",
    },
    {
      id: "addr_2",
      name: "Nguyễn Văn An (Nhà riêng)",
      phone: "(+84) 912 345 678",
      address: "Số 45 Đường Hoàng Hoa Thám, Phường Thụy Khuê, Quận Tây Hồ, Hà Nội",
      isDefault: false,
      tag: "Nhà riêng",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-surface-border bg-white shadow-3d space-y-4 p-5 animate-in zoom-in-95 duration-200">
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <div className="flex items-center gap-2 text-main font-bold text-base">
            <MapPin className="h-5 w-5 text-cta" />
            <span>Địa Chỉ Nhận Hàng Của Tôi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Danh sách các địa chỉ đã lưu */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {mockAddresses.map((addr) => {
            const isSelected = selectedId === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => setSelectedId(addr.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary bg-primary-light/40 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-main text-sm">{addr.name}</span>
                      <span className="text-xs text-slate-600 font-semibold">{addr.phone}</span>
                      {addr.isDefault && (
                        <span className="text-[10px] font-bold text-primary bg-primary-light px-1.5 py-0.2 rounded-xs border border-indigo-200">
                          Mặc định
                        </span>
                      )}
                      <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-xs">
                        {addr.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-0.5">{addr.address}</p>
                  </div>
                  <span
                    className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Nút thêm địa chỉ mới */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-bold text-primary hover:bg-indigo-50/50 hover:border-primary transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Thêm địa chỉ mới
          </button>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end gap-2.5 border-t border-surface-border pt-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover active:scale-95 transition-all shadow-md shadow-primary/25 cursor-pointer"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
