import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { getSellerProductOverview } from "@/lib/service/productService";
import { getSellerOrderOverview } from "@/lib/service/orderService";
import { DashboardStats } from "./dashboard-stats";
import { DashboardTasks } from "./dashboard-tasks";
import { RecentOrders } from "./recent-orders";

// Hai nguồn tải độc lập: service nào lỗi thì khối đó hiện "—", phần còn lại vẫn hiển thị.
export default async function SellerDashboardPage() {
  const [ordersResult, productsResult] = await Promise.allSettled([getSellerOrderOverview(), getSellerProductOverview()]);
  for (const result of [ordersResult, productsResult]) {
    if (result.status === "rejected") rethrowSessionRefreshRequired(result.reason);
  }
  const orders = ordersResult.status === "fulfilled" ? ordersResult.value : null;
  const products = productsResult.status === "fulfilled" ? productsResult.value : null;

  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardStats orders={orders} products={products} />
      <DashboardTasks orders={orders} products={products} />
      <RecentOrders orders={orders} />
    </div>
  );
}
