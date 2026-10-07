import { FIRST_PAGE, PAGE_SIZE } from "@/lib/constants";
import { ShopFlashSaleView } from "@/components/shop/flash-sale/shop-flash-sale-view";
import { FlashSaleApiError, getShopFlashSales } from "@/lib/service/flashSaleService";
import type { ShopFlashSalePage, ShopFlashSaleQuery } from "@/types/shop/flash-sale";

type PageProps = { searchParams: Promise<{ page?: string; from?: string; to?: string; registrationOpen?: string }> };

// Tải danh sách thật theo URL ở Server Component, không truyền token xuống client.
export default async function ShopFlashSalePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const requestedPage = Number(params.page ?? FIRST_PAGE);
  const query: ShopFlashSaleQuery = {
    page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : FIRST_PAGE,
    from: params.from || undefined,
    to: params.to || undefined,
    registrationOpen: params.registrationOpen === "true" ? true : params.registrationOpen === "false" ? false : undefined,
  };
  let data: ShopFlashSalePage = { items: [], page: query.page, pageSize: PAGE_SIZE.SHOP_FLASH_SALES, totalItems: 0, totalPages: 0 };
  let error: string | undefined;
  let now = 0;
  try {
    const result = await getShopFlashSales(query);
    data = result.data;
    now = result.now;
  } catch (cause) {
    // Ưu tiên message backend; lỗi kết nối hoặc framework dùng thông báo dự phòng.
    error = cause instanceof FlashSaleApiError
      ? cause.message
      : "Không thể tải danh sách chương trình. Vui lòng thử lại.";
  }
  return <ShopFlashSaleView key={JSON.stringify(query)} data={data} query={query} error={error} now={now} />;
}
