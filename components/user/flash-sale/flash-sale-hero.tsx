import styles from "./flash-sale.module.css";
import { Clock3, Flame, Zap } from "lucide-react";

type FlashSaleHeroProps = {
  endsAt: string | null;
  expired: boolean;
  parts: string[];
  totalItems: number;
  maxDiscount: number;
};

// Banner dành cho một đợt sale, chỉ công bố trạng thái khi backend có deadline.
export function FlashSaleHero({ endsAt, expired, parts, totalItems, maxDiscount }: FlashSaleHeroProps) {
  return (
    <section className={`${styles.saleHero} overflow-hidden rounded-xl text-main`}>
      <div className="flex flex-col gap-7 px-5 py-6 sm:px-8 sm:py-7 lg:flex-row lg:items-center lg:justify-between">
        {/* Tiêu đề sale và hướng dẫn khám phá sản phẩm. */}
        <div className="max-w-xl">
          <h1 className="flex items-center gap-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            <Flame className="size-8 shrink-0 sm:size-11" aria-hidden="true" />Flash Sale
          </h1>
          <p className="mt-4 text-base font-medium sm:text-lg">Chớp deal ngay. Đừng bỏ lỡ.</p>
          {!!endsAt && !expired && maxDiscount > 0 && <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-star px-3 py-2 text-sm font-bold text-main"><Zap className="size-4 fill-current" aria-hidden="true" />Giảm đến {maxDiscount}% trong đợt sale này</div>}
          <p className="mt-2 max-w-md text-sm leading-relaxed text-main">Chọn đúng phân loại bạn thích. Khám phá ưu đãi và số lượng còn lại của đợt sale hiện tại.</p>
        </div>
        {/* Đồng hồ dùng dữ liệu thời gian thực, không đọc thành thông báo mỗi giây. */}
        <div className="shrink-0 lg:border-l lg:border-main/20 lg:pl-10">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4" aria-hidden="true" />
            {endsAt ? expired ? "Đợt sale đã kết thúc" : "Ưu đãi kết thúc sau" : "Ưu đãi trong thời gian giới hạn"}
          </div>
          <div className="flex items-start gap-2" role="timer" aria-label={endsAt ? `Còn ${parts[0]} giờ ${parts[1]} phút ${parts[2]} giây` : "Chưa có thời gian kết thúc"}>
            {parts.map((part, index) => (
              <div key={index} className="flex items-start gap-2">
                {index > 0 && <span className="pt-2 text-3xl font-bold" aria-hidden="true">:</span>}
                <div className="text-center">
                  <span className="flex min-w-16 items-center justify-center rounded-lg bg-white px-3 py-2 font-heading text-3xl font-bold tabular-nums text-cta-hover sm:min-w-20 sm:text-4xl">{endsAt ? part : "—"}</span>
                  <span className="mt-2 block text-xs">{["Giờ", "Phút", "Giây"][index]}</span>
                </div>
              </div>
            ))}
          </div>
          {!!endsAt && !expired && <p className="mt-4 text-xs font-medium">{totalItems} phân loại đang tham gia đợt sale</p>}
        </div>
      </div>
    </section>
  );
}


