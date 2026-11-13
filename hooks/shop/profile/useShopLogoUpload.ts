"use client";

import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useUploadShopLogoMutation } from "@/lib/redux/services/user-api";
import { getApiErrorMessage } from "@/lib/utils";
import { buildImageFormData, validateProfileImage } from "@/lib/utils/image-upload.utils";

// Đổi logo shop; refresh để layout tải lại hồ sơ shop và topbar hiện logo mới.
export function useShopLogoUpload(initialUrl: string | null) {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [uploadShopLogo, { isLoading }] = useUploadShopLogoMutation();
  const [logoUrl, setLogoUrl] = useState(initialUrl);

  const changeLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset để chọn lại cùng file vẫn kích hoạt onChange.
    event.target.value = "";
    if (!file) return;
    const error = validateProfileImage(file, "Logo shop");
    if (error) return notifyError(error);

    try {
      const nextUrl = (await uploadShopLogo(buildImageFormData(file)).unwrap()).data?.shopLogoUrl;
      if (!nextUrl) throw new Error("Phản hồi không có logo shop.");
      setLogoUrl(nextUrl);
      notifySuccess("Đã cập nhật logo shop.");
      router.refresh();
    } catch (requestError) {
      notifyError(getApiErrorMessage(requestError, "Không thể cập nhật logo shop."));
    }
  };

  return { logoUrl, isUploading: isLoading, changeLogo };
}
