"use client";

import { RichTextNodes } from "@/components/shared/RichTextNodes";
import { useMounted } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { getRichTextDisplayContent } from "@/lib/utils/rich-text.utils";

// Dùng bộ đọc rich text của mô tả sản phẩm; chỉ parse HTML khi DOMParser đã có trên trình duyệt.
export function ShopRichTextDescription({ value }: { value: string | null }) {
  const mounted = useMounted();
  if (!mounted && value?.trim()) return <p className="text-sm text-muted-foreground">Đang tải mô tả…</p>;

  const description = getRichTextDisplayContent(value ?? "");
  if (!description.hasContent) return <p className="text-sm text-muted-foreground">Mô tả đang cập nhật.</p>;

  return (
    <div className={cn(description.isRichText ? "whitespace-normal" : "whitespace-pre-line", "flow-root wrap-anywhere text-sm leading-relaxed text-muted-foreground [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-main [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-main [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-main [&_h4]:font-semibold [&_h5]:font-semibold [&_h6]:font-semibold [&_p]:mb-3 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_li>p]:mb-0 [&_strong]:font-bold [&_b]:font-bold [&_em]:italic [&_i]:italic [&_u]:underline [&_s]:line-through [&_strike]:line-through [&_blockquote]:pl-4 [&_blockquote]:italic [&>:first-child]:mt-0 [&>:last-child]:mb-0")}>
      <RichTextNodes nodes={description.nodes} />
    </div>
  );
}
