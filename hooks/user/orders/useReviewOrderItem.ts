"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useCreateReviewMutation } from "@/lib/redux/services/order-api";
import { getApiErrorMessage } from "@/lib/utils";
import { buildReviewFormData, validateReviewImages } from "@/lib/utils/review.utils";
import type { CreateReviewForm } from "@/types/user/review";

const DEFAULT_VALUES: CreateReviewForm = { rating: 5, content: "", images: [] };

// Quản lý dialog đánh giá một món: số sao, nội dung, ảnh xem trước, gửi qua BFF và tải lại danh sách đơn.
export function useReviewOrderItem(orderItemId: number) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { notifySuccess, notifyError } = useNotification();
  const [createReview] = useCreateReviewMutation();
  const form = useForm<CreateReviewForm>({ defaultValues: DEFAULT_VALUES });
  // URL xem trước tương ứng từng ảnh đã chọn, thu hồi khi bỏ ảnh hoặc đóng dialog để không rò bộ nhớ.
  const [previews, setPreviews] = useState<string[]>([]);
  const previewsRef = useRef<string[]>([]);

  useEffect(() => () => previewsRef.current.forEach((url) => URL.revokeObjectURL(url)), []);

  const setImages = (images: File[]) => {
    previewsRef.current.forEach((url) => URL.revokeObjectURL(url));
    previewsRef.current = images.map((image) => URL.createObjectURL(image));
    setPreviews(previewsRef.current);
    form.setValue("images", images, { shouldValidate: true });
  };

  const open = () => {
    form.reset(DEFAULT_VALUES);
    setImages([]);
    dialogRef.current?.showModal();
  };

  // Không cho đóng khi đang gửi để người dùng thấy kết quả của yêu cầu.
  const close = () => {
    if (!form.formState.isSubmitting) dialogRef.current?.close();
  };

  // Thêm ảnh mới vào sau ảnh đã chọn; reset input để chọn lại cùng file vẫn kích hoạt onChange.
  const addImages = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (selected.length > 0) setImages([...form.getValues("images"), ...selected]);
  };

  const removeImage = (index: number) => setImages(form.getValues("images").filter((_, i) => i !== index));

  const submitReview = async (values: CreateReviewForm) => {
    try {
      await createReview(buildReviewFormData(orderItemId, values)).unwrap();
      dialogRef.current?.close();
      notifySuccess("Cảm ơn bạn đã đánh giá sản phẩm.");
      router.refresh();
    } catch (error) {
      form.setError("root.server", { message: getApiErrorMessage(error, "Không thể gửi đánh giá. Vui lòng thử lại.") });
      notifyError("Gửi đánh giá không thành công.");
    }
  };

  // Chỉ tạo handler validation khi nhận sự kiện, không đọc ref trong render.
  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submitReview)(event);

  // Kiểm tra ảnh qua react-hook-form để lỗi hiện ngay dưới ô chọn ảnh.
  form.register("images", { validate: (images) => validateReviewImages(images) ?? true });

  return { form, dialogRef, previews, open, close, submit, addImages, removeImage };
}
