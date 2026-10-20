"use client";

import Image from "next/image";
import { formatCurrency } from "@/lib/utils";

export interface ChatProductPreview {
  productId: number;
  productName: string;
  image?: string | null;
  price: number;
}

interface ProductChatProductViewProps {
  product: ChatProductPreview;
  onSend?: () => void;
  disabled?: boolean;
  shared?: boolean;
  sharedLabel?: string;
}

// Dùng lại khối sản phẩm của UI mock cho phần ghim và tin nhắn gửi sản phẩm.
export function ProductChatProductView({ product, onSend, disabled, shared = false, sharedLabel = "Đã gửi thông tin sản phẩm" }: ProductChatProductViewProps) {
  return (
    <div className={shared ? "max-w-[85%] rounded-xl border border-primary/20 bg-white p-2.5 shadow-xs" : "flex shrink-0 items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-3 py-2"}>
      {/* Ghim thông tin sản phẩm đang xem. */}
      <div className="flex min-w-0 items-center gap-2.5">
        {product.image && (
          <div className={shared ? "relative h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-slate-100" : "relative h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white"}>
            <Image src={product.image} alt={product.productName} fill unoptimized sizes={shared ? "44px" : "40px"} className="object-cover" />
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-slate-800">{product.productName}</p>
          <p className="text-xs font-bold text-cta">{formatCurrency(product.price)}</p>
        </div>
      </div>
      {onSend && (
        <button type="button" onClick={onSend} disabled={disabled} className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary transition hover:bg-primary hover:text-white active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer">Gửi SP</button>
      )}
      {shared && <div className="mt-2 border-t border-slate-100 pt-1 text-center text-[10px] font-medium text-primary">{sharedLabel}</div>}
    </div>
  );
}

