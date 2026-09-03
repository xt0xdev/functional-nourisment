"use client";

import { useMemo, useState } from "react";
import { upload } from "@vercel/blob/client";
import type { MediaDTO } from "@/lib/media";
import { ALLOWED_IMAGE_TYPE_SET, MAX_UPLOAD_BYTES } from "@/lib/media-constants";
import { formatBytes } from "@/lib/format";

type MediaLibraryProps = {
  initialItems: MediaDTO[];
  driver: "vercel-blob" | "filesystem";
};

export function MediaLibrary({ initialItems, driver }: MediaLibraryProps) {
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<MediaDTO | null>(null);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      [item.filename, item.alt, item.caption, item.url].join(" ").toLowerCase().includes(q),
    );
  }, [items, query]);

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
      let item: MediaDTO;
      if (driver === "vercel-blob") {
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
      setItems((current) => [item, ...current]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function saveMeta() {
    if (!editing) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/media/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt, caption }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.error || "Could not save.");
      const item = json.item as MediaDTO;
      setItems((current) => current.map((row) => (row.id === item.id ? item : row)));
      setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(item: MediaDTO) {
    if (!confirm(`Delete ${item.filename}? Pages that still point at this URL will show a broken image.`)) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      if (!response.ok) {
        const json = await response.json();
        throw new Error(json.error || "Could not delete.");
      }
      setItems((current) => current.filter((row) => row.id !== item.id));
      if (editing?.id === item.id) setEditing(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6">
      <label className="block rounded-2xl border border-dashed border-forest/20 bg-white p-5">
        <span className="font-medium text-forest">{busy ? "Working…" : "Upload images"}</span>
        <p className="mt-1 text-xs text-muted">JPEG, PNG, WebP, or GIF · 10 MB max · files are not stored in Neon</p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="mt-3 block w-full text-sm"
          disabled={busy}
          multiple
          onChange={(event) => {
            const files = Array.from(event.target.files || []);
            event.target.value = "";
            void files.reduce(async (prev, file) => {
              await prev;
              await uploadFile(file);
            }, Promise.resolve());
          }}
        />
      </label>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search filename, alt, or caption"
        className="mt-4 w-full rounded-xl border border-forest/15 bg-white px-3 py-2 text-sm"
      />

      {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article key={item.id} className="overflow-hidden rounded-2xl bg-white shadow-sm">
            <div className="aspect-[4/3] bg-sand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt={item.alt || item.filename} className="h-full w-full object-cover" />
            </div>
            <div className="grid gap-1 p-4">
              <p className="truncate text-sm font-medium text-forest">{item.alt || item.filename}</p>
              <p className="text-xs text-muted">
                {formatBytes(item.size)}
                {item.width && item.height ? ` · ${item.width}×${item.height}` : ""} ·{" "}
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
              {item.caption ? <p className="text-xs text-muted">{item.caption}</p> : null}
              <div className="mt-2 flex gap-3 text-sm">
                <button
                  type="button"
                  className="text-moss"
                  onClick={() => {
                    setEditing(item);
                    setAlt(item.alt);
                    setCaption(item.caption);
                  }}
                >
                  Edit
                </button>
                <button type="button" className="text-clay" onClick={() => void remove(item)}>
                  Delete
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filtered.length === 0 ? <p className="mt-6 text-sm text-muted">No matching files.</p> : null}

      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/50 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6">
            <h2 className="font-serif text-2xl text-forest">Edit image details</h2>
            <label className="mt-4 grid gap-1 text-sm">
              Alt text
              <input value={alt} onChange={(event) => setAlt(event.target.value)} className="rounded-xl border border-forest/15 px-3 py-2" />
            </label>
            <label className="mt-3 grid gap-1 text-sm">
              Caption
              <textarea value={caption} onChange={(event) => setCaption(event.target.value)} rows={3} className="rounded-xl border border-forest/15 px-3 py-2" />
            </label>
            <p className="mt-2 break-all text-xs text-muted">{editing.url}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => void saveMeta()} className="rounded-full bg-forest px-4 py-2 text-sm text-cream">
                Save
              </button>
              <button type="button" onClick={() => setEditing(null)} className="text-sm text-muted">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
