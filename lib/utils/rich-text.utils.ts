import type { Content } from "@tiptap/react";

// Nhận diện HTML có định dạng; text cũ được giữ nguyên ký tự và xuống dòng.
export function toRichTextContent(value: string): Content {
  if (/<\/?(?:p|div|br|h[1-6]|ul|ol|li|strong|b|em|i|u|s|blockquote)(?:\s[^>]*|\s*\/?)>/i.test(value)) {
    return value;
  }

  return {
    type: "doc",
    content: value.split(/\r\n|\r|\n/).map((line) => ({
      type: "paragraph",
      ...(line ? { content: [{ type: "text", text: line }] } : {}),
    })),
  };
}

// Cấu trúc hiển thị chỉ chứa tag được cho phép và text, không giữ thuộc tính HTML từ API.
export type RichTextDisplayNode =
  | { type: "text"; text: string }
  | { type: "element"; tag: string; children: RichTextDisplayNode[] };

const DISPLAY_TAGS = new Set(["p", "div", "span", "h1", "h2", "h3", "h4", "h5", "h6", "ol", "ul", "li", "strong", "b", "em", "i", "u", "s", "strike", "br", "blockquote"]);
const BLOCKED_TAGS = new Set(["script", "style", "iframe", "object", "embed", "svg", "math", "template", "noscript"]);

// Chuyển rich text thành cây React an toàn; giữ text cũ và loại bỏ tag/thuộc tính có thể thực thi.
export function getRichTextDisplayContent(value: string): { nodes: RichTextDisplayNode[]; hasContent: boolean; isRichText: boolean } {
  if (!value.trim()) return { nodes: [], hasContent: false, isRichText: false };
  const content = toRichTextContent(value);
  if (typeof content !== "string" || typeof DOMParser === "undefined") {
    return { nodes: [{ type: "text", text: value }], hasContent: true, isRichText: false };
  }
  const document = new DOMParser().parseFromString(content, "text/html");
  let hasContent = false;

  // Chỉ lấy text và tag cho phép; phần tử khác không được đưa trực tiếp vào DOM thật.
  function readNodes(parent: Node): RichTextDisplayNode[] {
    return Array.from(parent.childNodes).flatMap((node): RichTextDisplayNode[] => {
      if (node.nodeType === 3) {
        const text = node.textContent ?? "";
        if (text.trim()) hasContent = true;
        return [{ type: "text", text }];
      }
      if (node.nodeType !== 1) return [];
      const tag = (node as Element).tagName.toLowerCase();
      if (BLOCKED_TAGS.has(tag)) return [];
      const children = readNodes(node);
      return DISPLAY_TAGS.has(tag) ? [{ type: "element", tag, children }] : children;
    });
  }

  const nodes = readNodes(document.body);
  return { nodes, hasContent, isRichText: true };
}