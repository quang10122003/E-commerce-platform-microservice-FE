"use client";

import { useRef, type FormEvent } from "react";
import { useForm, type RegisterOptions } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useChangePasswordMutation } from "@/lib/redux/services/user-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { ChangePasswordForm } from "@/types/user/profile";

const DEFAULT_VALUES: ChangePasswordForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

// Lỗi BE gắn được vào đúng ô thay vì chỉ hiện thông báo chung.
const FIELD_BY_ERROR_CODE: Record<string, keyof ChangePasswordForm> = {
  CURRENT_PASSWORD_INCORRECT: "currentPassword",
  NEW_PASSWORD_SAME_AS_CURRENT: "newPassword",
  PASSWORD_CONFIRM_MISMATCH: "confirmPassword",
};

// Dialog đổi mật khẩu: mở/đóng, kiểm tra 3 ô, gửi qua BFF và gắn lỗi BE vào ô tương ứng.
export function useChangePassword() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { notifySuccess, notifyError } = useNotification();
  const [changePassword] = useChangePasswordMutation();
  // Kiểm tra mỗi lần gõ để lỗi hiện hoặc biến mất ngay, không đợi rời ô.
  const form = useForm<ChangePasswordForm>({ defaultValues: DEFAULT_VALUES, mode: "onChange" });
  // Ô phụ thuộc chỉ kiểm tra lại khi đã có giá trị, tránh báo lỗi ô người dùng chưa gõ tới; quy tắc khớp với BE.
  const recheck = (name: keyof ChangePasswordForm) => {
    if (form.getValues(name)) void form.trigger(name);
  };
  const rules: Record<keyof ChangePasswordForm, RegisterOptions<ChangePasswordForm, keyof ChangePasswordForm>> = {
    currentPassword: { required: "Vui lòng nhập mật khẩu hiện tại.", onChange: () => recheck("newPassword") },
    newPassword: {
      required: "Vui lòng nhập mật khẩu mới.",
      minLength: { value: 6, message: "Mật khẩu mới tối thiểu 6 ký tự." },
      maxLength: { value: 72, message: "Mật khẩu mới tối đa 72 ký tự." },
      validate: (value, values) => value !== values.currentPassword || "Mật khẩu mới phải khác mật khẩu hiện tại.",
      onChange: () => recheck("confirmPassword"),
    },
    confirmPassword: {
      required: "Vui lòng nhập lại mật khẩu mới.",
      validate: (value, values) => value === values.newPassword || "Mật khẩu nhập lại không khớp.",
    },
  };

  const open = () => {
    form.reset(DEFAULT_VALUES);
    dialogRef.current?.showModal();
  };

  // Không cho đóng khi đang gửi để người dùng thấy kết quả.
  const close = () => {
    if (!form.formState.isSubmitting) dialogRef.current?.close();
  };

  const submitPassword = async (values: ChangePasswordForm) => {
    try {
      await changePassword(values).unwrap();
      dialogRef.current?.close();
      form.reset(DEFAULT_VALUES);
      notifySuccess("Đã đổi mật khẩu.");
    } catch (error) {
      const message = getApiErrorMessage(error, "Không thể đổi mật khẩu.");
      const code = (error as { data?: { error?: { code?: string } } })?.data?.error?.code;
      const field = code ? FIELD_BY_ERROR_CODE[code] : undefined;
      if (field) form.setError(field, { message }, { shouldFocus: true });
      else notifyError(message);
    }
  };

  // Chỉ tạo handler validation khi nhận sự kiện, không đọc ref trong render.
  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submitPassword)(event);

  return { dialogRef, form, rules, open, close, submit };
}
