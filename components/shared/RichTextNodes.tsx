import { createElement } from "react";
import type { RichTextDisplayNode } from "@/lib/utils/rich-text.utils";

// Render cây tag đã được helper làm sạch, không nhận thuộc tính HTML trực tiếp từ backend.
export function RichTextNodes({ nodes }: { nodes: RichTextDisplayNode[] }) {
  return nodes.map((node, index) => node.type === "text" ? node.text : createElement(
    node.tag, { key: index }, node.tag === "br" ? undefined : <RichTextNodes nodes={node.children} />,
  ));
}
