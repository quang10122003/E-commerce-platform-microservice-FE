import type { Dispatch, SetStateAction } from "react";
import { Layers, Plus, Trash2, X } from "lucide-react";
import { Button, Input } from "@/components/ui";
import type { CreateProductFormState } from "./create-product.types";

export function ProductAttributesFields({ productForm, tempAttrValues, setTempAttrValues, handleAddTag }: { productForm: CreateProductFormState; tempAttrValues: Record<number, string>; setTempAttrValues: Dispatch<SetStateAction<Record<number, string>>>; handleAddTag: (index: number) => void }) {
  const { attributes, addAttributeGroup, removeAttributeGroup, removeAttributeValue, updateAttributeName } = productForm;
  const { errors } = productForm.form.formState;
  return (
    <>
{/* Attribute Groups */}
            <div className="space-y-4">
              {attributes.map((attr, attrIdx) => (
                <div
                  key={attrIdx}
                  className="p-4.5 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-primary" />
                      <span className="text-xs font-bold text-main">
                        Nhóm phân loại {attrIdx + 1}
                      </span>
                    </div>

                    {attributes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAttributeGroup(attrIdx)}
                        className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Xóa nhóm
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Attribute Name Input */}
                    <div className="space-y-1 sm:col-span-1">
                      <label className="text-[11px] font-bold text-slate-600">
                        Tên nhóm phân loại
                      </label>
                      <Input
                        type="text"
                        value={attr.name}
                        onChange={(e) => updateAttributeName(attrIdx, e.target.value)}
                        placeholder="Nhập tên nhóm phân loại..."
                        error={errors.attributes?.[attrIdx]?.name?.message}
                        className="h-9.5 text-xs bg-white"
                      />
                    </div>

                    {/* Tag input for values */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[11px] font-bold text-slate-600">
                        Các giá trị phân loại
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="text"
                          value={tempAttrValues[attrIdx] || ""}
                          onChange={(e) =>
                            setTempAttrValues((prev) => ({
                              ...prev,
                              [attrIdx]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              handleAddTag(attrIdx);
                            }
                          }}
                          placeholder="Nhập giá trị rồi bấm Thêm..."
                          error={errors.attributes?.[attrIdx]?.values?.message}
                          className="h-9.5 text-xs bg-white flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(attrIdx)}
                          className="h-9.5 px-3 text-xs font-bold rounded-xl"
                        >
                          <Plus className="w-3.5 h-3.5 mr-1" /> Thêm
                        </Button>
                      </div>

                      {/* Value Tag Chips */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2">
                        {attr.values.map((val, valIdx) => (
                          <span
                            key={valIdx}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-bold text-main shadow-xs"
                          >
                            {val}
                            <button
                              type="button"
                              onClick={() => removeAttributeValue(attrIdx, valIdx)}
                              className="text-slate-400 hover:text-rose-500 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {attributes.length < 2 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addAttributeGroup}
                  leftIcon={<Plus className="w-4 h-4" />}
                  className="rounded-xl text-xs font-bold border-dashed border-slate-300 text-primary hover:bg-primary-light/40"
                >
                  Thêm nhóm phân loại 2
                </Button>
              )}
            </div>
    </>
  );
}
