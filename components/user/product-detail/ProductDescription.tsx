"use client";

import { cn } from "@/lib/utils";
import { RichTextNodes } from "@/components/shared/RichTextNodes";

import { useProductDescription } from "@/hooks/user/product-detail/useProductDescription";

// Tab mô tả chi tiết sản phẩm với khả năng mở rộng / thu gọn nội dung.
export function ProductDescription() {
  const { isExpanded, hasOverflow, contentRef, contentId, collapsedHeight, description, toggleExpanded } = useProductDescription();

  if (!description.hasContent) return <p className="text-sm text-muted-foreground">Mô tả đang cập nhật.</p>;

  return (
    <div className="space-y-5">
      {/* Toàn bộ nội dung lấy từ trường description, không chèn thông số hoặc bảo hành demo. */}
      <div
        id={contentId}
        className={cn("overflow-hidden transition-all duration-500", !isExpanded && hasOverflow && "[mask-image:linear-gradient(to_bottom,black_calc(100%_-_64px),transparent)]")}
        style={{ maxHeight: isExpanded ? "none" : collapsedHeight }}
      >
        {/* HTML dùng whitespace thường để không biến dòng phân cách tag thành khoảng trống thừa. */}
        <div ref={contentRef} className={cn(description.isRichText ? "whitespace-normal" : "whitespace-pre-line", "flow-root wrap-anywhere text-sm leading-relaxed text-slate-600 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-main [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-main [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold [&_p]:mb-3 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_li>p]:mb-0 [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h3]:mt-5 [&>:first-child]:mt-0 [&>:last-child]:mb-0")}>
          <RichTextNodes nodes={description.nodes} />
        </div>
      </div>

      {/* Chỉ hiện nút mở rộng / thu gọn khi mô tả vượt chiều cao giới hạn. */}
      {hasOverflow && <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={contentId}
        onClick={toggleExpanded}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary-light active:scale-95"
      >
        {isExpanded ? "Thu gọn mô tả" : "Xem đầy đủ mô tả sản phẩm"}
        <span className="text-lg leading-none">{isExpanded ? "↑" : "↓"}</span>
      </button>}
    </div>
  );
}
