"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui";
import { useCreateProduct } from "@/hooks/useCreateProduct";
import { useNotification } from "@/hooks/useNotification";
import type { ResolvedFetchField } from "@/lib/utils";
import type { ProductBrandOption, ProductCategoryOption } from "@/types/product";
import { CreateProductBasicSection } from "./create-product-basic-section";
import { CreateProductImageSection } from "./create-product-image-section";
import { ProductVariantSection } from "./product-variant-section";

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

  const productForm = useCreateProduct({ defaultCategoryId: 0 });

  return (
    <form
      onSubmit={hasCatalogError ? (event) => event.preventDefault() : productForm.onSubmit}
      className="space-y-6 pb-24"
    >
      <CreateProductBasicSection productForm={productForm} categories={categories} brands={brands} />
      <CreateProductImageSection preview={productForm.coverImagePreview} onChange={productForm.handleCoverImageChange} />
      <ProductVariantSection productForm={productForm} />

      {/* 5. STICKY FOOTER ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 lg:left-64 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200/80 py-3.5 px-6 shadow-lg flex items-center justify-between rounded-t-3xl">
        <div className="text-xs text-muted-foreground hidden sm:block">
          Hãy kiểm tra kỹ thông tin giá và tồn kho trước khi bấm đăng bán.
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Link href="/shop/products">
            <Button type="button" variant="outline" size="md" className="rounded-xl font-bold font-heading text-xs">
              Hủy bỏ
            </Button>
          </Link>
          <Button
            type="submit"
            variant="gradient-cta"
            size="md"
            isLoading={productForm.isSubmitting}
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
