"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getRegistrationQuantityLimit, normalizeDiscountPercent, getFlashSaleItemUpdateRequest } from "@/lib/utils/flash-sale.utils";
import { useUpdateShopFlashSaleItemMutation } from "@/lib/redux/services/flash-sale-api";
import { useNotification } from "@/hooks/shared/useNotification";
import { getApiErrorMessage } from "@/lib/utils";
import type { ShopFlashSaleItem } from "@/types/shop/flash-sale";
import { useFlashSalePricePreview } from "./useFlashSalePricePreview";

type EditFields = { discountPercent: number; registeredQuantity: number };

// Quản lý bản nháp, validation và cập nhật một lượt đăng ký qua BFF.
export function useShopFlashSaleItemEdit(campaignId: string, item: ShopFlashSaleItem) {
  const [updateItem] = useUpdateShopFlashSaleItemMutation();
  const { notifySuccess, notifyError } = useNotification();
  // Khóa đồng bộ để chặn lưu lặp trước khi trạng thái form kịp render.
  const savingRef = useRef(false);
  // Theo dõi chế độ nhập của dòng, giá trị và dirty state do react-hook-form quản lý.
  const [editing, setEditing] = useState(false);
  const form = useForm<EditFields>({ mode: "onChange", defaultValues: {
    discountPercent: item.discountPercent ?? NaN, registeredQuantity: item.registeredQuantity,
  } });
  const quantityLimit = item.stockQuantity != null && Number.isFinite(item.stockQuantity)
    ? Math.max(0, getRegistrationQuantityLimit(item.stockQuantity)) : 0;
  const canEditQuantity = !item.variantDeleted && quantityLimit >= 1;
  const discount = useWatch({ control: form.control, name: "discountPercent" });
  const discountChanged = editing && !Object.is(discount, item.discountPercent ?? NaN);
  const preview = useFlashSalePricePreview(item.variantId, discount, editing && !item.variantDeleted && discountChanged);
  const missingVariant = discountChanged && !item.variantId;
  const changed = editing && form.formState.isDirty;
  const saving = form.formState.isSubmitting;

  // Nạp lại giá trị server làm mốc so sánh mỗi khi bắt đầu chỉnh sửa.
  const startEdit = () => {
    if (item.variantDeleted || item.status !== "REGISTERED" || savingRef.current) return;
    form.reset({ discountPercent: item.discountPercent ?? NaN, registeredQuantity: item.registeredQuantity });
    setEditing(true);
  };
  // Hủy toàn bộ bản nháp và hiển thị lại dữ liệu gốc, không gọi API cập nhật.
  const cancelEdit = () => {
    if (savingRef.current) return;
    form.reset({ discountPercent: item.discountPercent ?? NaN, registeredQuantity: item.registeredQuantity });
    setEditing(false);
  };
  // Cắt phần thập phân dư và giới hạn phần trăm giống form đăng ký.
  const changeDiscount = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!raw || !Number.isFinite(Number(raw))) return;
    const value = Number(raw);
    const normalized = normalizeDiscountPercent(value);
    if (normalized !== value || /\.\d{3}/.test(raw)) {
      form.setValue("discountPercent", normalized, { shouldDirty: true, shouldValidate: true });
    }
  };
  // Chặn ngay cả dữ liệu dán vượt một nửa tồn kho, làm tròn xuống phần lẻ.
  const changeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!raw || !Number.isFinite(Number(raw)) || quantityLimit < 1) return;
    const value = Number(raw);
    const bounded = Math.min(quantityLimit, Math.max(1, Math.floor(value)));
    if (bounded !== value) {
      form.setValue("registeredQuantity", bounded, { shouldDirty: true, shouldValidate: true });
    }
  };
  // Validation là hàng rào bổ sung cho cả giá trị được điền từ code hoặc autofill.
  const validateQuantity = (value: number) =>
    (Number.isInteger(value) && value >= 1 && value <= quantityLimit) || `Nhập số nguyên từ 1 đến ${quantityLimit}.`;

  // Chỉ đóng bản nháp sau response thành công; lỗi giữ lại input để Shop sửa hoặc thử lại.
  const submitChanges = async (values: EditFields) => {
    if (savingRef.current || !changed || item.variantDeleted || item.status !== "REGISTERED") return;
    savingRef.current = true;
    try {
      await updateItem({ campaignId, itemId: item.itemId, request: getFlashSaleItemUpdateRequest(item, values) }).unwrap();
      form.reset(values);
      setEditing(false);
      notifySuccess("Cập nhật đăng ký Flash Sale thành công.");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể cập nhật đăng ký Flash Sale. Vui lòng thử lại."));
    } finally {
      savingRef.current = false;
    }
  };
  // Chạy validation theo field trước khi gọi mutation, kể cả thao tác từ bàn phím.
  const save = () => {
    if (!savingRef.current) void form.handleSubmit(submitChanges)();
  };

  return { form, editing, canEditQuantity, quantityLimit, discountChanged, missingVariant,
    changed, saving, save, startEdit, cancelEdit, changeDiscount, changeQuantity, validateQuantity, ...preview };
}
