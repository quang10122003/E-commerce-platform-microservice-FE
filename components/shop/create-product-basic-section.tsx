import type { ProductBrandOption, ProductCategoryOption } from "@/types/product";
import { Card, Input } from "@/components/ui";
import type { CreateProductFormState } from "./create-product.types";

export function CreateProductBasicSection({ productForm, categories, brands }: { productForm: CreateProductFormState; categories: ProductCategoryOption[]; brands: ProductBrandOption[] }) {
  const { register, formState: { errors } } = productForm.form;
  return (
    <>
      {/* 1. SECTION: THÔNG TIN CƠ BẢN */}
      <Card variant="3d" className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-2.5 h-6 rounded-full bg-primary shadow-xs" />
          <h2 className="text-base font-black font-heading text-main uppercase tracking-tight">
            1. Thông Tin Cơ Bản
          </h2>
        </div>

        <div className="space-y-4">
          {/* Product Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-main flex items-center gap-1">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              placeholder="Nhập tên sản phẩm (Ví dụ: Tai nghe không dây Pro ANC chống ồn...)"
              {...register("name", {
                required: "Tên sản phẩm là bắt buộc.",
                minLength: {
                  value: 6,
                  message: "Tên sản phẩm phải có ít nhất 6 ký tự.",
                },
                validate: (value) =>
                  value.trim().length >= 6 ||
                  "Tên sản phẩm phải có ít nhất 6 ký tự hợp lệ.",
              })}
              error={errors.name?.message}
              className="h-11"
            />
            <p className="text-[11px] text-muted-foreground">
              Tên sản phẩm nên bao gồm: Loại sản phẩm + Thương hiệu + Model + Đặc điểm nổi bật.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-main flex items-center gap-1">
                Ngành hàng / Danh mục <span className="text-rose-500">*</span>
              </label>
              <select
                {...register("categoryId", {
                  required: "Vui lòng chọn danh mục ngành hàng.",
                  valueAsNumber: true,
                  validate: (value) =>
                    value > 0 || "Vui lòng chọn danh mục ngành hàng.",
                })}
                className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-semibold text-main focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ${
                  errors.categoryId
                    ? "border-danger bg-rose-50/20"
                    : "border-slate-200"
                }`}
              >
                <option value={0} disabled>
                  Chọn danh mục ngành hàng
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId?.message && (
                <p className="text-xs font-medium text-danger">
                  {errors.categoryId.message}
                </p>
              )}
            </div>

            {/* Brand Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-main">
                Thương hiệu (Tùy chọn)
              </label>
              <select
                {...register("brandId", {
                  setValueAs: (value) => (value === "" ? null : Number(value)),
                })}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-main focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
              >
                <option value="">Không có thương hiệu</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Product Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-main">
              Mô tả chi tiết sản phẩm
            </label>
            <textarea
              rows={4}
              placeholder="Mô tả công năng, chất liệu, hướng dẫn sử dụng và chính sách bảo hành của sản phẩm..."
              {...register("description")}
              className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs text-main focus:outline-none focus:ring-2 focus:ring-primary shadow-xs resize-y"
            />
          </div>
        </div>
      </Card>

    </>
  );
}
