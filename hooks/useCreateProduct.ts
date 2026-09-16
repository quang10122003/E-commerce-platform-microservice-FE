"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useCreateProductMutation } from "@/lib/redux/services/product-api";
import { getApiErrorMessage } from "@/lib/utils";
import { useNotification } from "@/hooks/useNotification";
import type {
  CreateProductRequest,
  ProductAttributeRequest,
  ProductCategoryOption,
  ProductBrandOption,
  VariantImageMeta,
} from "@/types/product";

// Danh mục ngành hàng mẫu chuẩn sàn TMĐT
export const SAMPLE_CATEGORIES: ProductCategoryOption[] = [
  { id: 1, name: "Thiết Bị Điện Tử & Công Nghệ", icon: "Smartphone" },
  { id: 2, name: "Thời Trang & Phụ Kiện Nam Nữ", icon: "Shirt" },
  { id: 3, name: "Nhà Cửa & Đời Sống", icon: "Home" },
  { id: 4, name: "Sức Khỏe & Sắc Đẹp", icon: "HeartPulse" },
  { id: 5, name: "Thể Thao & Du Lịch", icon: "Footprints" },
  { id: 6, name: "Mẹ & Bé", icon: "ShoppingBag" },
  { id: 7, name: "Ô Tô & Xe Máy", icon: "Car" },
  { id: 8, name: "Sách & Văn Phòng Phẩm", icon: "BookOpen" },
];

// Danh sách thương hiệu mẫu
export const SAMPLE_BRANDS: ProductBrandOption[] = [
  { id: 1, name: "Apple" },
  { id: 2, name: "Samsung" },
  { id: 3, name: "Sony" },
  { id: 4, name: "Xiaomi" },
  { id: 5, name: "Logitech" },
  { id: 6, name: "Baseus" },
  { id: 7, name: "Anker" },
  { id: 8, name: "No Brand (Khác)" },
];

// Dữ liệu form thông tin cơ bản
export interface ProductBasicFormData {
  name: string;
  categoryId: number;
  brandId?: number | null;
  description: string;
  simplePrice: number;
  simpleStock: number;
}

// Chi tiết 1 hàng biến thể trong ma trận giao diện
export interface UIProductVariantRow {
  key: string;
  label: string;
  price: number;
  stockQuantity: number;
  attributeSelections: { attributeIndex: number; valueIndex: number }[];
  imageFile: File | null;
  imagePreviewUrl: string | null;
}

