"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNotification } from "@/hooks/shared/useNotification";
import { useProvinces, useWards } from "@/hooks/shared/useProvinces";
import {
  useCreateAddressMutation, useDeleteAddressMutation, useGetMyAddressesQuery, useSetDefaultAddressMutation,
} from "@/lib/redux/services/user-api";
import { getApiErrorMessage } from "@/lib/utils";
import type { CreateAddressRequest, UserAddress } from "@/types/user/address";
import { normalizePhone, PHONE_PATTERN } from "@/utils/phone.utils";

const emptyAddress: CreateAddressRequest = { recipientName: "", phone: "", province: "", ward: "", detail: "" };

function formatAddress(address: UserAddress) {
  return `${address.recipientName} - ${address.phone}, ${address.detail}, ${address.ward}, ${address.province}`;
}

// Sổ địa chỉ dùng chung cho checkout và hồ sơ; checkout dùng địa chỉ mặc định cho tới khi người mua chọn địa chỉ khác.
export function useCheckoutAddress() {
  const addressesQuery = useGetMyAddressesQuery();
  const [createAddress] = useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [setDefaultAddress] = useSetDefaultAddressMutation();
  const { notifyError } = useNotification();
  const [pendingId, setPendingId] = useState<number | null>(null);
  const addresses = addressesQuery.data?.success ? addressesQuery.data.data ?? [] : [];
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const address = addresses.find((item) => item.id === selectedId) ?? addresses.find((item) => item.defaultAddress) ?? null;
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const form = useForm<CreateAddressRequest>({ defaultValues: emptyAddress, mode: "onBlur" });
  const provinceName = useWatch({ control: form.control, name: "province" });
  const wardName = useWatch({ control: form.control, name: "ward" });
  const { provinces, failed: provincesFailed } = useProvinces(isOpen);
  const province = provinces?.find((item) => item.name === provinceName);
  const { wards, failed: wardsFailed } = useWards(province);
  const hasWard = wards.includes(wardName);

  useEffect(() => {
    if (isOpen) dialogRef.current?.showModal();
  }, [isOpen]);

  const open = () => {
    setIsCreating(false);
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  const runAction = async (id: number, action: () => Promise<unknown>, fallback: string) => {
    setPendingId(id);
    try {
      await action();
    } catch (error) {
      notifyError(getApiErrorMessage(error, fallback));
    } finally {
      setPendingId(null);
    }
  };

  const remove = (item: UserAddress) => {
    if (!window.confirm(`Xóa địa chỉ "${formatAddress(item)}"? Thao tác này không thể hoàn tác.`)) return;
    void runAction(item.id, () => deleteAddress(item.id).unwrap(), "Không thể xóa địa chỉ.");
  };

  const makeDefault = (id: number) =>
    void runAction(id, () => setDefaultAddress(id).unwrap(), "Không thể đặt địa chỉ mặc định.");

  const select = (id: number) => {
    setSelectedId(id);
    close();
  };

  // Không giữ bản nháp của lần tạo trước.
  const startCreate = () => {
    form.reset(emptyAddress);
    setIsCreating(true);
  };

  const cancelCreate = () => setIsCreating(false);

  const recipientNameField = form.register("recipientName", {
    validate: (value) => {
      if (!value.trim()) return "Vui lòng nhập tên người nhận.";
      return value.trim().length <= 50 || "Tên người nhận tối đa 50 ký tự.";
    },
  });
  const phoneField = form.register("phone", {
    required: "Vui lòng nhập số điện thoại.",
    validate: (value) => PHONE_PATTERN.test(normalizePhone(value)) || "Số điện thoại không hợp lệ.",
  });

  const provinceField = form.register("province", {
    required: "Vui lòng chọn tỉnh/thành phố.",
    validate: (value) => provinces?.some((item) => item.name === value) || "Vui lòng chọn tỉnh/thành phố trong danh sách.",
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
    validate: (value) => {
      if (!value.trim()) return "Vui lòng nhập địa chỉ chi tiết.";
      return value.trim().length <= 255 || "Địa chỉ chi tiết tối đa 255 ký tự.";
    },
  });

  // Tạo xong quay về danh sách; danh sách tự tải lại nhờ invalidate tag Address.
  const submit = form.handleSubmit(async (values) => {
    try {
      await createAddress({
        recipientName: values.recipientName.trim(), phone: normalizePhone(values.phone), province: values.province,
        ward: values.ward, detail: values.detail.trim(),
      }).unwrap();
      setIsCreating(false);
    } catch (error) {
      form.setError("root", { message: getApiErrorMessage(error, "Không thể tạo địa chỉ.") });
    }
  });

  return {
    addressText: address ? formatAddress(address) : null,
    // Tên và số điện thoại gửi bằng trường riêng nên địa chỉ giao hàng chỉ gồm chi tiết, xã, tỉnh.
    shippingAddress: address ? `${address.detail}, ${address.ward}, ${address.province}` : null,
    addressRecipientName: address?.recipientName ?? null,
    addressPhone: address?.phone ?? null,
    addresses, selectedAddressId: address?.id ?? null, addressesLoading: addressesQuery.isLoading,
    addressesError: addressesQuery.isError, formatAddress,
    isOpen, open, close, select, remove, makeDefault, pendingId, isCreating, startCreate, cancelCreate, isSubmitting: form.formState.isSubmitting,
    dialogRef, submit, recipientNameField, phoneField, provinceField, wardField, detailField,
    provinces: provinces ?? [], provincesLoading: !provinces && !provincesFailed, provincesFailed: !provinces && provincesFailed,
    wards, wardsFailed, hasProvince: !!province, hasWard, errors: form.formState.errors,
  };
}
