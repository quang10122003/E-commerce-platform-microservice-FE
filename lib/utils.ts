import type { ApiResponse } from "@/types/common";
import type { ServerFetchResult } from "@/lib/api/server-client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Gộp các class Tailwind CSS an toàn, tránh xung đột class
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Định dạng số tiền VNĐ chuẩn (ví dụ: 150000 -> "150.000 ₫")
 */
export function formatCurrency(amount: number | string): string {
  const numericAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(numericAmount)) return "0 ₫";
  
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/** Định dạng số tiền trong input bằng dấu chấm phân tách hàng nghìn. */
export function formatNumberInput(value: number | string): string {
  const digits = String(value).replace(/\D/g, "");
  if (!digits) return "";

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(Number(digits));
}

/** Chuyển giá trị tiền đã định dạng về số nguyên để lưu và gửi API. */
export function parseNumberInput(value: number | string): number {
  const digits = String(value).replace(/\D/g, "");
  return digits ? Number(digits) : 0;
}

/**
 * Rút gọn số lượng (ví dụ: 1200 -> "1.2k", 15000 -> "15k")
 */
export function formatCompactNumber(number: number): string {
  return new Intl.NumberFormat("vi-VN", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
}

/**
 * Trích xuất thông báo lỗi chi tiết từ backend (ApiResponse hoặc RTK Query error)
 */
export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Đã có lỗi xảy ra. Vui lòng thử lại."
): string {
  if (!error) return fallbackMessage;

  // Lỗi từ RTK Query unwrap() chứa data là ApiResponse
  if (typeof error === "object" && error !== null) {
    const errorObj = error as Record<string, unknown>;

    // Kiểm tra err.data trả về từ backend
    if (errorObj.data && typeof errorObj.data === "object") {
      const dataObj = errorObj.data as Record<string, unknown>;
      if (typeof dataObj.message === "string" && dataObj.message.trim()) {
        return dataObj.message;
      }
      if (
        dataObj.error &&
        typeof dataObj.error === "object" &&
        typeof (dataObj.error as Record<string, unknown>).message === "string"
      ) {
        return (dataObj.error as Record<string, unknown>).message as string;
      }
    }

    // Nếu backend trả về chuỗi text trực tiếp trong data
    if (typeof errorObj.data === "string" && errorObj.data.trim()) {
      return errorObj.data;
    }

    // Lỗi có trường message ở root (ApiResponse hoặc Error instance)
    if (typeof errorObj.message === "string" && errorObj.message.trim()) {
      return errorObj.message;
    }

    // Lỗi mạng từ RTK Query (error.error)
    if (typeof errorObj.error === "string" && errorObj.error.trim()) {
      return errorObj.error;
    }
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  return fallbackMessage;
}

// Đọc thông báo lỗi từ kết quả serverFetch hoặc ApiResponse của server service.
export function getFetchServiceErrorMessage(
  result: unknown,
  fallbackMessage = "Không thể tải dữ liệu từ máy chủ."
): string {
  if (isServerFetchResult(result)) {
    const payloadMessage = getApiErrorMessage(result.payload, "");
    if (payloadMessage) return payloadMessage;

    if (typeof result.status === "number" && result.status >= 400) {
      return `Backend trả về HTTP ${result.status} ${fallbackMessage}`;
    }

    return fallbackMessage;
  }

  return getApiErrorMessage(result, fallbackMessage);
}

// type data return sau khi fetch
export type ResolvedFetchField<T> = {
  data: T | null;
  error: string | null;
};

// Chuẩn hóa kết quả từng request để dữ liệu và lỗi được xử lý độc lập.
export function resolveProductCatalogField<T>(
  result: PromiseSettledResult<ServerFetchResult<T>>,
): ResolvedFetchField<T> {
  if (result.status === "rejected") {
    return {
      data: null,
      error: getFetchServiceErrorMessage(result.reason),
    };
  }

  if (!result.value.payload.success || result.value.payload.data === null) {
    return {
      data: null,
      error: getFetchServiceErrorMessage(result.value),
    };
  }

  return { data: result.value.payload.data, error: null };
}

// Kiểm tra kết quả có đúng cấu trúc trả về của serverFetch hay không.
function isServerFetchResult(
  result: unknown,
): result is { payload: ApiResponse<unknown>; status: number } {
  if (typeof result !== "object" || result === null) {
    return false;
  }

  const resultObject = result as Record<string, unknown>;
  return (
    typeof resultObject.status === "number" &&
    typeof resultObject.payload === "object" &&
    resultObject.payload !== null
  );
}