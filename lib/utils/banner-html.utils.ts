// Chặn thẻ, sự kiện và URL có thể thực thi mã trước khi tạo tài liệu sandbox.
export function createBannerDocument(html: string, stylesheets: string, fontVariables: string): string {
  const document = new DOMParser().parseFromString(html, "text/html");
  const tags = new Set("style section div span p h1 h2 h3 h4 h5 h6 br a img picture source strong b em i small ul ol li svg g path rect circle ellipse line polyline polygon defs linearGradient radialGradient stop title".toLowerCase().split(" "));
  const attributes = new Set("style class id title role alt width height media viewbox fill stroke stroke-width stroke-linecap stroke-linejoin d x y x1 y1 x2 y2 cx cy r rx ry points offset stop-color stop-opacity opacity xmlns".split(" "));
  // CSS có thể nằm trong head hoặc body; vẫn lọc thuộc tính sự kiện trên thẻ style.
  for (const element of Array.from(document.querySelectorAll("head style, body *"))) {
    if (!tags.has(element.localName.toLowerCase())) {
      element.remove();
      continue;
    }
    for (const attribute of Array.from(element.attributes)) {
      const name = attribute.name.toLowerCase();
      if (name === "href" && element.localName === "a") {
        const url = URL.parse(attribute.value, window.location.origin);
        if (!url || !["http:", "https:", "mailto:", "tel:"].includes(url.protocol)) element.removeAttribute(attribute.name);
      } else if (name === "src" && element.localName === "img") {
        const url = URL.parse(attribute.value, window.location.origin);
        if ((!url || !["http:", "https:"].includes(url.protocol)) && !/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(attribute.value)) element.removeAttribute(attribute.name);
      } else if (!attributes.has(name) && !name.startsWith("data-banner") && !name.startsWith("aria-")) {
        element.removeAttribute(attribute.name);
      }
    }
    // Liên kết mở trang cửa hàng thay vì điều hướng trong khung banner.
    if (element.localName === "a") {
      element.setAttribute("target", "_top");
      element.setAttribute("rel", "noopener noreferrer");
    }
  }
  return `<!doctype html><html lang="vi" class="h-full overflow-hidden scheme-light"><head><meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'none'; style-src 'self' 'unsafe-inline'; img-src http: https: data:; font-src 'self' data:; form-action 'none'; base-uri 'none'">
${stylesheets}${Array.from(document.head.querySelectorAll("style"), (style) => style.outerHTML).join("")}<style>:root{${fontVariables}}</style></head>
<body class="m-0 h-full min-h-0! overflow-hidden bg-transparent! leading-[normal] [zoom:1]! [&_*]:box-border
  [&_[data-banner]]:h-full! [&_[data-banner]]:min-h-full! [&_[data-banner]]:border-0! [&_[data-banner]]:rounded-none!
  [&_[data-banner-title]]:tracking-tight [&_[data-banner-title][style*='italic']]:tracking-normal [&_[data-banner-title]_span]:tracking-normal
  [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-current [&_a:focus-visible]:outline-offset-4
  max-[1399px]:[&_[data-banner-content]]:p-10! max-[1399px]:[&_[data-banner-title]]:text-[36px]!
  max-[1023px]:[&_[data-banner-content]]:p-6! max-[1023px]:[&_[data-banner-title]]:text-[24px]!
  max-[1023px]:[&_[data-banner-description]]:text-[14px]! max-[1023px]:[&_[data-banner-cta]]:text-[14px]! max-[1023px]:[&_[data-banner-perks]]:text-[12px]!
  max-[639px]:[&_[data-banner]]:grid-cols-1! max-[639px]:[&_[data-banner-image]]:hidden!
  max-[319px]:[&_[data-banner-content]]:p-4! max-[319px]:[&_[data-banner-content]]:gap-3! max-[319px]:[&_[data-banner-title]]:text-[22px]!
">${document.body.innerHTML}</body></html>`;
}
