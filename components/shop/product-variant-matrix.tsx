import Image from "next/image";
import { Image as ImageIcon, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { formatNumberInput, parseNumberInput } from "@/lib/utils";
import type { CreateProductFormState } from "./create-product.types";

export function ProductVariantMatrix({ productForm }: { productForm: CreateProductFormState }) {
  const { variantRows, selectedVariantCount, selectAllVariants, deselectAllVariants, toggleVariantSelection, updateVariantValue, updateVariantImages, setPrimaryProductImage, removeProductImage } = productForm;
  return (
    <>
{/* 3D Variant Matrix Table */}
            {variantRows.length > 0 && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-card">
                {/* Bộ điều khiển chọn những tổ hợp cần đăng bán. */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3">
                  <div>
                    <p className="text-xs font-bold text-main">Chọn tổ hợp cần tạo</p>
                    <p className="text-[11px] text-muted-foreground">
                      Đã chọn {selectedVariantCount}/{variantRows.length} biến thể
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={selectAllVariants} className="text-xs">
                      Chọn tất cả
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={deselectAllVariants} className="text-xs">
                      Bỏ chọn tất cả
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <tr>
                        <th className="py-3 px-4 text-center">Tạo</th>
                        <th className="py-3 px-4">Biến Thể</th>
                        <th className="py-3 px-4">Giá Bán (VNĐ) *</th>
                        <th className="py-3 px-4">Kho Hàng *</th>
                        <th className="py-3 px-4 text-center">
                          Ảnh Biến Thể <span className="text-rose-500">*</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {variantRows.map((row, idx) => (
                        <tr key={row.key} className={`transition-colors ${row.selected ? "hover:bg-slate-50/60" : "bg-slate-50/80"}`}>
                          {/* Chỉ tạo và gửi những tổ hợp được đánh dấu. */}
                          <td className="py-3 px-4 text-center">
                            <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md hover:bg-indigo-50">
                              <input
                                type="checkbox"
                                checked={row.selected}
                                onChange={() => toggleVariantSelection(row.key)}
                                aria-label={`Tạo biến thể ${row.label}`}
                                className="h-4 w-4 cursor-pointer accent-primary"
                              />
                            </label>
                          </td>
                          {/* Variant Label */}
                          <td className="py-3 px-4">
                            <span className={`font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-xs border border-slate-200/60 ${row.selected ? "text-main" : "text-slate-400"}`}>
                              {row.label}
                            </span>
                          </td>

                          {/* Price Input */}
                          <td className="py-3 px-4 max-w-[160px]">
                            <Input
                              type="text"
                              inputMode="numeric"
                              disabled={!row.selected}
                              value={row.price ? formatNumberInput(row.price) : ""}
                              onChange={(e) =>
                                updateVariantValue(
                                  idx,
                                  "price",
                                  parseNumberInput(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="h-9 text-xs font-bold text-cta bg-white disabled:bg-slate-100 disabled:text-slate-400"
                            />
                          </td>

                          {/* Stock Input */}
                          <td className="py-3 px-4 max-w-[130px]">
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              disabled={!row.selected}
                              value={row.stockQuantity || ""}
                              onChange={(e) =>
                                updateVariantValue(
                                  idx,
                                  "stockQuantity",
                                  parseNumberInput(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="h-9 text-xs font-bold bg-white disabled:bg-slate-100 disabled:text-slate-400"
                            />
                          </td>

                          {/* Khu vực chọn và xem trước nhiều ảnh của biến thể */}
                          <td className="py-3 px-4 text-center">
                            {row.selected ? (
                              <div className="flex flex-wrap items-center justify-center gap-1.5 min-w-36">
                                <label className="w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-400 hover:text-primary shrink-0">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => updateVariantImages(idx, [...row.imageFiles, ...Array.from(e.target.files || [])], row.primaryImageIndex)}
                                    className="hidden"
                                  />
                                  <ImageIcon className="w-6 h-6" />
                                  <span className="text-[11px] font-bold">Thêm ảnh</span>
                                </label>
                                {row.imagePreviewUrls.map((previewUrl, imageIndex) => (
                                  <div key={previewUrl} className="group relative w-28 h-28 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                                    <Image src={previewUrl} alt={`${row.label} - ảnh ${imageIndex + 1}`} fill sizes="112px" unoptimized className="object-cover" />
                                    {imageIndex === row.primaryImageIndex ? (
                                      <span className="absolute bottom-0 inset-x-0 bg-amber-500/90 text-white text-[9px] text-center py-0.5">Ảnh chính</span>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={() => setPrimaryProductImage(idx, imageIndex)}
                                        className="absolute inset-0 z-0 bg-slate-900/75 text-white text-[9px]"
                                      >
                                        Đặt chính
                                      </button>
                                    )}
                                    <button type="button" onClick={() => removeProductImage(idx, imageIndex)} className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-rose-500/90 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100" title="Xóa ảnh">
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400">Không tạo biến thể này</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
    </>
  );
}
