import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { useShopFlashSaleItemEdit } from "@/hooks/shop/flash-sale/useShopFlashSaleItemEdit";

type Props = {
  itemId: number;
  originalPrice: number | null | undefined;
  editor: ReturnType<typeof useShopFlashSaleItemEdit>;
};

// Giữ giá đã đăng ký riêng với giá dự kiến, không hiển thị kết quả request cũ.
export function ShopFlashSaleItemPriceView({ itemId, originalPrice, editor }: Props) {
  if (!editor.discountChanged) {
    return <div className="w-40 lg:w-full lg:min-w-0">
      {originalPrice == null ? <span className="text-muted-foreground">—</span>
        : <span className="font-semibold tabular-nums text-cta">{formatCurrency(originalPrice)}</span>}
    </div>;
  }
  return (
    <div className="w-40 space-y-1.5 lg:w-full lg:min-w-0">
      <label htmlFor={`sale-preview-${itemId}`} className="text-xs text-muted-foreground">Giá sale dự kiến</label>
      <Input id={`sale-preview-${itemId}`} readOnly
        value={editor.salePrice == null ? "" : formatCurrency(editor.salePrice)}
        placeholder={editor.priceLoading ? "Đang tính..." : "—"}
        aria-busy={editor.priceLoading} className="min-w-0 px-2 tabular-nums text-cta" />
      {editor.missingVariant && <p className="text-xs text-danger">Chưa có mã phân loại để tính giá.</p>}
      {editor.priceError && <div role="alert" className="text-xs text-danger">
        <p>{editor.priceError}</p>
        <Button type="button" variant="link" size="sm" onClick={editor.retryPrice}>Thử lại</Button>
      </div>}
    </div>
  );
}
