"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { useRegistrationCountdown } from "./useRegistrationCountdown";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { PRICE_PREVIEW_DEBOUNCE_MS } from "@/lib/constants";
import { skipToken } from "@reduxjs/toolkit/query";
import { usePreviewFlashSalePriceQuery, useRegisterFlashSaleItemMutation } from "@/lib/redux/services/flash-sale-api";
import { getApiErrorMessage } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/shared/useNotification";
import { useForm, useWatch } from "react-hook-form";

import type { FlashSaleRegistrationFields, ShopFlashSaleProduct, ShopFlashSaleCampaignDetail } from "@/types/shop/flash-sale";
import { formatProductOptionLabel, getRegistrationQuantityLimit, normalizeSearchText, isValidDiscountPercent, isRegistrationDeadlineOpen } from "@/lib/utils/flash-sale.utils";

// Quản lý validation, preview giá và gửi đăng ký qua service RTK Query.
export function useFlashSaleRegistration(campaignId: string, products: ShopFlashSaleProduct[], isModal = false, campaign?: ShopFlashSaleCampaignDetail, initialNow = 0) {
  const router = useRouter();
  const { notifySuccess, notifyError } = useNotification();
  const [registerItem, registration] = useRegisterFlashSaleItemMutation();
  // Khóa request ngay lập tức để chặn submit lặp trước khi React cập nhật trạng thái.
  const submittingRef = useRef(false);
  const currentNow = useRegistrationCountdown(initialNow);
  const registrationOpen = isRegistrationDeadlineOpen(campaign?.registrationDeadline, currentNow);
  // Giữ trạng thái mở danh sách gợi ý khi Shop đang tìm sản phẩm.
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const form = useForm<FlashSaleRegistrationFields>({ defaultValues: { productName: "", variantId: "", discountPercent: 20, registeredQuantity: 1 } });

  // Xóa phản hồi cũ khi Shop bắt đầu chỉnh sửa một đăng ký mới.
  const clearRegistrationFeedback = () => {
    if (submittingRef.current) return;
    registration.reset();
    form.clearErrors("root.registration");
  };

  // Theo dõi sản phẩm để chỉ mở lựa chọn phân loại phù hợp.
  const productName = useWatch({ control: form.control, name: "productName" });
  const selectedProduct = products.find(product => formatProductOptionLabel(product) === productName);
  const matchingProducts = products.filter(product =>
    normalizeSearchText(product.name).includes(normalizeSearchText(productName)));
  const showSuggestions = suggestionsOpen && !selectedProduct;
  const productSelected = selectedProduct?.status === "ACTIVE";
  const variantId = useWatch({ control: form.control, name: "variantId" });
  const selectedVariant = selectedProduct?.variants.find(variant => String(variant.id) === variantId);
  const quantityLimit = selectedVariant ? getRegistrationQuantityLimit(selectedVariant.stockQuantity) : 0;

  // Chỉ gửi request khi đủ sản phẩm, phân loại thuộc sản phẩm và mức giảm hợp lệ.
  const discountPercent = useWatch({ control: form.control, name: "discountPercent" });
  const canPreview = productSelected && !!selectedVariant && isValidDiscountPercent(discountPercent);
  // Debounce toàn bộ khóa request để không gọi API khi input còn thay đổi.
  const previewKey = canPreview ? `${selectedVariant.id}:${discountPercent}` : null;
  const stablePreviewKey = useDebouncedValue(previewKey, PRICE_PREVIEW_DEBOUNCE_MS);
  const previewReady = canPreview && previewKey === stablePreviewKey;
  const preview = usePreviewFlashSalePriceQuery(previewReady
    ? { variantId: selectedVariant.id, discountPercent } : skipToken,
    { refetchOnMountOrArgChange: true });
  // currentData chỉ thuộc bộ input hiện tại, không dùng giá của request trước.
  const salePrice = previewReady && !preview.isFetching && preview.currentData?.success
    ? preview.currentData.data?.salePrice : undefined;
  const priceLoading = canPreview && (!previewReady || preview.isFetching);
  const priceError = !previewReady ? undefined : preview.error
    ? getApiErrorMessage(preview.error, "Không thể tính giá sale. Vui lòng thử lại.")
    : preview.currentData && (!preview.currentData.success || !preview.currentData.data)
      ? preview.currentData.message || "Không thể tính giá sale. Vui lòng thử lại." : undefined;
  const retryPrice = () => { if (previewReady) void preview.refetch(); };

  // Kiểm tra lựa chọn thực tế thay vì chấp nhận tên sản phẩm tự nhập.
  const validateProduct = (value: string) => {
    const product = products.find(item => formatProductOptionLabel(item) === value);
    return !product ? "Vui lòng chọn sản phẩm trong danh sách gợi ý."
      : product.status !== "ACTIVE" ? "Sản phẩm đang ẩn hoặc hết hàng, không thể đăng ký."
      : true;
  };
  const validateQuantity = (value: number) =>
    (Number.isInteger(value) && value >= 1 && value <= quantityLimit)
      || `Nhập số nguyên từ 1 đến ${quantityLimit}, sau khi chọn phân loại còn đủ tồn kho.`;

  // Giữ mức giảm trong khoảng 1–99 ngay khi nhập, cho phép xóa trống để nhập lại.
  const changeDiscount = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (!raw) return;
    const value = Number(raw);
    if (!Number.isFinite(value)) return;
    const bounded = Math.min(99, Math.max(1, value));
    if (bounded !== value) {
      form.setValue("discountPercent", bounded, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Chặn số lượng vượt một nửa tồn kho, giữ trống để Shop có thể nhập lại.
  const changeQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.value || quantityLimit < 1) return;
    const value = Number(event.target.value);
    if (!Number.isFinite(value)) return;
    const bounded = Math.min(quantityLimit, Math.max(1, Math.floor(value)));
    if (bounded !== value) {
      form.setValue("registeredQuantity", bounded, { shouldDirty: true, shouldValidate: true });
    }
  };

  // Điều chỉnh số lượng khi chuyển sang phân loại có giới hạn thấp hơn.
  const changeVariant = (event: ChangeEvent<HTMLSelectElement>) => {
    const variant = selectedProduct?.variants.find(item => String(item.id) === event.target.value);
    if (!variant) return;
    const limit = getRegistrationQuantityLimit(variant.stockQuantity);
    const quantity = form.getValues("registeredQuantity");
    if (limit > 0 && Number.isFinite(quantity) && quantity > limit) {
      form.setValue("registeredQuantity", limit, { shouldDirty: true });
      form.clearErrors("registeredQuantity");
    }
  };

  // Xóa phân loại cũ khi Shop thay đổi sản phẩm.
  const changeProduct = () => {
    clearRegistrationFeedback();
    setSuggestionsOpen(true);
    form.setValue("variantId", "", { shouldValidate: false });
    form.clearErrors("variantId");
  };

  // Chọn chính xác sản phẩm bằng ID trong nhãn, kể cả khi trùng tên.
  const selectProduct = (product: ShopFlashSaleProduct) => {
    changeProduct();
    form.setValue("productName", formatProductOptionLabel(product), { shouldValidate: true });
    setSuggestionsOpen(false);
  };
  const openSuggestions = () => setSuggestionsOpen(true);
  // Giữ danh sách mở khi focus chuyển từ input sang một gợi ý.
  const blurSuggestions = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setSuggestionsOpen(false);
  };

  // Popup quay về lịch sử để giữ bộ lọc; trang trực tiếp quay về danh sách.
  const close = () => { if (isModal) router.back(); else router.push("/shop/flash-sales"); };
  // Tải lại dữ liệu Server Component khi API thất bại.
  const retry = () => router.refresh();
  // Gửi thông số đăng ký; backend tự quyết định giá sale và kiểm tra nghiệp vụ.
  const submitRegistration = async (values: FlashSaleRegistrationFields) => {
    if (submittingRef.current) return;
    // Kiểm tra lại đồng hồ ngay lúc submit, không dựa vào tick hiển thị gần nhất.
    if (!isRegistrationDeadlineOpen(campaign?.registrationDeadline)) {
      form.setError("root.registration", { message: campaign
        ? "Chương trình đã hết hạn đăng ký." : "Chưa tải được hạn đăng ký. Vui lòng thử lại." });
      return;
    }
    form.clearErrors("root.registration");
    if (!/^\d+$/.test(campaignId) || !Number.isSafeInteger(Number(campaignId)) || Number(campaignId) <= 0) {
      form.setError("root.registration", { message: "Chưa chọn chương trình đăng ký hợp lệ." });
      return;
    }
    if (!productSelected || !selectedVariant || String(selectedVariant.id) !== values.variantId) {
      form.setError("variantId", { message: "Vui lòng chọn phân loại thuộc sản phẩm đang bán." });
      return;
    }
    submittingRef.current = true;
    try {
      await registerItem({ campaignId, request: {
        variantId: selectedVariant.id,
        discountPercent: values.discountPercent,
        registeredQuantity: values.registeredQuantity,
      } }).unwrap();
      notifySuccess("Đăng ký sản phẩm vào Flash Sale thành công.");
      // Xóa lựa chọn đã gửi và tải lại snapshot để đăng ký tiếp không dùng dữ liệu cũ.
      form.reset();
      setSuggestionsOpen(false);
      router.refresh();
    } catch (error) {
      const message = getApiErrorMessage(error, "Không thể đăng ký sản phẩm. Vui lòng thử lại.");
      notifyError(message);
    } finally {
      submittingRef.current = false;
    }
  };
  // Chỉ tạo handler validation khi nhận sự kiện, không đọc khóa request trong render.
  const submit = (event: FormEvent<HTMLFormElement>) => form.handleSubmit(submitRegistration)(event);
  return { form, close, retry, submit, registrationSuccessful: registration.isSuccess, clearRegistrationFeedback, productSelected, changeProduct, selectedProduct, selectedVariant, quantityLimit, validateProduct, validateQuantity, changeDiscount, changeQuantity, changeVariant, matchingProducts, showSuggestions, selectProduct, openSuggestions, blurSuggestions, salePrice, priceLoading, priceError, retryPrice, registrationOpen };
}
