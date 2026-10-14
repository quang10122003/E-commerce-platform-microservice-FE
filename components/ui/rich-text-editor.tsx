"use client";

import { EditorContent } from "@tiptap/react";
import { Bold, Heading2, Heading3, Italic, List, ListOrdered, Redo2, RemoveFormatting, Underline, Undo2 } from "lucide-react";

import { useRichTextEditor } from "@/hooks/shared/useRichTextEditor";
import { cn } from "@/lib/utils";
import type { RichTextEditorProps } from "@/types/shared/rich-text-editor";

// Soạn thảo mô tả dạng HTML với toolbar và class có thể tùy chỉnh khi tái sử dụng.
export function RichTextEditor(props: RichTextEditorProps) {
  const { id, label, placeholder = "Nhập nội dung...", disabled, error, className, contentClassName, toolbarClassName } = props;
  const { editor, state } = useRichTextEditor(props);
  const actions = [
    { label: "In đậm", icon: Bold, active: state?.bold, run: () => editor?.chain().focus().toggleBold().run() },
    { label: "In nghiêng", icon: Italic, active: state?.italic, run: () => editor?.chain().focus().toggleItalic().run() },
    { label: "Gạch chân", icon: Underline, active: state?.underline, run: () => editor?.chain().focus().toggleUnderline().run() },
    { label: "Tiêu đề lớn", icon: Heading2, active: state?.heading2, run: () => editor?.chain().focus().toggleHeading({ level: 2 }).run() },
    { label: "Tiêu đề nhỏ", icon: Heading3, active: state?.heading3, run: () => editor?.chain().focus().toggleHeading({ level: 3 }).run() },
    { label: "Danh sách gạch đầu dòng", icon: List, active: state?.bulletList, run: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Danh sách đánh số", icon: ListOrdered, active: state?.orderedList, run: () => editor?.chain().focus().toggleOrderedList().run() },
    { label: "Xóa định dạng", icon: RemoveFormatting, run: () => editor?.chain().focus().unsetAllMarks().clearNodes().run() },
    { label: "Hoàn tác", icon: Undo2, unavailable: !state?.canUndo, run: () => editor?.chain().focus().undo().run() },
    { label: "Làm lại", icon: Redo2, unavailable: !state?.canRedo, run: () => editor?.chain().focus().redo().run() },
  ];

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className={cn("overflow-hidden rounded-lg border bg-white focus-within:ring-2 focus-within:ring-primary", error ? "border-danger" : "border-slate-200", disabled && "opacity-60")}>
        {/* Công cụ định dạng không submit form và giữ vùng văn bản đang được chọn. */}
        <div role="group" aria-label={`Định dạng ${label.toLowerCase()}`} className={cn("flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2", toolbarClassName)}>
          {actions.map(({ label: actionLabel, icon: Icon, active, unavailable, run }) => (
            <button
              key={actionLabel}
              type="button"
              title={actionLabel}
              aria-label={actionLabel}
              aria-pressed={active}
              disabled={disabled || !editor || unavailable}
              onMouseDown={(event) => event.preventDefault()}
              onClick={run}
              className={cn("inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-40", active ? "bg-primary-light text-primary" : "text-main")}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          ))}
        </div>
        {/* Vùng nhập giữ style của nội dung và placeholder không cản thao tác. */}
        <div className="relative">
          <EditorContent
            editor={editor}
            className={cn(
              "[&_.tiptap]:min-h-48 [&_.tiptap]:max-h-128 [&_.tiptap]:overflow-y-auto [&_.tiptap]:p-3.5 [&_.tiptap]:text-sm [&_.tiptap]:leading-[1.7] [&_.tiptap]:wrap-anywhere [&_.tiptap]:text-main [&_.tiptap]:caret-primary [&_.tiptap]:outline-none selection:bg-primary-light",
              "[&_.tiptap>*+*]:mt-3 [&_.tiptap_p]:min-h-[1.7em]",
              "[&_.tiptap_h2]:text-xl [&_.tiptap_h2]:font-bold [&_.tiptap_h3]:text-[1.0625rem] [&_.tiptap_h3]:font-bold",
              "[&_.tiptap_ul]:list-disc [&_.tiptap_ul]:pl-6 [&_.tiptap_ol]:list-decimal [&_.tiptap_ol]:pl-6 [&_.tiptap_li+li]:mt-1",
              "[&_.tiptap_strong]:font-bold [&_.tiptap_em]:italic [&_.tiptap_u]:underline",
              contentClassName,
            )}
          />
          {(!editor || state?.showPlaceholder) && (
            <p aria-hidden="true" className="pointer-events-none absolute left-3.5 right-3.5 top-3.5 text-sm text-muted-foreground">{placeholder}</p>
          )}
        </div>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger">{error}</p>
      ) : (
        <p id={`${id}-hint`} className="text-[11px] text-muted-foreground">Chọn văn bản để định dạng. Ctrl/Cmd + B: in đậm; Ctrl/Cmd + I: in nghiêng.</p>
      )}
    </div>
  );
}
