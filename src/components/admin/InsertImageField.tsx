"use client";

import { useRef, useState } from "react";
import { MediaPicker } from "./MediaPicker";

type InsertImageFieldProps = {
  name: string;
  defaultValue: string;
  rows?: number;
  className?: string;
  label?: string;
};

export function InsertImageField({
  name,
  defaultValue,
  rows = 16,
  className = "rounded-xl border border-forest/15 bg-white px-3 py-2",
  label = "Content",
}: InsertImageFieldProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(defaultValue);

  function insertMarkdown(url: string, alt = "") {
    const snippet = `\n\n![${alt || "Image"}](${url})\n\n`;
    const el = ref.current;
    if (!el) {
      setValue((current) => current + snippet);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = `${el.value.slice(0, start)}${snippet}${el.value.slice(end)}`;
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = start + snippet.length;
      el.setSelectionRange(cursor, cursor);
    });
  }

  return (
    <div className="grid gap-3">
      <p className="text-sm font-medium text-forest">{label}</p>
      <MediaPicker
        label="Insert image into content"
        asField={false}
        help="Selecting an image inserts Markdown at the cursor. Use a blank line between paragraphs and ## for headings."
        onSelect={(item) => insertMarkdown(item.url, item.alt)}
      />
      <textarea
        ref={ref}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        rows={rows}
        className={className}
      />
    </div>
  );
}