// Hook quản lý form tạo sản phẩm, sinh biến thể và đóng gói multipart gửi lên backend.
export function useCreateProduct() {
  const router = useRouter();
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const { notifyError, notifySuccess, notifyWarning } = useNotification();

  // Khởi tạo form cơ bản với react-hook-form
  const form = useForm<ProductBasicFormData>({
    defaultValues: {
      name: "",
      categoryId: 1,
      brandId: null,
      description: "",
      simplePrice: 0,
      simpleStock: 0,
    },
  });

  // State ảnh bìa sản phẩm chính
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Chế độ sản phẩm có biến thể hay sản phẩm đơn giản
  const [hasVariants, setHasVariants] = useState<boolean>(false);

  // Danh sách thuộc tính phân loại (tối đa 2 thuộc tính: vd Màu sắc, Size)
  const [attributes, setAttributes] = useState<ProductAttributeRequest[]>([
    { name: "Màu sắc", values: ["Đen", "Trắng"] },
  ]);

  // Lưu thông tin tùy biến (giá, kho, ảnh) của từng biến thể theo key
  const [variantOverrides, setVariantOverrides] = useState<
    Record<
      string,
      {
        price: number;
        stockQuantity: number;
        imageFile: File | null;
        imagePreviewUrl: string | null;
      }
    >
  >({});

  // Cập nhật preview khi chọn ảnh bìa
  const handleCoverImageChange = useCallback((file: File | null) => {
    setCoverImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setCoverImagePreview(url);
    } else {
      setCoverImagePreview(null);
    }
  }, []);

  // Tự động sinh ma trận biến thể bằng useMemo mà không cần gọi setState trong effect
  const variantRows = useMemo<UIProductVariantRow[]>(() => {
    if (!hasVariants) {
      return [];
    }

    const validAttributes = attributes.filter(
      (attr) => attr.name.trim() && attr.values.length > 0
    );

    if (validAttributes.length === 0) {
      return [];
    }

    // Tạo tích Descartes cho các thuộc tính
    const generateCombinations = (
      attrIdx: number,
      currentCombo: { attrIdx: number; valIdx: number; valName: string }[]
    ): { attrIdx: number; valIdx: number; valName: string }[][] => {
      if (attrIdx >= validAttributes.length) {
        return [currentCombo];
      }

      const currentAttr = validAttributes[attrIdx];
      const results: { attrIdx: number; valIdx: number; valName: string }[][] = [];

      currentAttr.values.forEach((val, valIdx) => {
        const nextCombo = [
          ...currentCombo,
          { attrIdx, valIdx, valName: val },
        ];
        results.push(...generateCombinations(attrIdx + 1, nextCombo));
      });

      return results;
    };

    const combinations = generateCombinations(0, []);

    return combinations.map((combo) => {
      const key = combo.map((c) => `${c.attrIdx}_${c.valIdx}`).join("-");
      const label = combo.map((c) => c.valName).join(" - ");
      const override = variantOverrides[key];

      return {
        key,
        label,
        price: override ? override.price : 0,
        stockQuantity: override ? override.stockQuantity : 0,
        attributeSelections: combo.map((c) => ({
          attributeIndex: c.attrIdx,
          valueIndex: c.valIdx,
        })),
        imageFile: override ? override.imageFile : null,
        imagePreviewUrl: override ? override.imagePreviewUrl : null,
      };
    });
  }, [hasVariants, attributes, variantOverrides]);

  // Thêm nhóm thuộc tính mới
  const addAttributeGroup = useCallback(() => {
    if (attributes.length >= 2) {
      notifyWarning("Hệ thống hỗ trợ tối đa 2 nhóm thuộc tính phân loại.");
      return;
    }
    setAttributes((prev) => [...prev, { name: "Kích thước", values: ["S", "M", "L"] }]);
  }, [attributes.length, notifyWarning]);

  // Xóa nhóm thuộc tính
  const removeAttributeGroup = useCallback((index: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== index));
  }, [notifyWarning]);

  // Cập nhật tên nhóm thuộc tính
  const updateAttributeName = useCallback((index: number, name: string) => {
    setAttributes((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], name };
      return clone;
    });
  }, []);

  // Thêm giá trị cho nhóm thuộc tính (ví dụ: thêm màu mới)
  const addAttributeValue = useCallback((attrIndex: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    setAttributes((prev) => {
      const clone = [...prev];
      if (clone[attrIndex].values.includes(trimmed)) {
        notifyWarning("Giá trị phân loại này đã tồn tại.");
        return prev;
      }
      clone[attrIndex] = {
        ...clone[attrIndex],
        values: [...clone[attrIndex].values, trimmed],
      };
      return clone;
    });
  }, []);

  // Xóa giá trị của nhóm thuộc tính
  const removeAttributeValue = useCallback((attrIndex: number, valIndex: number) => {
    setAttributes((prev) => {
      const clone = [...prev];
      clone[attrIndex] = {
        ...clone[attrIndex],
        values: clone[attrIndex].values.filter((_, i) => i !== valIndex),
      };
      return clone;
    });
  }, []);

  // Cập nhật giá/tồn kho cho từng biến thể
  const updateVariantValue = useCallback(
    (index: number, field: "price" | "stockQuantity", value: number) => {
      const targetRow = variantRows[index];
      if (!targetRow) return;

      setVariantOverrides((prev) => ({
        ...prev,
        [targetRow.key]: {
          price: field === "price" ? Math.max(0, value) : prev[targetRow.key]?.price || 0,
          stockQuantity:
            field === "stockQuantity"
              ? Math.max(0, value)
              : prev[targetRow.key]?.stockQuantity || 0,
          imageFile: prev[targetRow.key]?.imageFile || null,
          imagePreviewUrl: prev[targetRow.key]?.imagePreviewUrl || null,
        },
      }));
    },
    [notifySuccess, variantRows]
  );

  // Cập nhật file ảnh riêng cho biến thể
  const updateVariantImage = useCallback(
    (index: number, file: File | null) => {
      const targetRow = variantRows[index];
      if (!targetRow) return;

      const previewUrl = file ? URL.createObjectURL(file) : null;
      setVariantOverrides((prev) => ({
        ...prev,
        [targetRow.key]: {
          price: prev[targetRow.key]?.price || 0,
          stockQuantity: prev[targetRow.key]?.stockQuantity || 0,
          imageFile: file,
          imagePreviewUrl: previewUrl,
        },
      }));
    },
    [variantRows]
  );

  // Áp dụng giá và tồn kho hàng loạt cho tất cả các biến thể
  const batchApply = useCallback(
    (price?: number, stock?: number) => {
      setVariantOverrides((prev) => {
        const next = { ...prev };
        variantRows.forEach((row) => {
          next[row.key] = {
            price:
              price !== undefined && !isNaN(price) && price >= 0
                ? price
                : prev[row.key]?.price || 0,
            stockQuantity:
              stock !== undefined && !isNaN(stock) && stock >= 0
                ? stock
                : prev[row.key]?.stockQuantity || 0,
            imageFile: prev[row.key]?.imageFile || null,
            imagePreviewUrl: prev[row.key]?.imagePreviewUrl || null,
          };
        });
        return next;
      });
      notifySuccess("Đã áp dụng giá và tồn kho cho toàn bộ biến thể!");
    },
    [variantRows]
  );

  // Xử lý gửi form và đóng gói Multipart/form-data
  const onSubmit = form.handleSubmit(async (data) => {
    // 1. Kiểm tra ảnh bìa
    if (!coverImageFile) {
      notifyError("Vui lòng tải lên ảnh bìa sản phẩm chính.");
      return;
    }

    // 2. Chuẩn bị danh sách variants
    let finalAttributes: ProductAttributeRequest[] = [];
    let finalVariants: CreateProductRequest["variants"] = [];
    const variantFilesToUpload: File[] = [];
    const variantMetaToUpload: VariantImageMeta[] = [];

    if (hasVariants) {
      if (variantRows.length === 0) {
        notifyError("Vui lòng nhập ít nhất 1 thuộc tính và giá trị phân loại.");
        return;
      }

      // Kiểm tra xem có biến thể nào có giá <= 0 không
      const hasInvalidPrice = variantRows.some((v) => v.price <= 0);
      if (hasInvalidPrice) {
        notifyError("Vui lòng nhập giá bán lớn hơn 0 cho tất cả biến thể.");
        return;
      }

      finalAttributes = attributes.filter(
        (a) => a.name.trim() && a.values.length > 0
      );

      finalVariants = variantRows.map((row, variantIdx) => {
        const images: { primary: boolean }[] = [];

        // Nếu biến thể có file ảnh, thêm vào danh sách upload và gán metadata
        if (row.imageFile) {
          variantFilesToUpload.push(row.imageFile);
          variantMetaToUpload.push({
            variantIndex: variantIdx,
            imageIndex: images.length,
          });
          images.push({ primary: true });
        }

        return {
          price: row.price,
          stockQuantity: row.stockQuantity,
          attributeSelections: row.attributeSelections,
          images,
        };
      });
    } else {
      // Sản phẩm đơn giản không có phân loại
      if (!data.simplePrice || data.simplePrice <= 0) {
        notifyError("Vui lòng nhập giá bán hợp lệ cho sản phẩm.");
        return;
      }

      finalAttributes = [];
      finalVariants = [
        {
          price: data.simplePrice,
          stockQuantity: data.simpleStock || 0,
          attributeSelections: [],
          images: [],
        },
      ];
    }

    // 3. Tạo DTO JSON request
    const requestPayload: CreateProductRequest = {
      name: data.name.trim(),
      categoryId: Number(data.categoryId),
      brandId: data.brandId ? Number(data.brandId) : null,
      description: data.description?.trim() || "",
      attributes: finalAttributes,
      variants: finalVariants,
    };

    // 4. Đóng gói FormData multipart
    const formData = new FormData();

    // Part 1: request JSON
    const requestBlob = new Blob([JSON.stringify(requestPayload)], {
      type: "application/json",
    });
    formData.append("request", requestBlob);

    // Part 2: productImage File
    formData.append("productImage", coverImageFile);

    // Part 3 & 4: variantImages và variantImageMeta (nếu có)
    if (variantFilesToUpload.length > 0) {
      variantFilesToUpload.forEach((file) => {
        formData.append("variantImages", file);
      });

      const metaBlob = new Blob([JSON.stringify(variantMetaToUpload)], {
        type: "application/json",
      });
      formData.append("variantImageMeta", metaBlob);
    }

    // 5. Gọi API tạo sản phẩm
    try {
      const response = await createProduct(formData).unwrap();

      if (response.success || response.data) {
        notifySuccess("Tạo và đăng bán sản phẩm thành công!");
        router.push("/seller/products");
      } else {
        notifyError(response.message || "Không thể tạo sản phẩm.");
      }
    } catch (err: unknown) {
      const errMsg = getApiErrorMessage(
        err,
        "Đăng sản phẩm thất bại. Vui lòng kiểm tra lại thông tin."
      );
      notifyError(errMsg);
    }
  });

  return {
    addAttributeGroup,
    addAttributeValue,
    attributes,
    batchApply,
    categories: SAMPLE_CATEGORIES,
    brands: SAMPLE_BRANDS,
    coverImageFile,
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
    updateVariantImage,
    updateVariantValue,
    variantRows,
  };
}

