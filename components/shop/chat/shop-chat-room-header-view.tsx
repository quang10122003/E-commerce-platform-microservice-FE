"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Package, X } from "lucide-react";
import type { ShopChatConversation } from "@/types/shop/chat";
import { ChatCustomerAvatarView } from "./chat-customer-avatar-view";
import { useProductPriceRange } from "@/hooks/shared/useProductPriceRange";
import { ChatProductPriceView } from "@/components/shared/chat/ChatProductPriceView";

interface ShopChatRoomHeaderViewProps {
  customerName: string;
  conversation: ShopChatConversation | null;
  onBack: () => void;
  onClose: () => void;
}

// Thanh header hội thoại hiển thị thông tin khách hàng, sản phẩm liên kết và các nút thao tác.
export function ShopChatRoomHeaderView({
  customerName,
  conversation,
  onBack,
  onClose,
}: ShopChatRoomHeaderViewProps) {
  // Lấy khoảng giá của sản phẩm đang trao đổi trong cuộc hội thoại
  const { productPrice, priceLoading } = useProductPriceRange(conversation?.productId);

  return (
    // Header chính với hiệu ứng kính mờ nhẹ và đường viền sắc nét
    <header className="flex min-h-16 shrink-0 items-center justify-between gap-2.5 border-b border-slate-200/90 bg-white/95 px-3 py-2.5 backdrop-blur-xs sm:px-4">
      {/* Cụm thông tin khách hàng và nút quay lại trên di động */}
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {/* Nút quay lại danh sách trên giao diện mobile */}
        <button
          type="button"
          onClick={onBack}
          aria-label="Quay lại hộp thư"
          className="flex size-8.5 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs transition-all hover:bg-slate-50 hover:text-primary active:scale-95 md:hidden focus-visible:outline-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
        </button>

        {/* Avatar khách hàng */}
        <ChatCustomerAvatarView className="size-9 sm:size-10 shrink-0" />

        {/* Tên khách hàng */}
        <div className="min-w-0">
          <h2 title={customerName} className="truncate text-xs sm:text-sm font-bold text-slate-800">
            {customerName}
          </h2>
        </div>
      </div>

      {/* Thẻ xem nhanh thông tin sản phẩm đang được trao đổi */}
      {conversation && (
        <Link
          href={`/products/${conversation.productId}`}
          aria-label={`Xem sản phẩm: ${conversation.productName || `Sản phẩm #${conversation.productId}`}`}
          title={conversation.productName || `Sản phẩm #${conversation.productId}`}
          className="group flex min-w-0 max-w-[190px] sm:max-w-xs items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/70 p-1.5 transition-all hover:border-primary/40 hover:bg-white hover:shadow-2xs active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-primary"
        >
          {/* Ảnh thu nhỏ của sản phẩm */}
          <div className="relative size-8.5 sm:size-9.5 shrink-0 overflow-hidden rounded-lg border border-slate-200/80 bg-white">
            {conversation.productImageUrl ? (
              <Image
                src={conversation.productImageUrl}
                alt=""
                width={38}
                height={38}
                unoptimized
                className="size-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-slate-100 text-slate-400">
                <Package className="size-4" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Tên sản phẩm và khoảng giá */}
          <div className="min-w-0 flex-1 pr-0.5">
            <p className="truncate text-[11px] sm:text-xs font-semibold text-slate-800 transition-colors group-hover:text-primary">
              {conversation.productName || `Sản phẩm #${conversation.productId}`}
            </p>
            <ChatProductPriceView price={productPrice} loading={priceLoading} />
          </div>

          {/* Biểu tượng chuyển hướng xem sản phẩm */}
          <div className="hidden sm:flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors group-hover:bg-indigo-50 group-hover:text-primary">
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </div>
        </Link>
      )}

      {/* Cụm công cụ điều khiển cuộc trò chuyện */}
      <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
        {/* Nút đóng hội thoại trên desktop */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng hội thoại"
          title="Đóng hội thoại"
          className="hidden size-8.5 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-2xs transition-all hover:bg-slate-50 hover:text-rose-600 active:scale-95 md:flex focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </header>
  );
}
