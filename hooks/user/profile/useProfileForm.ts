"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useUpdateProfileMutation } from "@/lib/redux/services/user-api";
import { setUser } from "@/lib/redux/slices/auth-slice";
import { getApiErrorMessage } from "@/lib/utils";
import type { UpdateProfileForm, UserProfile } from "@/types/user/profile";

const toForm = (profile: Pick<UserProfile, keyof UpdateProfileForm>): UpdateProfileForm => ({ fullName: profile.fullName });

// Form hồ sơ dùng chung cho mọi trường sửa được: bật sửa từng trường, Hủy khôi phục, Lưu gửi một request.
export function useProfileForm(profile: UserProfile) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { notifySuccess, notifyError } = useNotification();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const form = useForm<UpdateProfileForm>({ defaultValues: toForm(profile), mode: "onChange" });
  // Các trường đang ở chế độ sửa; còn ít nhất một trường thì hiện Hủy/Lưu.
  const [editing, setEditing] = useState<ReadonlySet<keyof UpdateProfileForm>>(new Set());

  const startEdit = (name: keyof UpdateProfileForm) => setEditing((current) => new Set(current).add(name));

  const cancel = () => {
    if (isLoading) return;
    form.reset();
    setEditing(new Set());
  };

  const save = form.handleSubmit(async (values) => {
    const body: UpdateProfileForm = { fullName: values.fullName.trim() };
    // Chỉ bỏ qua request khi payload không đổi so với hồ sơ hiện tại.
    if (body.fullName === profile.fullName) return setEditing(new Set());
    try {
      const saved = (await updateProfile(body).unwrap()).data ?? { ...profile, ...body };
      form.reset(toForm(saved));
      setEditing(new Set());
      if (user) dispatch(setUser({ ...user, fullName: saved.fullName }));
      notifySuccess("Đã cập nhật thông tin cá nhân.");
      router.refresh();
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể cập nhật thông tin cá nhân."));
    }
  });

  return { form, editing, isEditing: editing.size > 0, isSaving: isLoading, startEdit, cancel, save };
}
