import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Package, Tag } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { formatVariantAttributes } from "@/lib/utils/order.utils";
import type { UserOrderItem } from "@/types/user/order";

// Một dòng sản phẩm trong đơn: hiển thị ảnh, tên sản phẩm, phân loại, số lượng và đơn giá.
export function OrderItemView({ item }: { item: UserOrderItem }) {
  const discounted = item.originalUnitPrice > item.unitPrice;
  const variantAttributes = formatVariantAttributes(item.variantAttributes);

  return (
    <Link
      href={`/products/${item.productId}`}
      className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-slate-50/80 sm:gap-4 sm:px-5 sm:py-4"
    >
      {/* Thumbnail sản phẩm */}
      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 sm:size-20">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            unoptimized
            sizes="80px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Package className="absolute inset-0 m-auto size-7 text-slate-400" aria-hidden="true" />
        )}
      </div>

      {/* Thông tin sản phẩm */}
      <div className="flex min-w-0 flex-1 flex-col justify-between gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-xs sm:text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors">
            {item.productName}
          </h3>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            {variantAttributes && (
              <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                <Tag className="size-3 text-slate-400" />
                {variantAttributes}
              </span>
            )}
            <span className="text-xs font-medium text-slate-500">
              Số lượng: <span className="font-semibold text-slate-700">x{item.quantity}</span>
            </span>
          </div>
        </div>

        {/* Đơn giá và giá khuyến mãi */}
        <div className="flex shrink-0 items-baseline gap-2 sm:flex-col sm:items-end sm:gap-0.5">
          {discounted && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(item.originalUnitPrice)}
            </span>
          )}
          <span className="text-sm sm:text-base font-bold text-cta">
            {formatCurrency(item.unitPrice)}
          </span>
          {item.quantity > 1 && (
            <span className="hidden text-[11px] text-slate-500 sm:inline">
              Tổng: {formatCurrency(item.totalAmount)}
            </span>
          )}
        </div>
      </div>

      {/* Mũi tên dẫn hướng sang trang chi tiết sản phẩm */}
      <ChevronRight className="hidden size-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-600 sm:block" />
    </Link>
  );
}
