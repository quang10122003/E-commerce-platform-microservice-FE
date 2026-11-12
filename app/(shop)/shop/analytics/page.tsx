import type { Metadata } from "next";
import { rethrowSessionRefreshRequired } from "@/lib/auth/session-recovery-error";
import { ShopAnalyticsView } from "@/components/shop/analytics/shop-analytics-view";
import { getShopAnalytics } from "@/lib/service/orderService";
import { parseShopAnalyticsQuery } from "@/lib/utils/shop-analytics.utils";
import type { ShopAnalytics } from "@/types/shop/analytics";

export const metadata: Metadata = {
  title: "Doanh thu & Tài chính | Kênh Người Bán",
  description: "Thống kê doanh thu, dòng tiền và đơn hàng tại Kênh Người Bán ModernShop",
};

interface ShopAnalyticsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Tải thống kê theo khoảng thời gian trên URL; lỗi tải giữ null để view hiện trạng thái thử lại.
export default async function ShopAnalyticsPage({ searchParams }: ShopAnalyticsPageProps) {
  const query = parseShopAnalyticsQuery(await searchParams);
  let analytics: ShopAnalytics | null = null;
  if (query) {
    try {
      analytics = await getShopAnalytics(query);
    } catch (error) {
      rethrowSessionRefreshRequired(error);
    }
  }

  return <ShopAnalyticsView query={query} analytics={analytics} />;
}
