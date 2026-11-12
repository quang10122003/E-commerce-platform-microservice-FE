import type { Metadata } from "next";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { OrdersView } from "@/components/user/orders/OrdersView";
import { getMyOrders } from "@/lib/service/orderService";
import { parseOrderQuery } from "@/lib/utils/order.utils";
import type { UserOrder } from "@/types/user/order";

export const metadata: Metadata = {
  title: "Đơn mua | ModernShop",
};

interface OrdersPageProps {
  searchParams: Promise<{ status?: string | string[] }>;
}

// Trang đơn mua của người dùng, tải dữ liệu trên server theo tab trạng thái trên URL.
export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const query = parseOrderQuery(await searchParams);
  let data: UserOrder[] | null = null;

  // Lỗi tải giữ data null để view hiện trạng thái thử lại; vẫn để redirect làm mới phiên đi qua.
  try {
    data = await getMyOrders(query);
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  return <OrdersView query={query} data={data} />;
}
