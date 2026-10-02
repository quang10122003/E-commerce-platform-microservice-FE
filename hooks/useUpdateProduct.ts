"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useNotification } from "@/hooks/useNotification";
import { useUpdateProductMutation } from "@/lib/redux/services/product-api";
import { hasDuplicateVariantCombinations } from "@/lib/utils/shop-product.utils";
import { getApiErrorMessage } from "@/lib/utils";
import type { ShopProductDetail, UpdateProductRequest, VariantImageMeta } from "@/types/product";

export type EditableValue = { key: string; id?: number; value: string };
export type EditableAttribute = { key: string; id?: number; name: string; values: EditableValue[] };
export type EditableImage = { key: string; id?: number; url: string; file?: File; primary: boolean };
export type EditableVariant = {
  key: string;
  id?: number;
  sku?: string;
  selections: Record<string, string>;
  price: string;
  stock: string;
  images: EditableImage[];
};
export type UpdateProductFields = { name: string; categoryId: string; brandId: string; description: string };

// Giữ khóa UI ổn định và ID backend của từng thuộc tính, giá trị, phân loại và ảnh.
function toEditableData(product: ShopProductDetail) {
  const attributes: EditableAttribute[] = product.attributes.map((attribute) => ({
    key: String(attribute.id), id: attribute.id, name: attribute.name,
    values: attribute.values.map((value) => ({ key: String(value.id), id: value.id, value: value.value })),
  }));
  const variants: EditableVariant[] = product.variants.map((variant) => ({
    key: String(variant.id), id: variant.id, sku: variant.sku,
    selections: Object.fromEntries(variant.attributeSelections.map((selection) => [
      attributes[selection.attributeIndex]?.key,
      attributes[selection.attributeIndex]?.values[selection.valueIndex]?.key,
    ]).filter(([attributeKey, valueKey]) => attributeKey && valueKey)),
    price: String(variant.price), stock: String(variant.stockQuantity),
    images: variant.images.map((image) => ({
      key: String(image.id), id: image.id, url: image.imageUrl, primary: image.primary,
    })),
  }));
  return { attributes, variants };
}

