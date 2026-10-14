"use client";

import { useEffect, useImperativeHandle, useRef } from "react";
import { useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { toRichTextContent } from "@/lib/utils/rich-text.utils";
import type { RichTextEditorProps } from "@/types/shared/rich-text-editor";

const extensions = [StarterKit.configure({
  heading: { levels: [2, 3] },
  link: false,
  code: false,
  codeBlock: false,
  blockquote: false,
  horizontalRule: false,
})];

// Đồng bộ HTML với form, giữ selection khi gõ và nhận giá trị mới khi reset.
export function useRichTextEditor({ value, onChange, onBlur, disabled, id, label, error, ref }: RichTextEditorProps) {
  // Ghi nhớ giá trị đã đồng bộ để tránh setContent làm mất con trỏ khi nhập.
  const syncedValue = useRef(value);
  const editor = useEditor({
    extensions,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    content: toRichTextContent(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      const html = editor.isEmpty ? "" : editor.getHTML();
      syncedValue.current = html;
      onChange(html);
    },
    onBlur: () => onBlur?.(),
  });

  const state = useEditorState({
    editor,
    selector: ({ editor: snapshotEditor }) => {
      // Dùng editor vừa khởi tạo khi snapshot chưa nhận transaction đầu tiên.
      const activeEditor = snapshotEditor ?? editor;
      return activeEditor ? {
        bold: activeEditor.isActive("bold"),
        italic: activeEditor.isActive("italic"),
        underline: activeEditor.isActive("underline"),
        heading2: activeEditor.isActive("heading", { level: 2 }),
        heading3: activeEditor.isActive("heading", { level: 3 }),
        bulletList: activeEditor.isActive("bulletList"),
        orderedList: activeEditor.isActive("orderedList"),
        canUndo: activeEditor.can().undo(),
        canRedo: activeEditor.can().redo(),
        // Chỉ hiện chữ gợi ý khi các đoạn đều trống, không có danh sách hoặc tiêu đề.
        showPlaceholder: activeEditor.state.doc.content.content.every(
          (node) => node.type.name === "paragraph" && node.content.size === 0,
        ),
      } : null;
    },
  });

  useImperativeHandle(ref, () => ({ focus: () => { editor?.commands.focus(); } }), [editor]);

  useEffect(() => {
    if (!editor || value === syncedValue.current) return;
    syncedValue.current = value;
    editor.commands.setContent(toRichTextContent(value), { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled, false);
    editor.setOptions({ editorProps: { attributes: {
      id,
      role: "textbox",
      "aria-label": label,
      "aria-multiline": "true",
      "aria-invalid": String(Boolean(error)),
      "aria-describedby": error ? `${id}-error` : `${id}-hint`,
      "aria-disabled": String(Boolean(disabled)),
    } } });
  }, [editor, disabled, id, label, error]);

  return { editor, state };
}
