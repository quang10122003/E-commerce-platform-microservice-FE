import type { Ref } from "react";

export type RichTextEditorHandle = { focus: () => void };

export type RichTextEditorProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  ref?: Ref<RichTextEditorHandle>;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  contentClassName?: string;
  toolbarClassName?: string;
};
