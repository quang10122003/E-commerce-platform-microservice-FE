import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { OrdersView } from "@/components/user/orders/OrdersView";
import { getMyOrders } from "@/lib/service/orderService";
import { getOrdersUrl, parseOrderQuery } from "@/lib/utils/order.utils";
import type { UserOrderPage } from "@/types/user/order";

export const metadata: Metadata = {
  title: "Đơn mua | ModernShop",
};

interface OrdersPageProps {
  searchParams: Promise<{ status?: string | string[]; keyword?: string | string[]; page?: string | string[] }>;
}

// Trang đơn mua của người dùng, tải dữ liệu trên server theo trạng thái, từ khóa và trang trên URL.
export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const query = parseOrderQuery(await searchParams);
  let data: UserOrderPage | null = null;

  // Lỗi tải giữ data null để view hiện trạng thái thử lại; vẫn để redirect làm mới phiên đi qua.
  try {
    data = await getMyOrders(query);
  } catch (error) {
    rethrowSessionRefreshRequired(error);
  }

  // Trang vượt quá số trang (ví dụ link cũ sau khi hủy đơn) thì về trang cuối còn dữ liệu.
  if (data && data.totalPages > 0 && query.page > data.totalPages) {
    redirect(getOrdersUrl({ ...query, page: data.totalPages }));
  }

  return <OrdersView query={query} data={data} />;
}
