"use client";

import type { KeyboardEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/utils";
import { CHAT_MAX_CONTENT_LENGTH } from "@/types/user/chat";

// Form dùng chung, xóa ô nhập khi handler gửi hoặc ghi nhận hàng đợi thành công.
export function useChatMessageComposer(send: (content: string) => Promise<void>, canSend = true) {
  const form = useForm<{ content: string }>({ defaultValues: { content: "" } });
  const content = useWatch({ control: form.control, name: "content" });

  // Lỗi gửi hiển thị ngay tại ô nhập, không làm mất bản nháp.
  const onSubmit = form.handleSubmit(async ({ content }) => {
    try { await send(content); form.reset(); }
    catch (error) { form.setError("content", { type: "server", message: getApiErrorMessage(error, "Không gửi được tin nhắn.") }); }
  });

  // Gợi ý đi qua cùng luồng validation và submit với nội dung tự nhập.
  const sendText = (content: string) => {
    if (!canSend || form.formState.isSubmitting) return;
    form.setValue("content", content, { shouldValidate: true });
    void onSubmit();
  };

  // Enter gửi tin; Shift+Enter xuống dòng, không gửi trong lúc gõ bằng IME.
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canSend && !form.formState.isSubmitting && !event.repeat) void onSubmit();
  };

  const field = form.register("content", {
    required: "Vui lòng nhập tin nhắn.",
    validate: (value) => !!value.trim() || "Tin nhắn không được chỉ có khoảng trắng.",
    maxLength: { value: CHAT_MAX_CONTENT_LENGTH, message: "Tin nhắn tối đa 4.000 ký tự." },
  });
  return { form, field, onSubmit, sendText, onKeyDown, hasContent: !!content?.trim() };
}
