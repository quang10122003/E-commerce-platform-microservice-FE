import Link from "next/link";
import { BarChart3, RefreshCw } from "lucide-react";
import { Loading } from "@/components/ui";
import { getShopAnalyticsUrl } from "@/lib/utils/shop-analytics.utils";
import type { ShopAnalytics, ShopAnalyticsQuery } from "@/types/shop/analytics";
import { CancelReasons, OrderPipeline, ProcessingTime, TopProducts } from "./analytics-breakdowns";
import { AnalyticsOverviewCards } from "./analytics-overview-cards";
import { AnalyticsEmpty, AnalyticsPanel } from "./analytics-panel";
import { AnalyticsRangeFilter } from "./analytics-range-filter";
import { CashFlowChart } from "./cash-flow-chart";
import { OrdersByHourChart } from "./orders-by-hour-chart";
import { ShareDonut } from "./share-donut";

const PAYMENT_METHODS = { COD: { label: "Thanh toán khi nhận hàng", color: "#F59E0B" }, VNPAY: { label: "VNPay", color: "#4F46E5" } };
const PRICE_TYPES = { NORMAL: { label: "Giá thường", color: "#94A3B8" }, SALE: { label: "Flash Sale", color: "#FF5722" } };

interface ShopAnalyticsViewProps {
  // null khi URL chưa có khoảng thời gian; bộ lọc phía client sẽ tự đặt khoảng mặc định.
  query: ShopAnalyticsQuery | null;
  // null khi chưa có khoảng thời gian hoặc tải lỗi.
  analytics: ShopAnalytics | null;
}

// Trang doanh thu của shop: bộ lọc thời gian, thẻ tổng quan và các biểu đồ.
export function ShopAnalyticsView({ query, analytics }: ShopAnalyticsViewProps) {
  return (
    <div className="space-y-5 pb-12">
      <div>
        <h1 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Doanh Thu &amp; Tài Chính</h1>
        <p className="mt-1 text-xs text-slate-500">Dòng tiền đã về, dự kiến và đã mất của Shop theo khoảng thời gian</p>
      </div>

      <AnalyticsRangeFilter query={query} />

      {!query ? (
        <Loading dotsOnly label="Đang tải thống kê..." className="min-h-64" />
      ) : !analytics ? (
        <section className="flex flex-col items-center rounded-xl border border-slate-200 bg-white p-12 text-center">
          <RefreshCw className="mb-3 h-10 w-10 text-primary" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-slate-800">Chưa thể tải thống kê</h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500">Đã có lỗi khi kết nối. Hãy thử tải lại trang.</p>
          <Link href={getShopAnalyticsUrl(query)} className="mt-4 inline-flex h-9 items-center rounded-lg bg-cta px-4 text-xs font-semibold text-white transition-colors hover:bg-cta-hover active:scale-95">Thử lại</Link>
        </section>
      ) : (
        <AnalyticsContent analytics={analytics} />
      )}
    </div>
  );
}

function AnalyticsContent({ analytics }: { analytics: ShopAnalytics }) {
  const { overview } = analytics;
  const hasActivity = overview.placed.orderCount + overview.received.orderCount + overview.held.orderCount + overview.lost.orderCount > 0;
  if (!hasActivity) {
    return (
      <section className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
        <BarChart3 className="mb-3 h-12 w-12 text-slate-300" />
        <h3 className="text-sm font-bold text-slate-800">Chưa có đơn hàng trong khoảng thời gian này</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">Hãy chọn khoảng thời gian khác để xem thống kê.</p>
      </section>
    );
  }

  const paymentItems = analytics.byPaymentMethod.map((slice) => ({ ...PAYMENT_METHODS[slice.key], amount: slice.amount, orderCount: slice.orderCount }));
  const priceItems = analytics.byPriceType.map((slice) => ({ ...PRICE_TYPES[slice.key], amount: slice.amount, orderCount: slice.orderCount }));

  return (
    <>
      <AnalyticsOverviewCards analytics={analytics} />

      <AnalyticsPanel title="Dòng tiền theo thời gian" description="Theo ngày, tự gộp theo tháng khi khoảng dài. Giá trị đặt theo ngày đặt, đã về theo ngày giao xong, thanh toán online theo ngày trả, đã hủy theo ngày hủy">
        <CashFlowChart timeline={analytics.timeline} />
      </AnalyticsPanel>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnalyticsPanel title="Tiền theo chặng xử lý" description="Các đơn đặt trong kỳ, theo trạng thái hiện tại" className="md:col-span-2 lg:col-span-1">
          <OrderPipeline byStatus={analytics.byStatus} />
        </AnalyticsPanel>
        <AnalyticsPanel title="Phương thức thanh toán" description="Đơn chưa hủy đặt trong kỳ">
          {paymentItems.length > 0 ? <ShareDonut items={paymentItems} /> : <AnalyticsEmpty />}
        </AnalyticsPanel>
        <AnalyticsPanel title="Giá thường và Flash Sale" description="Đơn chưa hủy đặt trong kỳ">
          {priceItems.length > 0 ? <ShareDonut items={priceItems} /> : <AnalyticsEmpty />}
        </AnalyticsPanel>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <AnalyticsPanel title="Lý do hủy đơn" description="Đơn bị hủy trong kỳ, theo giá trị mất">
          <CancelReasons cancellations={analytics.cancellations} />
        </AnalyticsPanel>
        <AnalyticsPanel title="Khung giờ đặt hàng" description="Số đơn đặt theo giờ trong ngày">
          <OrdersByHourChart ordersByHour={analytics.ordersByHour} />
        </AnalyticsPanel>
      </div>

      <AnalyticsPanel title="Thời gian xử lý trung bình" description="Tính trên các đơn đặt trong kỳ đã đi hết từng chặng">
        <ProcessingTime processingTime={analytics.processingTime} />
      </AnalyticsPanel>

      <AnalyticsPanel title="Top sản phẩm bán chạy" description="10 sản phẩm doanh thu cao nhất từ đơn chưa hủy đặt trong kỳ">
        <TopProducts topProducts={analytics.topProducts} />
      </AnalyticsPanel>
    </>
  );
}
