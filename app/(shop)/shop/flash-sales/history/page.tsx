import { History, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export default function ShopFlashSaleHistoryPage() {
  return (
    <div className="space-y-6">
      {/* Tiêu đề giúp Shop nhận biết khu vực theo dõi đăng ký Flash Sale. */}
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-rose-500 text-white">
          <History className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Lịch sử Flash Sale của tôi</h1>
          <p className="mt-1 text-sm text-slate-600">Theo dõi các sản phẩm bạn đã đăng ký tham gia chương trình.</p>
        </div>
      </div>

      {/* Trạng thái tạm thời khi API lịch sử chưa được triển khai. */}
      <Card className="border-slate-200/90">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-orange-500" />
            <CardTitle>Chưa có dữ liệu lịch sử</CardTitle>
          </div>
          <CardDescription>Lịch sử sản phẩm đăng ký sẽ hiển thị tại đây khi được kết nối với API.</CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}