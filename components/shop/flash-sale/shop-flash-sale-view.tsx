import type { ShopFlashSalePage, ShopFlashSaleQuery } from "@/types/shop/flash-sale";
import { ShopFlashSaleFilterDrawer } from "./shop-flash-sale-filter-drawer";
import { ShopFlashSaleFilters } from "./shop-flash-sale-filters";
import { ShopFlashSaleTable } from "./shop-flash-sale-table";

// Ghép bộ lọc và danh sách chương trình được tải từ server.
export function ShopFlashSaleView({
  data,
  query,
  error,
  now,
}: {
  data: ShopFlashSalePage;
  query: ShopFlashSaleQuery;
  error?: string;
  now: number;
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 sm:gap-5">
      {/* Bộ lọc trực tiếp trên desktop, panel trượt trên thiết bị nhỏ. */}
      <div className="hidden lg:block">
        <ShopFlashSaleFilters query={query} />
      </div>
      <ShopFlashSaleFilterDrawer query={query} />

      {/* Bảng danh sách chương trình Flash Sale */}
      <ShopFlashSaleTable data={data} query={query} error={error} now={now} />
    </div>
  );
}
