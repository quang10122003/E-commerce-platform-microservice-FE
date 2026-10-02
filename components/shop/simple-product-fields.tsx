import Image from "next/image";
import { Controller } from "react-hook-form";
import { DollarSign, Package, Plus, X } from "lucide-react";
import { Input } from "@/components/ui";
import { formatNumberInput, parseNumberInput } from "@/lib/utils";
import type { CreateProductFormState } from "./create-product.types";

export function SimpleProductFields({ productForm }: { productForm: CreateProductFormState }) {
  const { form, simpleImages, simplePrimaryImageIndex, updateSimpleImages, setPrimaryProductImage, removeProductImage } = productForm;
  const { errors } = form.formState;
  const hasVariants = false;
  return (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-main flex items-center gap-1">
                Giá bán niêm yết (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="simplePrice"
                control={form.control}
                rules={{
                  required: !hasVariants ? "Giá bán là bắt buộc." : false,
                  validate: (v) =>
                    hasVariants ||
                    (Number.isFinite(v) && v > 0) ||
                    "Giá bán phải lớn hơn 0.",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="Ví dụ: 250000"
                    leftIcon={<DollarSign className="w-4 h-4 text-cta" />}
                    value={field.value ? formatNumberInput(field.value) : ""}
                    onChange={(e) => field.onChange(parseNumberInput(e.target.value))}
                    onBlur={field.onBlur}
                    error={errors.simplePrice?.message}
                    className="h-11"
                  />
                )}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-main flex items-center gap-1">
                Số lượng tồn kho <span className="text-rose-500">*</span>
              </label>
              <Controller
                name="simpleStock"
                control={form.control}
                rules={{
                  validate: (value) =>
                    hasVariants ||
                    (Number.isInteger(value) && value > 0) ||
                    "Vui lòng nhập tồn kho lớn hơn 0.",
                }}
                render={({ field }) => (
                  <Input
                    type="text"
                    inputMode="numeric"
                    min={1}
                    placeholder="Ví dụ: 100"
                    leftIcon={<Package className="w-4 h-4 text-primary" />}
                    value={field.value ? String(field.value) : ""}
                    onChange={(event) => {
                      const normalizedValue = parseNumberInput(event.target.value);
                      field.onChange(normalizedValue);
                      form.clearErrors("simpleStock");
                    }}
                    onBlur={field.onBlur}
                    error={errors.simpleStock?.message}
                    className="h-11"
                  />
                )}
              />
            </div>

            {/* Khu vực chọn nhiều ảnh cho sản phẩm đơn giản */}
            <div className="sm:col-span-2 space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-main flex items-center gap-1">
                Ảnh sản phẩm đơn giản
                <span className="text-[10px] font-normal text-muted-foreground">(có thể chọn nhiều ảnh)</span>
              </label>
              <div className="flex flex-wrap items-center gap-2.5">
                <label className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-primary">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => updateSimpleImages([...simpleImages.map((image) => image.file), ...Array.from(e.target.files || [])], simplePrimaryImageIndex)}
                    className="hidden"
                  />
                  <Plus className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Thêm ảnh</span>
                </label>
                {simpleImages.map((image, imageIndex) => (
                  <div key={image.previewUrl} className="group relative w-28 h-28 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <Image src={image.previewUrl} alt={`Ảnh sản phẩm ${imageIndex + 1}`} fill sizes="112px" unoptimized className="object-cover" />
                    {imageIndex === simplePrimaryImageIndex && (
                      <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[8px] text-center py-0.5">Ảnh chính</span>
                    )}
                    {imageIndex !== simplePrimaryImageIndex && (
                      <button
                        type="button"
                        onClick={() => setPrimaryProductImage("simple", imageIndex)}
                        className="absolute bottom-1 left-1 right-1 rounded bg-slate-900/75 text-white text-[8px] py-0.5"
                      >
                        Đặt làm chính
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeProductImage("simple", imageIndex)}
                      className="absolute top-1 right-1 p-1 rounded-md bg-rose-500 text-white hover:bg-rose-600"
                      title="Xóa ảnh"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
  );
}
