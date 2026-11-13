// Auth-service chưa cấu hình multipart nên dùng giới hạn mặc định 1MB của Spring cho avatar và logo shop.
export const PROFILE_IMAGE_MAX_BYTES = 1024 * 1024;

// Trả lỗi đầu tiên của file ảnh hồ sơ để báo ngay trước khi gửi lên BE.
export function validateProfileImage(file: File, label: string): string | null {
  if (!file.type.startsWith("image/")) return "Vui lòng chọn file ảnh.";
  if (file.size > PROFILE_IMAGE_MAX_BYTES) return `${label} tối đa 1MB.`;
  return null;
}

// Gói file vào part "image" như các API upload ảnh của auth-service.
export function buildImageFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("image", file);
  return formData;
}
