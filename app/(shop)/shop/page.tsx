import { DashboardStats } from "./dashboard-stats";
import { DashboardTasks } from "./dashboard-tasks";
import { RecentOrders } from "./recent-orders";

export default function SellerDashboardPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <DashboardStats />
      <DashboardTasks />
      <RecentOrders />
    </div>
  );
}
