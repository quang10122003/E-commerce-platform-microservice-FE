import Image from "next/image";
import { Info, UploadCloud, X } from "lucide-react";
import { Card } from "@/components/ui";

export function CreateProductImageSection({ preview, onChange }: { preview: string | null; onChange: (file: File | null) => void }) {
  const coverImagePreview = preview;
  const handleCoverImageChange = onChange;
  return (
    <>
      {/* 3. SECTION: QUẢN LÝ HÌNH ẢNH */}
      <Card variant="3d" className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-2.5 h-6 rounded-full bg-cta shadow-xs" />
          <h2 className="text-base font-black font-heading text-main uppercase tracking-tight">
            2. Hình Ảnh Sản Phẩm
          </h2>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-main flex items-center gap-1">
            Ảnh bìa đại diện sản phẩm <span className="text-rose-500">*</span>
          </label>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            {/* Khu vực chọn, thay thế và xóa ảnh bìa */}
            <div className="relative w-40 h-40 shrink-0">
              <label className="group relative flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-3 text-center shadow-xs transition-all duration-200 hover:border-primary hover:bg-indigo-50/40">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleCoverImageChange(file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                {coverImagePreview ? (
                  <>
                    <Image
                      src={coverImagePreview}
                      alt="Ảnh bìa xem trước"
                      fill
                      sizes="160px"
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-2 bottom-2 rounded-md bg-slate-900/75 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-xs">
                      Nhấn để thay ảnh
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-500 shadow-xs transition-all group-hover:scale-110 group-hover:text-primary">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-primary">
                      Tải ảnh bìa lên
                    </span>
                    <span className="text-[9px] text-muted-foreground">Khuyên dùng tỷ lệ 1:1</span>
                  </>
                )}
              </label>
              {coverImagePreview && (
                <button
                  type="button"
                  onClick={() => handleCoverImageChange(null)}
                  className="absolute right-2 top-2 z-10 rounded-lg bg-rose-500 p-1.5 text-white shadow-xs transition-colors hover:bg-rose-600"
                  title="Xóa ảnh"
                  aria-label="Xóa ảnh bìa"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Instructions */}
            <div className="text-xs text-muted-foreground space-y-1.5 max-w-md pt-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <Info className="w-4 h-4 text-primary" /> Tiêu chuẩn hình ảnh sản phẩm:
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
                <li>Ảnh rõ nét, độ phân giải tối thiểu 500x500 px.</li>
                <li>Nền ảnh sạch sẽ, thể hiện rõ sản phẩm thực tế.</li>
                <li>Định dạng hỗ trợ: JPG, PNG, WEBP dung lượng &lt; 5MB.</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

    </>
  );
}
