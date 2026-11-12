import { useEffect, useRef } from "react";
import { createBannerDocument } from "@/lib/utils/banner-html.utils";

// Iframe không kế thừa CSS nên cần nạp stylesheet Tailwind và biến font của trang.
export function useBannerDocument(html: string) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const stylesheets = Array.from(document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'), (link) => link.outerHTML).join("");
    const styles = getComputedStyle(document.documentElement);
    const fontVariables = ["sans", "heading", "display", "serif", "mono"]
      .map((name) => `--font-${name}:${styles.getPropertyValue(`--font-${name}`)};`).join("");
    frame.srcdoc = createBannerDocument(html, stylesheets, fontVariables);
  }, [html]);
  return frameRef;
}
