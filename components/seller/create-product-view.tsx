"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller } from "react-hook-form";
import {
  UploadCloud,
  X,
  Plus,
  Trash2,
  Info,
  Layers,
  Image as ImageIcon,
  DollarSign,
  Package,
  CheckCircle2,
} from "lucide-react";
import { Button, Input, Card } from "@/components/ui";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useNotification } from "@/hooks/useNotification";
import {
  formatNumberInput,
  parseNumberInput,
  type ResolvedFetchField,
} from "@/lib/utils";
import type { ProductBrandOption, ProductCategoryOption } from "@/types/product";

type CreateProductViewProps = {
  category: ResolvedFetchField<ProductCategoryOption[]>;
  brand: ResolvedFetchField<ProductBrandOption[]>;
};

// Hiển thị form tạo sản phẩm với category và brand do Server Component truyền xuống.
export function CreateProductView({ category, brand }: CreateProductViewProps) {
  const categories = category.data ?? [];
  const brands = brand.data ?? [];
  // Cờ khóa form khi gọi API khởi tạo bị lỗi.
  const hasCatalogError = Boolean(category.error || brand.error);

  const { notifyError } = useNotification();
  const notifiedCatalogErrors = useRef({ category: null as string | null, brand: null as string | null });

  // Hiển thị lỗi riêng cho category và brand khi dữ liệu từ Server Component không hợp lệ.
  useEffect(() => {
    if (category.error && notifiedCatalogErrors.current.category !== category.error) {
      notifyError(`Không thể tải category: ${category.error}`);
    }

    if (brand.error && notifiedCatalogErrors.current.brand !== brand.error) {
      notifyError(`Không thể tải brand: ${brand.error}`);
    }

    notifiedCatalogErrors.current = {
      category: category.error,
      brand: brand.error,
    };
  }, [brand.error, category.error, notifyError]);

  const {
    addAttributeGroup,
    addAttributeValue,
    attributes,
    coverImagePreview,
    form,
    handleCoverImageChange,
    hasVariants,
    isSubmitting,
    onSubmit,
    removeAttributeGroup,
    removeAttributeValue,
    setHasVariants,
    updateAttributeName,
    updateVariantImages,
    updateSimpleImages,
    removeProductImage,
    setPrimaryProductImage,
    updateVariantValue,
    validateAttributeValue,
    variantRows,
    simpleImages,
    simplePrimaryImageIndex,
  } = useCreateProduct({
    defaultCategoryId: 0,
  });

  const { register, formState: { errors } } = form;

  // State nhập giá trị phân loại tạm thời
  const [tempAttrValues, setTempAttrValues] = useState<Record<number, string>>({});

  const handleAddTag = (attrIndex: number) => {
    const val = tempAttrValues[attrIndex] || "";
    if (!val.trim()) {
      validateAttributeValue(attrIndex);
      return;
    }

    addAttributeValue(attrIndex, val);
    setTempAttrValues((prev) => ({ ...prev, [attrIndex]: "" }));
  };

  return (
    <form
      onSubmit={hasCatalogError ? (event) => event.preventDefault() : onSubmit}
      className="space-y-6 pb-24"
    >
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
                  required: "Vui lòng chọn thương hiệu.",
                  setValueAs: (v) => (v === "" ? null : Number(v)),
                  validate: (value) =>
                    (typeof value === "number" && value > 0) ||
                    "Vui lòng chọn thương hiệu.",
                })}
                className={`w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-semibold text-main focus:outline-none focus:ring-2 focus:ring-primary shadow-xs ${
                  errors.brandId
                    ? "border-danger bg-rose-50/20"
                    : "border-slate-200"
                }`}
              >
                <option value="" disabled>
                  Chọn thương hiệu
                </option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
              {errors.brandId?.message && (
                <p className="text-xs font-medium text-danger">
                  {errors.brandId.message}
                </p>
              )}
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

      {/* 4. SECTION: THIẾT LẬP GIÁ, KHO & BIẾN THỂ */}
      <Card variant="3d" className="p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-6 rounded-full bg-emerald-500 shadow-xs" />
            <h2 className="text-base font-black font-heading text-main uppercase tracking-tight">
              3. Giá Bán, Tồn Kho & Phân Loại Hàng
            </h2>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setHasVariants(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !hasVariants
                  ? "bg-white text-main shadow-xs"
                  : "text-slate-600 hover:text-main"
              }`}
            >
              Sản phẩm đơn giản
            </button>
            <button
              type="button"
              onClick={() => setHasVariants(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                hasVariants
                  ? "bg-primary text-white shadow-xs"
                  : "text-slate-600 hover:text-main"
              }`}
            >
              Sản phẩm có biến thể
            </button>
          </div>
        </div>

        {/* Chế độ 1: Sản phẩm đơn giản */}
        {!hasVariants ? (
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
                <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-500 hover:text-primary">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => updateSimpleImages([...simpleImages.map((image) => image.file), ...Array.from(e.target.files || [])], simplePrimaryImageIndex)}
                    className="hidden"
                  />
                  <Plus className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Thêm ảnh</span>
                </label>
                {simpleImages.map((image, imageIndex) => (
                  <div key={image.previewUrl} className="group relative w-20 h-20 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                    <Image src={image.previewUrl} alt={`Ảnh sản phẩm ${imageIndex + 1}`} fill sizes="80px" unoptimized className="object-cover" />
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
        ) : (
          /* Chế độ 2: Sản phẩm nhiều phân loại (Attributes & Variant Matrix) */
          <div className="space-y-6">
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

            {/* 3D Variant Matrix Table */}
            {variantRows.length > 0 && (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                      <tr>
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
                        <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                          {/* Variant Label */}
                          <td className="py-3 px-4">
                            <span className="font-bold text-main px-2.5 py-1 rounded-lg bg-slate-100 text-xs border border-slate-200/60">
                              {row.label}
                            </span>
                          </td>

                          {/* Price Input */}
                          <td className="py-3 px-4 max-w-[160px]">
                            <Input
                              type="text"
                              inputMode="numeric"
                              value={row.price ? formatNumberInput(row.price) : ""}
                              onChange={(e) =>
                                updateVariantValue(
                                  idx,
                                  "price",
                                  parseNumberInput(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="h-9 text-xs font-bold text-cta bg-white"
                            />
                          </td>

                          {/* Stock Input */}
                          <td className="py-3 px-4 max-w-[130px]">
                            <Input
                              type="number"
                              min={1}
                              step={1}
                              value={row.stockQuantity || ""}
                              onChange={(e) =>
                                updateVariantValue(
                                  idx,
                                  "stockQuantity",
                                  parseNumberInput(e.target.value)
                                )
                              }
                              placeholder="0"
                              className="h-9 text-xs font-bold bg-white"
                            />
                          </td>

                          {/* Khu vực chọn và xem trước nhiều ảnh của biến thể */}
                          <td className="py-3 px-4 text-center">
                            <div className="flex flex-wrap items-center justify-center gap-1.5 min-w-36">
                              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-300 hover:border-primary bg-slate-50 hover:bg-indigo-50/40 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors text-slate-400 hover:text-primary shrink-0">
                                <input
                                  type="file"
                                  accept="image/*"
                                  multiple
                                  onChange={(e) => updateVariantImages(idx, [...row.imageFiles, ...Array.from(e.target.files || [])], row.primaryImageIndex)}
                                  className="hidden"
                                />
                                <ImageIcon className="w-5 h-5" />
                                <span className="text-[9px] font-bold">Thêm ảnh</span>
                              </label>
                              {row.imagePreviewUrls.map((previewUrl, imageIndex) => (
                                <div key={previewUrl} className="group relative w-20 h-20 rounded-xl border border-slate-200 overflow-hidden shrink-0 shadow-xs">
                                  <Image src={previewUrl} alt={`${row.label} - ảnh ${imageIndex + 1}`} fill sizes="80px" unoptimized className="object-cover" />
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
                                  <button
                                    type="button"
                                    onClick={() => removeProductImage(idx, imageIndex)}
                                    className="absolute right-1 top-1 z-10 flex h-5 w-5 items-center justify-center rounded-md bg-rose-500/90 text-white opacity-0 transition-opacity hover:bg-rose-600 group-hover:opacity-100"
                                    title="Xóa ảnh"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* 5. STICKY FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-6 shadow-lg flex items-center justify-between rounded-t-3xl">
        <div className="text-xs text-muted-foreground hidden sm:block">
          Hãy kiểm tra kỹ thông tin giá và tồn kho trước khi bấm đăng bán.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link href="/seller/products">
            <Button type="button" variant="outline" size="md" className="rounded-xl font-bold font-heading text-xs">
              Hủy bỏ
            </Button>
          </Link>
          <Button
            type="submit"
            variant="gradient-cta"
            size="md"
            isLoading={isSubmitting}
            disabled={hasCatalogError}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="rounded-xl font-bold font-heading text-xs shadow-glow-cta px-6"
          >
            Lưu & Đăng Bán Sản Phẩm
          </Button>
        </div>
      </div>
    </form>
  );
}
