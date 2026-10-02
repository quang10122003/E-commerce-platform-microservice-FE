import { useState } from "react";
import { Lock } from "lucide-react";
import { Card } from "@/components/ui";
import type { CreateProductFormState } from "./create-product.types";
import { ProductAttributesFields } from "./product-attributes-fields";
import { ProductVariantMatrix } from "./product-variant-matrix";
import { SimpleProductFields } from "./simple-product-fields";

export function ProductVariantSection({ productForm }: { productForm: CreateProductFormState }) {
  const [tempAttrValues, setTempAttrValues] = useState<Record<number, string>>({});
  const handleAddTag = (attributeIndex: number) => {
    const value = tempAttrValues[attributeIndex] || "";
    if (!value.trim()) {
      productForm.validateAttributeValue(attributeIndex);
      return;
    }

    productForm.addAttributeValue(attributeIndex, value);
    setTempAttrValues((previous) => ({ ...previous, [attributeIndex]: "" }));
  };

  return (
    <Card variant="3d" className="p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
        <div className="flex items-center gap-2.5"><div className="w-2.5 h-6 rounded-full bg-emerald-500 shadow-xs" /><h2 className="text-base font-black font-heading text-main uppercase tracking-tight">3. Giá Bán, Tồn Kho & Phân Loại Hàng</h2></div>
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
          <button type="button" onClick={() => productForm.setHasVariants(false)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${!productForm.hasVariants ? "bg-white text-main shadow-xs" : "text-slate-600 hover:text-main"}`}>Sản phẩm đơn giản</button>
          <button type="button" onClick={() => productForm.setHasVariants(true)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${productForm.hasVariants ? "bg-primary text-white shadow-xs" : "text-slate-600 hover:text-main"}`}>Sản phẩm có biến thể</button>
        </div>
      </div>
      <p className="flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-[11px] text-indigo-800">
        <Lock className="h-3.5 w-3.5 shrink-0" /> SKU được hệ thống tạo khi đăng sản phẩm và giữ nguyên đến khi phân loại bị xóa.
      </p>
      {!productForm.hasVariants ? <SimpleProductFields productForm={productForm} /> : (
        <div className="space-y-6">
          <ProductAttributesFields productForm={productForm} tempAttrValues={tempAttrValues} setTempAttrValues={setTempAttrValues} handleAddTag={handleAddTag} />
          <ProductVariantMatrix productForm={productForm} />
        </div>
      )}
    </Card>
  );
}
