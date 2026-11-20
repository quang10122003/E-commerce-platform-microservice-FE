"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useUpdateShopProfileMutation } from "@/lib/redux/services/user-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { SellerShopProfile, UpdateShopProfileForm } from "@/types/shop/profile";

const toForm = (shop: SellerShopProfile): UpdateShopProfileForm => ({
  shopName: shop.shopName ?? "",
  shopDescription: shop.shopDescription ?? "",
});

// Form hồ sơ shop giống hồ sơ người dùng: bật sửa từng trường, Hủy khôi phục, Lưu gửi một request.
export function useShopProfileForm(shop: SellerShopProfile) {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [updateShopProfile, { isLoading }] = useUpdateShopProfileMutation();
  // Kiểm tra mỗi lần gõ để lỗi hiện hoặc biến mất ngay.
  const form = useForm<UpdateShopProfileForm>({ defaultValues: toForm(shop), mode: "onChange" });
  // Các trường đang ở chế độ sửa; còn ít nhất một trường thì hiện Hủy/Lưu.
  const [editing, setEditing] = useState<ReadonlySet<keyof UpdateShopProfileForm>>(new Set());

  const startEdit = (name: keyof UpdateShopProfileForm) => setEditing((current) => new Set(current).add(name));

  const cancel = () => {
    if (isLoading) return;
    form.reset();
    setEditing(new Set());
  };

  const save = form.handleSubmit(async (values) => {
    const body: UpdateShopProfileForm = { shopName: values.shopName.trim(), shopDescription: values.shopDescription.trim() };
    const current = toForm(shop);
    // Chỉ bỏ qua request khi payload không đổi so với hồ sơ shop hiện tại.
    if (body.shopName === current.shopName.trim() && body.shopDescription === current.shopDescription.trim()) {
      return setEditing(new Set());
    }
    try {
      const saved = (await updateShopProfile(body).unwrap()).data;
      form.reset(saved ? toForm(saved) : body);
      setEditing(new Set());
      notifySuccess("Đã cập nhật hồ sơ shop.");
      // Tải lại layout để topbar hiện tên shop mới.
      router.refresh();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể cập nhật hồ sơ shop."));
    }
  });

  return { form, editing, isEditing: editing.size > 0, isSaving: isLoading, startEdit, cancel, save };
}
