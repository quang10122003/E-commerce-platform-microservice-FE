"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import administrativeUnits from "@/data/vietnam-administrative-units.json";

interface CheckoutAddressFields {
  province: string;
  ward: string;
  detail: string;
}

const emptyAddress: CheckoutAddressFields = { province: "", ward: "", detail: "" };

// Chỉ lưu địa chỉ đã xác nhận, xóa các trường phụ thuộc khi người mua đổi lựa chọn.
export function useCheckoutAddress() {
  // Giữ địa chỉ đã xác nhận để hiển thị và khôi phục khi mở lại form.
  const [address, setAddress] = useState<CheckoutAddressFields | null>(null);
  // Điều khiển thời điểm mở form địa chỉ.
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const form = useForm<CheckoutAddressFields>({ defaultValues: emptyAddress, mode: "onBlur" });
  const provinceName = useWatch({ control: form.control, name: "province" });
  const wardName = useWatch({ control: form.control, name: "ward" });
  const province = administrativeUnits.provinces.find((item) => item.name === provinceName);
  const wards = province?.wards ?? [];
  const hasWard = wards.includes(wardName);

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
  }, [isOpen]);

  // Mở lại bằng dữ liệu đã lưu, không giữ bản nháp người mua đã hủy.
  const open = () => {
    form.reset(address ?? emptyAddress);
    setIsOpen(true);
  };

  // Đóng form mà không thay địa chỉ đã xác nhận.
  const close = () => setIsOpen(false);

  const provinceField = form.register("province", {
    required: "Vui lòng chọn tỉnh/thành phố.",
    validate: (value) => administrativeUnits.provinces.some((item) => item.name === value) || "Vui lòng chọn tỉnh/thành phố trong danh sách.",
    onChange: () => {
      form.setValue("ward", "");
      form.setValue("detail", "");
      form.clearErrors(["ward", "detail"]);
    },
  });
  const wardField = form.register("ward", {
    required: "Vui lòng chọn xã/phường.",
    validate: (value) => wards.includes(value) || "Vui lòng chọn xã/phường thuộc tỉnh/thành phố đã chọn.",
    onChange: () => {
      form.setValue("detail", "");
      form.clearErrors("detail");
    },
  });
  const detailField = form.register("detail", {
    required: "Vui lòng nhập địa chỉ chi tiết.",
    validate: (value, values) => {
      if (!value.trim()) return "Vui lòng nhập địa chỉ chi tiết.";
      return `${value.trim()}, ${values.ward}, ${values.province}`.length <= 1000 || "Địa chỉ đầy đủ tối đa 1.000 ký tự.";
    },
  });

  // Lưu một địa chỉ chung cho checkout sau khi cả ba trường hợp lệ.
  const submit = form.handleSubmit((values) => {
    setAddress({ ...values, detail: values.detail.trim() });
    close();
  });

  return {
    addressText: address ? `${address.detail}, ${address.ward}, ${address.province}` : null,
    isOpen, open, close, dialogRef, submit, provinceField, wardField, detailField,
    provinces: administrativeUnits.provinces,
    wards, hasProvince: !!province, hasWard, errors: form.formState.errors,
  };
}
