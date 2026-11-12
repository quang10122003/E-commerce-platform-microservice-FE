import type { Metadata } from "next";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { ShopOrdersView } from "@/components/shop/orders/shop-orders-view";
import { getShopOrders } from "@/lib/service/orderService";
import { parseShopOrderQuery } from "@/lib/utils/shop-order.utils";
import type { ShopOrder } from "@/types/shop/order";

export const metadata: Metadata = {
  title: "Quản lý Đơn hàng | Kênh Người Bán",
  description: "Theo dõi và xử lý đơn hàng tại Kênh Người Bán ModernShop",
};

interface ShopOrdersPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Tải đơn của shop theo bộ lọc trên URL; lỗi tải giữ null để view hiện trạng thái thử lại.
export default async function ShopOrdersPage({ searchParams }: ShopOrdersPageProps) {
  const query = parseShopOrderQuery(await searchParams);
  let orders: ShopOrder[] | null = null;
  try {
    orders = await getShopOrders(query);
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return <ShopOrdersView orders={orders} query={query} />;
}
