"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { useUploadAvatarMutation } from "@/lib/redux/services/user-api";
import { setUser } from "@/lib/redux/slices/auth-slice";
import { getApiErrorMessage } from "@/lib/utils";
import { buildImageFormData, validateProfileImage } from "@/lib/utils/image-upload.utils";

// Chọn ảnh, kiểm tra trước khi gửi, rồi cập nhật avatar trên trang và header không cần đăng nhập lại.
export function useAvatarUpload(initialUrl: string | null) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { notifySuccess, notifyError } = useNotification();
  const [uploadAvatar, { isLoading }] = useUploadAvatarMutation();
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);

  const changeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset để chọn lại cùng file vẫn kích hoạt onChange.
    event.target.value = "";
    if (!file) return;
    const error = validateProfileImage(file, "Ảnh đại diện");
    if (error) return notifyError(error);

    try {
      const nextUrl = (await uploadAvatar(buildImageFormData(file)).unwrap()).data?.avatarUrl;
      if (!nextUrl) throw new Error("Phản hồi không có ảnh đại diện.");
      setAvatarUrl(nextUrl);
      if (user) dispatch(setUser({ ...user, avatarUrl: nextUrl }));
      notifySuccess("Đã cập nhật ảnh đại diện.");
      router.refresh();
    } catch (requestError) {
      notifyError(getApiErrorMessage(requestError, "Không thể cập nhật ảnh đại diện."));
    }
  };

  return { avatarUrl, isUploading: isLoading, changeAvatar };
}
