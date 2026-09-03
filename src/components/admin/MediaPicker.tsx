"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { MediaDTO } from "@/lib/media";
import { ALLOWED_IMAGE_TYPE_SET, MAX_UPLOAD_BYTES } from "@/lib/media-constants";

type PickerItem = { id: string; url: string; alt: string; filename?: string };

type MediaPickerProps = {
  label?: string;
  name?: string;
  idName?: string;
  defaultUrl?: string;
  defaultMediaId?: string;
  defaultItems?: PickerItem[];
  multiple?: boolean;
  help?: string;
  asField?: boolean;
  onSelect?: (item: PickerItem) => void;
};

type LibraryState = {
  items: MediaDTO[];
  driver: "vercel-blob" | "filesystem";
  storageLabel: string;
};

async function readDimensions(file: File): Promise<{ width?: number; height?: number }> {
  return new Promise((resolve) => {
    const image = new window.Image();
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(image.src);
    };
    image.onerror = () => resolve({});
    image.src = URL.createObjectURL(file);
  });
}

export function MediaPicker({
  label = "Image",
  name,
  idName,
  defaultUrl = "",
  defaultMediaId = "",
  defaultItems = [],
  multiple = false,
  help,
  asField = true,
  onSelect,
}: MediaPickerProps) {
  const inputId = useId();
  const [open, setOpen] = useState(false);
  const [library, setLibrary] = useState<LibraryState | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [single, setSingle] = useState<PickerItem | null>(
    defaultUrl ? { id: defaultMediaId, url: defaultUrl, alt: "" } : null,
  );
  const [gallery, setGallery] = useState<PickerItem[]>(defaultItems);

  const loadLibrary = useCallback(async () => {
    const response = await fetch("/api/admin/media");
    if (!response.ok) {
      setError("Could not load the media library.");
      return;
    }
    const data = (await response.json()) as LibraryState;
    setLibrary(data);
  }, []);

  useEffect(() => {
    if (open && !library) void loadLibrary();
  }, [open, library, loadLibrary]);

  async function uploadFile(file: File) {
    setError("");
    if (!ALLOWED_IMAGE_TYPE_SET.has(file.type)) {
      setError("Please upload a JPEG, PNG, WebP, or GIF.");
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      setError("Images must be 10 MB or smaller.");
      return;
    }
    setBusy(true);
    try {
      const dims = await readDimensions(file);
      let item: MediaDTO;
      if (library?.driver === "vercel-blob") {
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob",
        });
        const created = await fetch("/api/admin/media", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            filename: file.name,
            mimeType: file.type,
            size: file.size,
            width: dims.width,
            height: dims.height,
          }),
        });
        const json = await created.json();
        if (!created.ok) throw new Error(json.error || "Could not save image metadata.");
        item = json.item as MediaDTO;
      } else {
        const form = new FormData();
        form.append("file", file);
        const created = await fetch("/api/admin/media", { method: "POST", body: form });
        const json = await created.json();
        if (!created.ok) throw new Error(json.error || "Upload failed.");
        item = json.item as MediaDTO;
      }
      setLibrary((prev) =>
        prev ? { ...prev, items: [item, ...prev.items.filter((row) => row.id !== item.id)] } : prev,
      );
      applySelection(item);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function applySelection(item: Pick<MediaDTO, "id" | "url" | "alt" | "filename">) {
    const next = { id: item.id, url: item.url, alt: item.alt, filename: item.filename };
    onSelect?.(next);
    if (!asField) {
      setOpen(false);
      return;
    }
    if (multiple) {
      setGallery((current) => (current.some((row) => row.id === next.id) ? current : [...current, next]));
    } else {
      setSingle(next);
      setOpen(false);
    }
  }

  async function addPastedUrl() {
    const url = pasteUrl.trim();
    if (!url) return;
    setBusy(true);
    setError("");
    try {
      const created = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, filename: url.split("/").pop() || "image", mimeType: "image/*" }),
      });
      const json = await created.json();
      if (!created.ok) throw new Error(json.error || "Could not add that URL.");
      const item = json.item as MediaDTO;
      setLibrary((prev) => (prev ? { ...prev, items: [item, ...prev.items] } : prev));
      applySelection(item);
      setPasteUrl("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function move(index: number, delta: number) {
    setGallery((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return next;
    });
  }

  const preview = multiple ? gallery : single ? [single] : [];

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium text-forest">{label}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-full bg-forest px-3 py-1.5 text-xs text-cream"
        >
          {multiple ? "Add from library" : "Choose from library"}
        </button>
      </div>
      {help ? <p className="text-xs text-muted">{help}</p> : null}

      {asField && name && !multiple ? (
        <>
          <input type="hidden" name={name} value={single?.url || ""} />
          {idName ? <input type="hidden" name={idName} value={single?.id || ""} /> : null}
        </>
      ) : null}
      {asField && name && multiple
        ? gallery.map((item) => <input key={item.id} type="hidden" name={name} value={item.id} />)
        : null}

      {asField && preview.length === 0 ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-2xl border border-dashed border-forest/25 bg-white px-4 py-8 text-sm text-muted"
        >
          No image selected. Upload or pick one from the media library.
        </button>
      ) : asField ? (
        <div className={multiple ? "grid gap-3 sm:grid-cols-2" : "grid gap-3"}>
          {preview.map((item, index) => (
            <div key={`${item.id}-${item.url}`} className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
              <div className="relative aspect-[16/10] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.alt || item.filename || ""} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs">
                <span className="truncate text-muted">{item.filename || item.url}</span>
                <div className="flex gap-2">
                  {multiple ? (
                    <>
                      <button type="button" className="text-moss" onClick={() => move(index, -1)}>
                        Up
                      </button>
                      <button type="button" className="text-moss" onClick={() => move(index, 1)}>
                        Down
                      </button>
                    </>
                  ) : null}
                  <button
                    type="button"
                    className="text-clay"
                    onClick={() => {
                      if (multiple) setGallery((current) => current.filter((_, i) => i !== index));
                      else setSingle(null);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {open ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest/50 p-4 md:p-8">
          <div className="w-full max-w-4xl rounded-3xl bg-sand p-5 shadow-xl">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl text-forest">Media library</h2>
                <p className="mt-1 text-xs text-muted">
                  {library?.storageLabel || "Loading storage…"} · JPEG, PNG, WebP, GIF · up to 10 MB
                </p>
              </div>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full bg-white px-3 py-1.5 text-sm">
                Close
              </button>
            </div>

            <label className="mt-4 block rounded-2xl border border-dashed border-forest/20 bg-white p-4 text-sm">
              <span className="font-medium text-forest">{busy ? "Uploading…" : "Upload an image"}</span>
              <input
                id={inputId}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="mt-2 block w-full text-xs"
                disabled={busy}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) void uploadFile(file);
                }}
              />
            </label>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <input
                value={pasteUrl}
                onChange={(event) => setPasteUrl(event.target.value)}
                placeholder="Or paste an image URL"
                className="flex-1 rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm"
              />
              <button
                type="button"
                onClick={() => void addPastedUrl()}
                className="rounded-full bg-forest px-4 py-2 text-sm text-cream"
                disabled={busy}
              >
                Add URL
              </button>
            </div>

            {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(library?.items || []).map((item) => {
                const selected = multiple
                  ? gallery.some((row) => row.id === item.id)
                  : single?.id === item.id || single?.url === item.url;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => applySelection(item)}
                    className={`overflow-hidden rounded-2xl bg-white text-left shadow-sm ring-2 ${
                      selected ? "ring-moss" : "ring-transparent"
                    }`}
                  >
                    <div className="aspect-[4/3] bg-sand">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" />
                    </div>
                    <p className="truncate px-3 py-2 text-xs text-muted">{item.alt || item.filename}</p>
                  </button>
                );
              })}
            </div>
            {library && library.items.length === 0 ? (
              <p className="mt-4 text-sm text-muted">The library is empty. Upload the first photo above.</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
