import type { ProductAttributeRequest } from "@/types/shop/product";
import type { useCreateProduct } from "@/hooks/shop/products/useCreateProduct";

// Dữ liệu form thông tin cơ bản
export interface ProductBasicFormData {
  name: string;
  categoryId: number;
  brandId?: number | null;
  description: string;
  simplePrice: number;
  simpleStock: number;
  attributes: ProductAttributeRequest[];
}

// Chi tiết 1 hàng biến thể trong ma trận giao diện
export interface UIProductVariantRow {
  key: string;
  label: string;
  selected: boolean;
  price: number;
  stockQuantity: number;
  attributeSelections: { attributeIndex: number; valueIndex: number }[];
  imageFiles: File[];
  imagePreviewUrls: string[];
  primaryImageIndex: number;
}

// Thông tin file và URL xem trước của một ảnh sản phẩm.
export interface ProductImageSelection {
  file: File;
  previewUrl: string;
}

// Tham số khởi tạo form tạo sản phẩm.
export interface UseCreateProductOptions {
  defaultCategoryId: number;
}

// Kiểu dữ liệu hook truyền cho các khu vực của form tạo sản phẩm.
export type CreateProductFormState = ReturnType<typeof useCreateProduct>;
