"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle2,
  Image as ImageIcon,
  Info,
  Layers,
  Lock,
  Plus,
  RotateCcw,
  ShieldAlert,
  Star,
  UploadCloud,
  X,
} from "lucide-react";

import { Button, Card, Input } from "@/components/ui";
import { EditProductSkeleton } from "@/components/shop/edit-product-skeleton";
import { useUpdateProduct } from "@/hooks/useUpdateProduct";
import { useGetShopProductDetailQuery } from "@/lib/redux/services/product-api";
import { formatNumberInput, getApiErrorMessage, parseNumberInput } from "@/lib/utils";
import type { ProductBrandOption, ProductCategoryOption, ShopProductDetail } from "@/types/product";
import type { ResolvedFetchField } from "@/lib/utils";

type EditProductViewProps = {
  productId: number;
  categories: ResolvedFetchField<ProductCategoryOption[]>;
  brands: ResolvedFetchField<ProductBrandOption[]>;
};

type FormState = ReturnType<typeof useUpdateProduct>;

// Đọc chi tiết từ API trước khi dựng trang chỉnh sửa để giữ đúng ID phân loại và ảnh.
export function EditProductView({ productId, categories, brands }: EditProductViewProps) {
  const { data, error, isLoading, refetch } = useGetShopProductDetailQuery(productId);
  const product = data?.success ? data.data : null;

  return (
    <div className="w-full space-y-6">
      {/* Tiêu đề trang hiển thị sản phẩm đang chỉnh sửa. */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black font-heading text-main">Chỉnh Sửa Sản Phẩm</h1>
          <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-xs font-bold text-primary">
            #{productId}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Cập nhật thông tin, thuộc tính, phân loại và ảnh sản phẩm
        </p>
      </div>

      {(categories.error || brands.error) && (
        <p role="alert" className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Không thể tải đầy đủ danh mục hoặc thương hiệu. Các giá trị hiện tại vẫn được giữ trong form.
        </p>
      )}

      {isLoading ? (
        <EditProductSkeleton />
      ) : !product ? (
        <Card
          variant="3d"
          className="flex min-h-64 flex-col items-center justify-center gap-3 p-6 text-center text-sm text-danger"
          role="alert"
        >
          <p>
            {error
              ? getApiErrorMessage(error, "Không thể tải chi tiết sản phẩm.")
              : data?.message || "Không thể tải chi tiết sản phẩm."}
          </p>
          <Button type="button" variant="outline" size="sm" onClick={() => void refetch()}>
            Thử lại
          </Button>
        </Card>
      ) : (
        <EditProductForm
          key={product.id}
          product={product}
          categories={categories.data ?? []}
          brands={brands.data ?? []}
        />
      )}
    </div>
  );
}

// Ghép các phần chỉnh sửa trên trang riêng và lưu qua PUT khi form hợp lệ.
function EditProductForm({
  product,
  categories,
  brands,
}: {
  product: ShopProductDetail;
  categories: ProductCategoryOption[];
  brands: ProductBrandOption[];
}) {
  const form = useUpdateProduct(product);

  return (
    <form onSubmit={form.submit} className="space-y-6 pb-12">
      <div className="space-y-6">
        {/* Thông tin chính và ảnh bìa được chỉnh sửa độc lập với cấu trúc phân loại. */}
        <BasicSection form={form} product={product} categories={categories} brands={brands} />
        <CoverSection form={form} />
        {/* Thuộc tính phải đứng trước bảng phân loại vì lựa chọn phụ thuộc thứ tự nhóm và giá trị. */}
        <AttributeSection form={form} />
        <VariantSection form={form} />
      </div>

      {/* Thanh thao tác cuối trang chỉ gửi PUT khi dữ liệu hợp lệ. */}
      <Card variant="3d" className="flex flex-wrap items-center justify-between gap-3 p-4">
        {form.formError && (
          <p role="alert" className="text-xs font-semibold text-danger">
            {form.formError}
          </p>
        )}
        <div className="flex gap-2">
          <Link
            href="/shop/products"
            className="inline-flex h-9 items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-main hover:bg-slate-50"
          >
            Hủy bỏ
          </Link>
          <Button
            type="submit"
            variant="gradient-cta"
            size="sm"
            isLoading={form.isSubmitting}
            leftIcon={<CheckCircle2 className="h-4 w-4" />}
            className="h-9 rounded-lg text-xs"
          >
            Lưu Thay Đổi Sản Phẩm
          </Button>
        </div>
      </Card>
    </form>
  );
}

// Hiển thị tên, danh mục, thương hiệu và mô tả đúng dữ liệu chi tiết sản phẩm.
function BasicSection({
  form,
  product,
  categories,
  brands,
}: {
  form: FormState;
  product: ShopProductDetail;
  categories: ProductCategoryOption[];
  brands: ProductBrandOption[];
}) {
  return (
    <Card variant="3d" className="space-y-4 p-5">
      <SectionTitle number={1} title="Thông Tin Cơ Bản" color="bg-primary" />
      <div className="space-y-1">
        <label htmlFor="edit-name" className="text-xs font-bold text-main">
          Tên sản phẩm *
        </label>
        <Input
          id="edit-name"
          className="text-xs"
          error={form.errors.name?.message}
          {...form.register("name", { required: "Vui lòng nhập tên sản phẩm." })}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="edit-category" className="text-xs font-bold text-main">
            Ngành hàng / Danh mục *
          </label>
          <select
            id="edit-category"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-main"
            {...form.register("categoryId", { required: true })}
          >
            {!categories.some((item) => item.id === product.categoryId) && (
              <option value={product.categoryId}>Danh mục #{product.categoryId}</option>
            )}
            {categories.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
          {form.errors.categoryId && <p className="text-xs text-danger">Vui lòng chọn danh mục.</p>}
        </div>
        <div className="space-y-1">
          <label htmlFor="edit-brand" className="text-xs font-bold text-main">Thương hiệu (Tùy chọn)</label>
          <select
            id="edit-brand"
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-main"
            {...form.register("brandId")}
          >
            <option value="">Không có thương hiệu</option>
            {product.brandId != null && !brands.some((item) => item.id === product.brandId) && (
              <option value={product.brandId}>Thương hiệu #{product.brandId}</option>
            )}
            {brands.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label htmlFor="edit-description" className="text-xs font-bold text-main">Mô tả sản phẩm</label>
        <textarea
          id="edit-description"
          rows={3}
          className="w-full resize-y rounded-lg border border-slate-200 bg-white p-3 text-xs text-main"
          {...form.register("description")}
        />
      </div>
    </Card>
  );
}

// Cho thay ảnh bìa mới hoặc quay lại ảnh hiện tại trước khi gửi form.
function CoverSection({ form }: { form: FormState }) {
  return (
    <Card variant="3d" className="space-y-4 p-5">
      <SectionTitle number={2} title="Hình Ảnh Sản Phẩm" color="bg-cta" />
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-36 w-36 shrink-0">
          <label className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => form.selectCover(event.target.files?.[0] || null)} />
            {form.coverPreview ? (
              <Image src={form.coverPreview} alt="Ảnh bìa sản phẩm" fill sizes="144px" unoptimized className="object-cover transition group-hover:scale-105" />
            ) : (
              <ImageIcon className="h-8 w-8 text-slate-400" />
            )}
            <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-slate-950/45 text-xs font-bold text-white opacity-0 transition group-hover:opacity-100">
              <UploadCloud className="h-5 w-5" />Thay ảnh bìa
            </span>
          </label>
          {form.coverFile && (
            <button type="button" onClick={() => form.selectCover(null)} title="Khôi phục ảnh gốc" className="absolute -right-2 -top-2 rounded-full bg-slate-800 p-1.5 text-white">
              <RotateCcw className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="space-y-1 text-xs text-slate-600">
          <p className="flex items-center gap-1.5 font-bold text-main"><Info className="h-4 w-4 text-primary" />Ảnh bìa sản phẩm</p>
          <p>Chỉ tải ảnh mới lên nếu bạn chọn thay ảnh bìa. Ảnh cũ được giữ nguyên khi không chọn file.</p>
        </div>
      </div>
    </Card>
  );
}

// Cho sửa thuộc tính và chỉ khóa xóa nhóm khi các phân loại sẽ trùng tổ hợp.
function AttributeSection({ form }: { form: FormState }) {
  return (
    <Card variant="3d" className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle number={3} title="Nhóm Thuộc Tính & Giá Trị" color="bg-emerald-500" />
        <Button type="button" variant="outline" size="sm" onClick={form.addAttribute} leftIcon={<Plus className="h-3 w-3" />} className="h-8 text-xs">
          Thêm thuộc tính
        </Button>
      </div>
      {form.attributes.length === 0 && (
        <p className="rounded-lg border border-dashed border-slate-300 p-4 text-xs text-slate-500">
          Sản phẩm chưa có nhóm thuộc tính.
        </p>
      )}
      {form.attributes.map((attribute, index) => {
        const removalBlocked = form.isAttributeRemovalBlocked(attribute.key);
        return (
          <div key={attribute.key} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-bold text-main">
                <Layers className="h-4 w-4 text-primary" />Nhóm {index + 1}
                {attribute.id === undefined && <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] text-emerald-700">Mới</span>}
              </span>
              <button type="button" disabled={removalBlocked} onClick={() => form.removeAttribute(attribute.key)} title={removalBlocked ? "Không thể xóa nhóm vì các phân loại sẽ trùng tổ hợp" : "Xóa nhóm thuộc tính"} className="flex items-center gap-1 text-[10px] font-medium text-rose-600 disabled:text-slate-400">
                <ShieldAlert className="h-3 w-3" />{removalBlocked ? "Trùng tổ hợp nếu xóa" : "Xóa nhóm"}
              </button>
            </div>
            <Input value={attribute.name} onChange={(event) => form.updateAttribute(attribute.key, event.target.value)} placeholder="Tên thuộc tính, ví dụ Màu sắc" className="h-9 bg-white text-xs font-semibold" aria-label={`Tên nhóm ${index + 1}`} />
            <div className="flex gap-2">
              <Input
                value={form.draftValues[attribute.key] || ""}
                onChange={(event) => form.setDraftValues((current) => ({ ...current, [attribute.key]: event.target.value }))}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    form.addValue(attribute.key);
                  }
                }}
                placeholder="Thêm giá trị mới..."
                className="h-9 bg-white text-xs"
                aria-label={`Giá trị mới của ${attribute.name || `nhóm ${index + 1}`}`}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => form.addValue(attribute.key)} className="h-9 text-xs">Thêm</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attribute.values.map((value) => {
                const inUse = form.isValueInUse(attribute.key, value.key);
                return (
                  <div key={value.key} className={`flex items-center gap-1 rounded-lg border p-1 ${inUse ? "border-slate-200 bg-white" : "border-rose-200 bg-rose-50/70"}`}>
                    <input value={value.value} onChange={(event) => form.updateValue(attribute.key, value.key, event.target.value)} aria-label={`Giá trị thuộc tính ${attribute.name}`} className="w-28 bg-transparent px-2 py-1 text-xs font-semibold text-main outline-none sm:w-36" />
                    {inUse ? (
                      <span className="inline-flex items-center gap-1 px-1 text-[10px] font-medium text-slate-500" title="Không thể xóa giá trị đang được phân loại sử dụng">
                        <Lock className="h-3 w-3" />Đang dùng
                      </span>
                    ) : (
                      <button type="button" onClick={() => form.removeValue(attribute.key, value.key)} aria-label={`Xóa giá trị ${value.value}`} title="Xóa giá trị không được phân loại sử dụng" className="inline-flex h-7 items-center gap-1 rounded-md bg-rose-100 px-2 text-[10px] font-bold text-rose-700 transition-colors hover:bg-rose-600 hover:text-white">
                        <X className="h-3 w-3" />Xóa
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="text-[10px] text-muted-foreground">Có thể xóa nhóm đang dùng nếu các phân loại vẫn có tổ hợp riêng sau khi bỏ nhóm.</p>
    </Card>
  );
}

// Giữ toàn bộ phân loại cũ, cho nhập giá/kho, tổ hợp mới và quản lý ảnh theo ID.
function VariantSection({ form }: { form: FormState }) {
  return (
    <Card variant="3d" className="space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionTitle number={4} title="Bảng Phân Loại Hàng" color="bg-indigo-600" />
        <Button type="button" variant="outline" size="sm" leftIcon={<Plus className="h-3 w-3" />} onClick={form.addVariant} disabled={form.attributes.length === 0} title={form.attributes.length === 0 ? "Thêm thuộc tính trước khi thêm phân loại" : undefined} className="h-8 text-xs">
          Thêm phân loại mới
        </Button>
      </div>
      <p className="flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-indigo-50/70 px-3 py-2 text-[11px] text-indigo-800">
        <Lock className="h-3.5 w-3.5 shrink-0" /> SKU của phân loại hiện có được giữ nguyên khi đổi tên hoặc thuộc tính; SKU chỉ được tạo cho phân loại mới.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[720px] text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase text-slate-500">
            <tr><th className="px-3 py-2.5">SKU</th><th className="px-3 py-2.5">Tổ hợp thuộc tính</th><th className="min-w-28 px-3 py-2.5">Giá bán (VNĐ)</th><th className="min-w-24 px-3 py-2.5">Tồn kho</th><th className="min-w-64 px-3 py-2.5">Ảnh phân loại</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {form.variants.map((variant) => (
              <tr key={variant.key} className="align-top hover:bg-slate-50/70">
                <td className="px-3 py-3 font-mono text-[10px] font-bold text-slate-600">
                  {variant.id !== undefined ? (
                    <span className="inline-flex items-center gap-1 whitespace-nowrap" title="SKU này được giữ nguyên trong suốt vòng đời phân loại">
                      <Lock className="h-3 w-3" />{variant.sku}
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold text-slate-600">Giữ nguyên</span>
                    </span>
                  ) : (
                    <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700" title="SKU sẽ được hệ thống tạo khi lưu phân loại mới">Tạo khi lưu</span>
                  )}
                </td>
                <td className="space-y-1 px-3 py-2">
                  {form.attributes.map((attribute) => (
                    <label key={attribute.key} className="flex items-center gap-2">
                      <span className="w-20 shrink-0 truncate text-[10px] font-semibold text-slate-500">{attribute.name || "Nhóm mới"}</span>
                      <select value={variant.selections[attribute.key] || ""} onChange={(event) => form.updateVariant(variant.key, { selections: { ...variant.selections, [attribute.key]: event.target.value } })} aria-label={`${attribute.name || "Nhóm mới"} của phân loại ${variant.sku || "mới"}`} className="min-w-24 flex-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-main">
                        <option value="">Chọn giá trị</option>
                        {attribute.values.map((value) => <option key={value.key} value={value.key}>{value.value}</option>)}
                      </select>
                    </label>
                  ))}
                  {form.attributes.length === 0 && <span className="text-[10px] text-slate-400">Không có thuộc tính</span>}
                </td>
                <td className="px-3 py-2"><Input type="text" inputMode="numeric" value={formatNumberInput(variant.price)} onChange={(event) => form.updateVariant(variant.key, { price: event.target.value ? String(parseNumberInput(event.target.value)) : "" })} aria-label={`Giá của ${variant.sku || "phân loại mới"}`} className="h-8 bg-white text-xs font-bold text-cta" /></td>
                <td className="px-3 py-2"><Input type="number" min="0" value={variant.stock} onChange={(event) => form.updateVariant(variant.key, { stock: event.target.value })} aria-label={`Tồn kho của ${variant.sku || "phân loại mới"}`} className="h-8 bg-white text-xs font-bold" /></td>
                <td className="px-3 py-2">
                  <div className="flex min-w-64 flex-wrap items-center gap-2">
                    {variant.images.map((image) => (
                      <div key={image.key} className="group relative h-28 w-28 shrink-0 overflow-hidden rounded-lg border border-slate-200">
                        <Image src={image.url} alt="Ảnh phân loại" fill sizes="112px" unoptimized className="object-cover" />
                        <span className={`absolute left-1 top-1 rounded px-1.5 py-0.5 text-[10px] font-bold text-white shadow-sm ${image.id === undefined ? "bg-emerald-600" : "bg-slate-900/80"}`}>
                          {image.id === undefined ? "Ảnh mới" : "Ảnh cũ"}
                        </span>
                        <button type="button" onClick={() => form.removeImage(variant.key, image.key)} aria-label="Bỏ ảnh phân loại" className="absolute right-0 top-0 rounded-bl bg-rose-600 p-1 text-white"><X className="h-3.5 w-3.5" /></button>
                        <button type="button" onClick={() => form.setPrimaryImage(variant.key, image.key)} aria-label="Đặt làm ảnh chính" title="Đặt làm ảnh chính" className={`absolute bottom-0 left-0 rounded-tr p-0.5 ${image.primary ? "bg-amber-400 text-white" : "bg-slate-900/70 text-white"}`}>
                          <Star className="h-3 w-3" fill={image.primary ? "currentColor" : "none"} />
                        </button>
                      </div>
                    ))}
                    <label className="flex h-28 w-28 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-primary hover:text-primary">
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => { form.addImages(variant.key, event.target.files); event.target.value = ""; }} />
                      <ImageIcon className="h-6 w-6" /><span className="text-[11px] font-bold">Thêm ảnh</span>
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Gắn số thứ tự và màu nhận diện cho từng phần của form.
function SectionTitle({ number, title, color }: { number: number; title: string; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-5 w-1.5 rounded-full ${color}`} />
      <h3 className="text-sm font-black font-heading uppercase text-main">{number}. {title}</h3>
    </div>
  );
}
