"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  GALLERY_JSON_FIELD,
  blankExperiencesGalleryItem,
  type ExperiencesGalleryItem,
} from "@/lib/experiences-gallery";

const fieldClass = "rounded-xl border border-forest/15 bg-white px-3 py-2";

export function ExperiencesGalleryEditor({ items: initial }: { items: ExperiencesGalleryItem[] }) {
  const [items, setItems] = useState<ExperiencesGalleryItem[]>(initial);

  function update(index: number, patch: Partial<ExperiencesGalleryItem>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, delta: number) {
    setItems((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return next;
    });
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  return (
    <fieldset className="grid gap-4 rounded-2xl bg-white p-5">
      <legend className="px-1 font-serif text-2xl text-forest">Workshop gallery</legend>
      <p className="text-sm text-muted">
        These photos always appear at the bottom of Workshops & Experiences, including when the body
        designer is on. Add, replace, reorder, or remove images here. Photos come from the media
        library — the page stores the image URL, not the file bytes.
      </p>
      <input type="hidden" name={GALLERY_JSON_FIELD} value={JSON.stringify(items)} />

      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-forest/20 bg-sand/40 px-4 py-6 text-sm text-muted">
          No gallery photos yet. Add the first image to show it on the public page.
        </p>
      ) : null}

      {items.map((item, index) => (
        <div key={item.id} className="grid gap-3 rounded-2xl bg-sand/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-forest">Photo {index + 1}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <button type="button" className="text-moss" onClick={() => move(index, -1)} disabled={index === 0}>
                Up
              </button>
              <button
                type="button"
                className="text-moss"
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
              >
                Down
              </button>
              <button type="button" className="text-clay" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <MediaPicker
              label="Gallery photo"
              asField={false}
              help="Pick from the media library or paste a URL in the library dialog."
              onSelect={(selected) =>
                update(index, {
                  src: selected.url,
                  alt: selected.alt || item.alt,
                })
              }
            />
            {item.src ? (
              <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
                <div className="relative aspect-[16/10] bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.src} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs">
                  <span className="truncate text-muted">{item.src}</span>
                  <button type="button" className="text-clay" onClick={() => update(index, { src: "", alt: item.alt })}>
                    Remove photo
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          <label className="grid gap-1 text-sm">
            Alt text
            <input
              value={item.alt}
              onChange={(event) => update(index, { alt: event.target.value })}
              className={fieldClass}
              placeholder="Describe the photo"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Caption (optional)
            <input
              value={item.caption}
              onChange={(event) => update(index, { caption: event.target.value })}
              className={fieldClass}
              placeholder="Shown under the photo when filled in"
            />
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setItems((current) => [...current, blankExperiencesGalleryItem()])}
        className="w-fit rounded-full bg-forest px-5 py-2 text-sm text-cream"
      >
        Add photo
      </button>
    </fieldset>
  );
}
