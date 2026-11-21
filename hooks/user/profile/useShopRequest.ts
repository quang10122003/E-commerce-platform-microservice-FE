"use client";

import { useRef, useState, type FormEvent } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useProvinces, useWards } from "@/hooks/shared/useProvinces";
import {
  useCancelShopRequestMutation, useCreateShopRequestMutation, useGetMyLatestShopRequestQuery,
} from "@/lib/redux/services/user-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CreateShopRequestForm } from "@/types/user/shop-request";
import { normalizePhone, PHONE_PATTERN } from "@/utils/phone.utils";

const DEFAULT_VALUES: CreateShopRequestForm = {
  shopName: "", shopDescription: "", shopPhone: "", provinceName: "", ward: "", addressDetail: "",
};

// Popup đăng ký mở shop: xem đơn gần nhất, nộp đơn mới hoặc hủy đơn đang chờ duyệt.
export function useShopRequest() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { notifySuccess, notifyError } = useNotification();
  const latestQuery = useGetMyLatestShopRequestQuery(undefined, { skip: !isOpen });
  const [createShopRequest] = useCreateShopRequestMutation();
  const [cancelShopRequest, { isLoading: isCancelling }] = useCancelShopRequestMutation();
  const latest = latestQuery.data?.success ? latestQuery.data.data ?? null : null;
  const form = useForm<CreateShopRequestForm>({ defaultValues: DEFAULT_VALUES, mode: "onBlur" });
  // Bắt buộc dùng danh sách tỉnh từ API vì cần mã tỉnh để product-service lọc sản phẩm theo tỉnh.
  const { provinces, failed: provincesFailed } = useProvinces(isOpen);
  const provinceName = useWatch({ control: form.control, name: "provinceName" });
  const wardName = useWatch({ control: form.control, name: "ward" });
  const province = provinces?.find((item) => item.name === provinceName);
  const { wards, failed: wardsFailed } = useWards(province);

  const open = () => {
    form.reset(DEFAULT_VALUES);
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const close = () => {
    if (form.formState.isSubmitting || isCancelling) return;
    dialogRef.current?.close();
    setIsOpen(false);
  };

  const rules = {
    shopName: {
      validate: (value: string) => {
        if (!value.trim()) return "Vui lòng nhập tên shop.";
        return value.trim().length <= 100 || "Tên shop tối đa 100 ký tự.";
      },
    },
    shopDescription: {
      validate: (value: string) => value.trim().length <= 2000 || "Mô tả shop tối đa 2000 ký tự.",
    },
    shopPhone: {
      required: "Vui lòng nhập số điện thoại.",
      validate: (value: string) => PHONE_PATTERN.test(normalizePhone(value)) || "Số điện thoại không hợp lệ.",
    },
    provinceName: {
      required: "Vui lòng chọn tỉnh/thành phố.",
      validate: (value: string) => provinces?.some((item) => item.name === value) || "Vui lòng chọn tỉnh/thành phố trong danh sách.",
      onChange: () => {
        form.setValue("ward", "");
        form.clearErrors("ward");
      },
    },
    ward: {
      required: "Vui lòng chọn xã/phường.",
      validate: (value: string) => wards.includes(value) || "Vui lòng chọn xã/phường thuộc tỉnh/thành phố đã chọn.",
    },
    addressDetail: {
      validate: (value: string) => {
        if (!value.trim()) return "Vui lòng nhập địa chỉ chi tiết.";
        return value.trim().length <= 255 || "Địa chỉ chi tiết tối đa 255 ký tự.";
      },
    },
  };

  const submitRequest = async (values: CreateShopRequestForm) => {
    if (!province) return;
    try {
      await createShopRequest({
        shopName: values.shopName.trim(),
        shopDescription: values.shopDescription.trim() || null,
        shopPhone: normalizePhone(values.shopPhone),
        provinceCode: province.code,
        provinceName: province.name,
        ward: values.ward,
        addressDetail: values.addressDetail.trim(),
      }).unwrap();
      form.reset(DEFAULT_VALUES);
      notifySuccess("Đã gửi đơn đăng ký mở shop, vui lòng chờ quản trị viên duyệt.");
    } catch (error) {
      form.setError("root", { message: getApiErrorMessage(error, "Không thể gửi đơn đăng ký mở shop.") });
    }
  };

  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submitRequest)(event);

  const cancel = async () => {
    if (!latest || !window.confirm("Hủy đơn đăng ký mở shop đang chờ duyệt?")) return;
    try {
      await cancelShopRequest(latest.id).unwrap();
      notifySuccess("Đã hủy đơn đăng ký mở shop.");
    } catch (error) {
      notifyError(getApiErrorMessage(error, "Không thể hủy đơn đăng ký mở shop."));
    }
  };

  return {
    dialogRef, open, close, form, rules, submit, cancel, isCancelling,
    latest, isLoadingLatest: latestQuery.isLoading, latestError: latestQuery.isError,
    provinces, provincesFailed: !provinces && provincesFailed, wards, wardsFailed,
    hasProvince: !!province, hasWard: wards.includes(wardName),
  };
}
