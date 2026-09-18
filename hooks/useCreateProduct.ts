import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { useCreateProductMutation } from "@/lib/redux/services/product-api";
import { getApiErrorMessage } from "@/lib/utils";
import { useNotification } from "@/hooks/useNotification";
import type {
  CreateProductRequest,
  ProductAttributeRequest,
  VariantImageMeta,
} from "@/types/product";

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

// Hook quản lý form tạo sản phẩm, sinh biến thể và đóng gói multipart gửi lên backend.
export interface UseCreateProductOptions {
  defaultCategoryId: number;
}

// Hook quản lý form tạo sản phẩm, sinh biến thể và đóng gói multipart gửi lên backend.
export function useCreateProduct({ defaultCategoryId }: UseCreateProductOptions) {
  const router = useRouter();
  const [createProduct, { isLoading: isSubmitting }] = useCreateProductMutation();
  const { notifyError, notifySuccess, notifyWarning } = useNotification();

  // Khởi tạo form cơ bản với react-hook-form
  const form = useForm<ProductBasicFormData>({
    defaultValues: {
      name: "",
      categoryId: defaultCategoryId,
      brandId: null,
      description: "",
      simplePrice: 0,
      simpleStock: 0,
      attributes: [{ name: "", values: [] }],
    },
  });

  const { control, clearErrors, setError, setValue } = form;
  const attributeFields = useFieldArray({ control, name: "attributes" });
  const attributes = useWatch({ control, name: "attributes" });

  // State ảnh bìa sản phẩm chính
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // State nhiều ảnh cho variant duy nhất của sản phẩm đơn giản
  const [simpleImages, setSimpleImages] = useState<ProductImageSelection[]>([]);
  // Vị trí ảnh chính của sản phẩm đơn giản
  const [simplePrimaryImageIndex, setSimplePrimaryImageIndex] = useState(0);

  // Chế độ sản phẩm có biến thể hay sản phẩm đơn giản
  const [hasVariants, setHasVariants] = useState<boolean>(false);

  // Lưu thông tin tùy biến (giá, kho, ảnh) của từng biến thể theo key
  const [variantOverrides, setVariantOverrides] = useState<
    Record<
      string,
      {
        price: number;
        stockQuantity: number;
        imageFiles: File[];
        imagePreviewUrls: string[];
        primaryImageIndex: number;
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
        imageFiles: override?.imageFiles || [],
        imagePreviewUrls: override?.imagePreviewUrls || [],
        primaryImageIndex: override?.primaryImageIndex || 0,
      };
    });
  }, [hasVariants, attributes, variantOverrides]);

  // Thêm nhóm thuộc tính mới
  const addAttributeGroup = useCallback(() => {
    attributes.forEach((attribute, index) => {
      if (!attribute.name.trim()) {
        setError(`attributes.${index}.name`, {
          type: "manual",
          message: "Vui lòng nhập tên nhóm phân loại.",
        });
      }
      if (attribute.values.length === 0) {
        setError(`attributes.${index}.values`, {
          type: "manual",
          message: "Vui lòng thêm ít nhất một giá trị.",
        });
      }
    });

    const hasInvalidAttribute = attributes.some(
      (attribute) => !attribute.name.trim() || attribute.values.length === 0
    );
    if (hasInvalidAttribute) return;

    if (attributes.length >= 2) {
      notifyWarning("Hệ thống hỗ trợ tối đa 2 nhóm thuộc tính phân loại.");
      return;
    }
    attributeFields.append({ name: "", values: [] });
  }, [attributeFields, attributes, notifyWarning, setError]);

  // Xóa nhóm thuộc tính
  const removeAttributeGroup = useCallback((index: number) => {
    attributeFields.remove(index);
    clearErrors("attributes");
    setVariantOverrides({});
  }, [attributeFields, clearErrors]);

  // Cập nhật tên nhóm thuộc tính
  const updateAttributeName = useCallback((index: number, name: string) => {
    const currentAttribute = attributes[index];
    if (!currentAttribute) return;

    setValue(`attributes.${index}.name`, name, { shouldDirty: true });
    if (currentAttribute.name !== name) {
      // Đổi tên nhóm làm thay đổi toàn bộ tổ hợp biến thể hiện tại.
      setValue(`attributes.${index}.values`, [], { shouldDirty: true });
      setVariantOverrides({});
      clearErrors(`attributes.${index}.values`);
    }
    if (name.trim()) clearErrors(`attributes.${index}.name`);
  }, [attributes, clearErrors, setValue]);

  // Thêm giá trị cho nhóm thuộc tính (ví dụ: thêm màu mới)
  const addAttributeValue = useCallback((attrIndex: number, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const currentValues = attributes[attrIndex]?.values || [];
    if (currentValues.includes(trimmed)) {
      notifyWarning("Giá trị phân loại này đã tồn tại.");
      return;
    }

    setValue(`attributes.${attrIndex}.values`, [...currentValues, trimmed], {
      shouldDirty: true,
    });
    // Thêm giá trị mới sẽ tạo tổ hợp mới nên cần xóa dữ liệu biến thể cũ.
    setVariantOverrides({});
    clearErrors(`attributes.${attrIndex}.values`);
  }, [attributes, clearErrors, notifyWarning, setValue]);

  // Báo lỗi khi người dùng bấm thêm giá trị nhưng ô nhập đang trống.
  const validateAttributeValue = useCallback((index: number) => {
    setError(`attributes.${index}.values`, {
      type: "manual",
      message: "Vui lòng nhập giá trị phân loại.",
    });
    return false;
  }, [setError]);

  // Xóa giá trị của nhóm thuộc tính
  const removeAttributeValue = useCallback((attrIndex: number, valIndex: number) => {
    const currentValues = attributes[attrIndex]?.values || [];
    setValue(
      `attributes.${attrIndex}.values`,
      currentValues.filter((_, index) => index !== valIndex),
      { shouldDirty: true }
    );
    // Xóa giá trị làm thay đổi tổ hợp nên không giữ lại dữ liệu biến thể cũ.
    setVariantOverrides({});
  }, [attributes, setValue]);

  // Cập nhật giá/tồn kho cho từng biến thể
  const updateVariantValue = useCallback(
    (index: number, field: "price" | "stockQuantity", value: number) => {
      const targetRow = variantRows[index];
      if (!targetRow) return;

      setVariantOverrides((prev) => ({
        ...prev,
        [targetRow.key]: {
          price:
            field === "price"
              ? Number.isFinite(value)
                ? Math.max(0, value)
                : 0
              : prev[targetRow.key]?.price || 0,
          stockQuantity:
            field === "stockQuantity"
              ? Number.isFinite(value)
                ? Math.max(0, value)
                : 0
              : prev[targetRow.key]?.stockQuantity || 0,
          imageFiles: prev[targetRow.key]?.imageFiles || [],
          imagePreviewUrls: prev[targetRow.key]?.imagePreviewUrls || [],
          primaryImageIndex: prev[targetRow.key]?.primaryImageIndex || 0,
        },
      }));
    },
    [variantRows]
  );

  // Cập nhật nhiều file ảnh riêng cho từng biến thể
  const updateVariantImages = useCallback(
    (index: number, files: File[], primaryImageIndex = 0) => {
      const targetRow = variantRows[index];
      if (!targetRow) return;

      const previewUrls = files.map((file) => URL.createObjectURL(file));
      setVariantOverrides((prev) => ({
        ...prev,
        [targetRow.key]: {
          price: prev[targetRow.key]?.price || 0,
          stockQuantity: prev[targetRow.key]?.stockQuantity || 0,
          imageFiles: files,
          imagePreviewUrls: previewUrls,
          primaryImageIndex: Math.min(primaryImageIndex, Math.max(files.length - 1, 0)),
        },
      }));
    },
    [variantRows]
  );

  // Cập nhật nhiều ảnh cho variant duy nhất của sản phẩm đơn giản
  const updateSimpleImages = useCallback((files: File[], primaryImageIndex = 0) => {
    setSimplePrimaryImageIndex(Math.min(primaryImageIndex, Math.max(files.length - 1, 0)));
    setSimpleImages(
      files.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }))
    );
  }, []);

  // Đặt ảnh được chọn làm ảnh chính của nhóm ảnh
  const setPrimaryProductImage = useCallback((group: "simple" | number, imageIndex: number) => {
    if (group === "simple") {
      setSimplePrimaryImageIndex(imageIndex);
      return;
    }

    const targetRow = variantRows[group];
    if (!targetRow) return;

    setVariantOverrides((prev) => ({
      ...prev,
      [targetRow.key]: {
        price: prev[targetRow.key]?.price || 0,
        stockQuantity: prev[targetRow.key]?.stockQuantity || 0,
        imageFiles: prev[targetRow.key]?.imageFiles || [],
        imagePreviewUrls: prev[targetRow.key]?.imagePreviewUrls || [],
        primaryImageIndex: imageIndex,
      },
    }));
  }, [variantRows]);

  // Xóa một ảnh đã chọn theo nhóm ảnh tương ứng
  const removeProductImage = useCallback((group: "simple" | number, imageIndex: number) => {
    if (group === "simple") {
      setSimpleImages((prev) => prev.filter((_, index) => index !== imageIndex));
      setSimplePrimaryImageIndex((prev) => (prev === imageIndex ? 0 : prev > imageIndex ? prev - 1 : prev));
      return;
    }

    const targetRow = variantRows[group];
    if (!targetRow) return;

    setVariantOverrides((prev) => {
      const current = prev[targetRow.key];
      if (!current) return prev;

      return {
        ...prev,
        [targetRow.key]: {
          ...current,
          imageFiles: current.imageFiles.filter((_, index) => index !== imageIndex),
          imagePreviewUrls: current.imagePreviewUrls.filter((_, index) => index !== imageIndex),
          primaryImageIndex:
            current.primaryImageIndex === imageIndex
              ? 0
              : current.primaryImageIndex > imageIndex
                ? current.primaryImageIndex - 1
                : current.primaryImageIndex,
        },
      };
    });
  }, [variantRows]);

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
            imageFiles: prev[row.key]?.imageFiles || [],
            imagePreviewUrls: prev[row.key]?.imagePreviewUrls || [],
            primaryImageIndex: prev[row.key]?.primaryImageIndex || 0,
          };
        });
        return next;
      });
      notifySuccess("Đã áp dụng giá và tồn kho cho toàn bộ biến thể!");
    },
    [notifySuccess, variantRows]
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

      // Kiểm tra đầy đủ tên nhóm và giá trị trước khi tạo ma trận biến thể.
      const hasInvalidAttribute = attributes.some(
        (attribute) =>
          !attribute.name.trim() ||
          attribute.values.length === 0 ||
          attribute.values.some((value) => !value.trim())
      );
      if (hasInvalidAttribute) {
        notifyError("Vui lòng nhập đầy đủ tên nhóm và giá trị phân loại.");
        return;
      }

      // Kiểm tra mỗi biến thể phải có ít nhất một ảnh trước khi gửi.
      const hasMissingVariantImage = variantRows.some(
        (variant) => variant.imageFiles.length === 0
      );
      if (hasMissingVariantImage) {
        notifyError("Vui lòng chọn ít nhất 1 ảnh cho tất cả biến thể.");
        return;
      }

      // Kiểm tra xem có biến thể nào có giá <= 0 không
      const hasInvalidPrice = variantRows.some(
        (variant) => !Number.isFinite(variant.price) || variant.price <= 0
      );
      if (hasInvalidPrice) {
        notifyError("Vui lòng nhập giá bán lớn hơn 0 cho tất cả biến thể.");
        return;
      }

      // Kiểm tra tồn kho của tất cả biến thể phải lớn hơn 0 trước khi gửi.
      const hasInvalidStock = variantRows.some(
        (variant) =>
          !Number.isFinite(variant.stockQuantity) || variant.stockQuantity <= 0
      );
      if (hasInvalidStock) {
        notifyError("Vui lòng nhập tồn kho lớn hơn 0 cho tất cả biến thể.");
        return;
      }

      finalAttributes = attributes.filter(
        (a) => a.name.trim() && a.values.length > 0
      );

      finalVariants = variantRows.map((row, variantIdx) => {
        // Gắn metadata theo đúng thứ tự file ảnh của từng biến thể
        const images: { primary: boolean }[] = row.imageFiles.map((file, imageIdx) => {
          variantFilesToUpload.push(file);
          variantMetaToUpload.push({
            variantIndex: variantIdx,
            imageIndex: imageIdx,
          });
          return { primary: imageIdx === row.primaryImageIndex };
        });

        return {
          price: row.price,
          stockQuantity: row.stockQuantity,
          attributeSelections: row.attributeSelections,
          images,
        };
      });
    } else {
      // Sản phẩm đơn giản không có phân loại
      if (!Number.isFinite(data.simplePrice) || data.simplePrice <= 0) {
        notifyError("Vui lòng nhập giá bán hợp lệ cho sản phẩm.");
        return;
      }

      // Kiểm tra tồn kho sản phẩm đơn giản phải lớn hơn 0 trước khi gửi.
      if (!Number.isFinite(data.simpleStock) || data.simpleStock <= 0) {
        notifyError("Vui lòng nhập tồn kho lớn hơn 0 cho sản phẩm.");
        return;
      }

      finalAttributes = [];
      finalVariants = [
        {
          price: data.simplePrice,
          stockQuantity: data.simpleStock || 0,
          attributeSelections: [],
          // Gắn ảnh đã chọn vào variant duy nhất của sản phẩm đơn giản
          images: simpleImages.map((selection, imageIdx) => {
            variantFilesToUpload.push(selection.file);
            variantMetaToUpload.push({
              variantIndex: 0,
              imageIndex: imageIdx,
            });
            return { primary: imageIdx === simplePrimaryImageIndex };
          }),
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

      if (response.success && response.data) {
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
    updateVariantImages,
    updateSimpleImages,
    removeProductImage,
    setPrimaryProductImage,
    updateVariantValue,
    validateAttributeValue,
    variantRows,
    simpleImages,
    simplePrimaryImageIndex,
  };
}
