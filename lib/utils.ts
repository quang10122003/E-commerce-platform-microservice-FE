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