// Quản lý form cập nhật, kiểm tra tổ hợp và đóng gói multipart theo vị trí ảnh của backend.
export function useUpdateProduct(product: ShopProductDetail) {
  const router = useRouter();
  const { notifyError, notifySuccess } = useNotification();
  const [updateProduct, { isLoading: isSubmitting }] = useUpdateProductMutation();
  const initial = toEditableData(product);
  const [attributes, setAttributes] = useState(initial.attributes);
  const [variants, setVariants] = useState(initial.variants);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(product.imageUrl);
  const [draftValues, setDraftValues] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const previewUrls = useRef<string[]>([]);
  const { register, handleSubmit, formState: { errors } } = useForm<UpdateProductFields>({
    defaultValues: {
      name: product.name,
      categoryId: String(product.categoryId),
      brandId: product.brandId == null ? "" : String(product.brandId),
      description: product.description || "",
    },
  });

  useEffect(() => () => previewUrls.current.forEach((url) => URL.revokeObjectURL(url)), []);

  // Xem trước file mới và thu hồi URL khi đóng form.
  function preview(file: File) {
    const url = URL.createObjectURL(file);
    previewUrls.current.push(url);
    return url;
  }

  function selectCover(file: File | null) {
    setCoverFile(file);
    setCoverPreview(file ? preview(file) : product.imageUrl);
  }

  function addAttribute() {
    setAttributes((current) => [...current, { key: crypto.randomUUID(), name: "", values: [] }]);
  }

  function updateAttribute(key: string, name: string) {
    setAttributes((current) => current.map((attribute) => attribute.key === key ? { ...attribute, name } : attribute));
  }

  // Chỉ cho bỏ nhóm khi các phân loại vẫn có tổ hợp riêng sau khi bỏ.
  function isAttributeRemovalBlocked(key: string) {
    return hasDuplicateVariantCombinations(attributes.filter((attribute) => attribute.key !== key), variants);
  }

  function removeAttribute(key: string) {
    if (isAttributeRemovalBlocked(key)) return;
    setAttributes((current) => current.filter((attribute) => attribute.key !== key));
    setVariants((current) => current.map((variant) => {
      const selections = { ...variant.selections };
      delete selections[key];
      return { ...variant, selections };
    }));
    setFormError("");
  }

  function addValue(key: string) {
    const value = draftValues[key]?.trim();
    if (!value) return;
    if (attributes.find((attribute) => attribute.key === key)?.values.some((item) => item.value.trim().toLowerCase() === value.toLowerCase())) {
      setFormError("Giá trị thuộc tính đã tồn tại trong nhóm.");
      return;
    }
    setAttributes((current) => current.map((attribute) => attribute.key === key
      ? { ...attribute, values: [...attribute.values, { key: crypto.randomUUID(), value }] }
      : attribute));
    setDraftValues((current) => ({ ...current, [key]: "" }));
    setFormError("");
  }

  function updateValue(attributeKey: string, valueKey: string, value: string) {
    setAttributes((current) => current.map((attribute) => attribute.key === attributeKey
      ? { ...attribute, values: attribute.values.map((item) => item.key === valueKey ? { ...item, value } : item) }
      : attribute));
  }

  // Chỉ khóa value còn được một phân loại chọn trong trạng thái hiện tại của form.
  function isValueInUse(attributeKey: string, valueKey: string) {
    return variants.some((variant) => variant.selections[attributeKey] === valueKey);
  }

  function removeValue(attributeKey: string, valueKey: string) {
    if (isValueInUse(attributeKey, valueKey)) return;
    setAttributes((current) => current.map((attribute) => attribute.key === attributeKey
      ? { ...attribute, values: attribute.values.filter((value) => value.key !== valueKey) }
      : attribute));
  }

  function addVariant() {
    setVariants((current) => [...current, {
      key: crypto.randomUUID(), selections: {}, price: "", stock: "0", images: [],
    }]);
  }

  function updateVariant(key: string, changes: Partial<EditableVariant>) {
    setVariants((current) => current.map((variant) => variant.key === key ? { ...variant, ...changes } : variant));
  }

  function addImages(variantKey: string, files: FileList | null) {
    if (!files?.length) return;
    const selectedImages = Array.from(files).map((file) => ({
      key: crypto.randomUUID(), url: preview(file), file, primary: false,
    }));
    setVariants((current) => current.map((variant) => {
      if (variant.key !== variantKey) return variant;
      const images = selectedImages.map((image, index) => ({
        ...image, primary: variant.images.length === 0 && index === 0,
      }));
      return { ...variant, images: [...variant.images, ...images] };
    }));
  }

  function removeImage(variantKey: string, imageKey: string) {
    setVariants((current) => current.map((variant) => {
      if (variant.key !== variantKey) return variant;
      const images = variant.images.filter((image) => image.key !== imageKey);
      if (images.length && !images.some((image) => image.primary)) images[0] = { ...images[0], primary: true };
      return { ...variant, images };
    }));
  }

  function setPrimaryImage(variantKey: string, imageKey: string) {
    setVariants((current) => current.map((variant) => variant.key === variantKey
      ? { ...variant, images: variant.images.map((image) => ({ ...image, primary: image.key === imageKey })) }
      : variant));
  }

  // Chặn dữ liệu sai trước khi ánh xạ chỉ số thuộc tính và ảnh mới vào multipart.
  const submit = handleSubmit(async (fields) => {
    const names = attributes.map((attribute) => attribute.name.trim().toLowerCase());
    if (names.some((name) => !name) || new Set(names).size !== names.length
      || attributes.some((attribute) => attribute.values.length === 0
        || attribute.values.some((value) => !value.value.trim())
        || new Set(attribute.values.map((value) => value.value.trim().toLowerCase())).size !== attribute.values.length)) {
      setFormError("Tên nhóm và giá trị thuộc tính phải đầy đủ, không trùng nhau.");
      return;
    }

    if (variants.length === 0 || variants.some((variant) => attributes.some((attribute) => !variant.selections[attribute.key])
      || !variant.price || !Number.isFinite(Number(variant.price)) || Number(variant.price) < 0
      || variant.stock === "" || !Number.isSafeInteger(Number(variant.stock)) || Number(variant.stock) < 0)) {
      setFormError("Mỗi phân loại cần đủ thuộc tính, giá không âm và tồn kho nguyên không âm.");
      return;
    }
    if (hasDuplicateVariantCombinations(attributes, variants)) {
      setFormError("Tổ hợp thuộc tính của các phân loại không được trùng nhau.");
      return;
    }
    if (variants.some((variant) => variant.images.length > 0 && variant.images.filter((image) => image.primary).length !== 1)) {
      setFormError("Mỗi phân loại có ảnh cần đúng một ảnh chính.");
      return;
    }

    const request: UpdateProductRequest = {
      categoryId: Number(fields.categoryId),
      brandId: fields.brandId ? Number(fields.brandId) : null,
      name: fields.name.trim(),
      description: fields.description.trim(),
      attributes: attributes.map((attribute) => ({
        ...(attribute.id === undefined ? {} : { id: attribute.id }),
        name: attribute.name.trim(),
        values: attribute.values.map((value) => ({
          ...(value.id === undefined ? {} : { id: value.id }), value: value.value.trim(),
        })),
      })),
      variants: variants.map((variant) => ({
        ...(variant.id === undefined ? {} : { id: variant.id }),
        price: Number(variant.price),
        stockQuantity: Number(variant.stock),
        attributeSelections: attributes.map((attribute, attributeIndex) => ({
          attributeIndex,
          valueIndex: attribute.values.findIndex((value) => value.key === variant.selections[attribute.key]),
        })),
        images: variant.images.map((image) => ({
          ...(image.id === undefined ? {} : { id: image.id }), primary: image.primary,
        })),
      })),
    };

    const formData = new FormData();
    formData.append("request", new Blob([JSON.stringify(request)], { type: "application/json" }));
    if (coverFile) formData.append("productImage", coverFile);
    const metadata: VariantImageMeta[] = [];
    variants.forEach((variant, variantIndex) => variant.images.forEach((image, imageIndex) => {
      if (!image.file) return;
      formData.append("variantImages", image.file);
      metadata.push({ variantIndex, imageIndex });
    }));
    if (metadata.length) formData.append("variantImageMeta", new Blob([JSON.stringify(metadata)], { type: "application/json" }));

    setFormError("");
    try {
      const response = await updateProduct({ productId: product.id, formData }).unwrap();
      if (!response.success || !response.data) {
        notifyError(response.message || "Không thể cập nhật sản phẩm.");
        return;
      }
      notifySuccess("Đã cập nhật sản phẩm và phân loại.");
      router.push("/shop/products");
    } catch (error: unknown) {
      notifyError(getApiErrorMessage(error, "Cập nhật sản phẩm thất bại. Vui lòng thử lại."));
    }
  });

  return {
    attributes, variants, coverPreview, coverFile, draftValues, formError, errors, register, submit, isSubmitting,
    setDraftValues, selectCover, addAttribute, updateAttribute, removeAttribute, isAttributeRemovalBlocked,
    addValue, updateValue, removeValue, isValueInUse,
    addVariant, updateVariant, addImages, removeImage, setPrimaryImage,
  };
}
