"use client";

// Hàng đợi FIFO trong phiên bóng chat; không lưu bền vững và không thêm trường vào payload BE.
export { useChatMessageQueue as useProductChatQueue } from "@/hooks/shared/useChatMessageQueue";
