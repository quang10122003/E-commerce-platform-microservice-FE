import type { CreateReviewForm } from "@/types/user/review";

// Khớp giới hạn của BE: tối đa 5 ảnh, mỗi ảnh 15MB, chỉ JPEG/PNG/WEBP.
export const REVIEW_MAX_IMAGES = 5;
export const REVIEW_MAX_IMAGE_BYTES = 15 * 1024 * 1024;
export const REVIEW_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const REVIEW_CONTENT_MAX_LENGTH = 2000;

export const RATING_LABELS: Record<number, string> = {
  1: "Tệ",
  2: "Không hài lòng",
  3: "Bình thường",
  4: "Hài lòng",
  5: "Tuyệt vời",
};

// Trả lỗi đầu tiên của danh sách ảnh để báo ngay trước khi gửi lên BE.
export function validateReviewImages(files: readonly File[]): string | null {
  if (files.length > REVIEW_MAX_IMAGES) return `Chỉ được chọn tối đa ${REVIEW_MAX_IMAGES} ảnh.`;
  if (files.some((file) => !REVIEW_IMAGE_TYPES.includes(file.type))) return "Ảnh phải là JPEG, PNG hoặc WEBP.";
  if (files.some((file) => file.size > REVIEW_MAX_IMAGE_BYTES)) return "Mỗi ảnh tối đa 15MB.";
  return null;
}

// Phần "request" phải là Blob application/json để BE đọc được JSON trong multipart.
export function buildReviewFormData(orderItemId: number, form: CreateReviewForm): FormData {
  const formData = new FormData();
  const content = form.content.trim();
  formData.append("request", new Blob([JSON.stringify({ orderItemId, rating: form.rating, content: content || null })],
    { type: "application/json" }));
  form.images.forEach((image) => formData.append("images", image));
  return formData;
}
