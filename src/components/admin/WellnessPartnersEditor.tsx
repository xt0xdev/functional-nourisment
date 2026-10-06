"use client";

import { useState } from "react";
import { MediaPicker } from "@/components/admin/MediaPicker";
import {
  PARTNERS_JSON_FIELD,
  blankWellnessPartner,
  type WellnessPartner,
} from "@/lib/wellness-partners";

const fieldClass = "rounded-xl border border-forest/15 bg-white px-3 py-2";

type EditorPartner = WellnessPartner & { bodyText?: string };

function serializePartners(partners: EditorPartner[]): WellnessPartner[] {
  return partners.map((partner) => ({
    id: partner.id,
    name: partner.name,
    detail: partner.detail,
    body: (partner.bodyText ?? partner.body.join("\n\n"))
      .split(/\n\n+/)
      .map((item) => item.trim())
      .filter(Boolean),
    label: partner.label,
    url: partner.url,
    photo: partner.photo,
    photoAlt: partner.photoAlt,
  }));
}

export function WellnessPartnersEditor({ partners: initial }: { partners: WellnessPartner[] }) {
  const [partners, setPartners] = useState<EditorPartner[]>(initial);

  function update(index: number, patch: Partial<EditorPartner>) {
    setPartners((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function move(index: number, delta: number) {
    setPartners((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [row] = next.splice(index, 1);
      next.splice(target, 0, row);
      return next;
    });
  }

  function remove(index: number) {
    setPartners((current) => current.filter((_, i) => i !== index));
  }

  return (
    <fieldset className="grid gap-4 rounded-2xl bg-white p-5">
      <legend className="px-1 font-serif text-2xl text-forest">Wellness partners</legend>
      <p className="text-sm text-muted">
        These cards always appear on the Collaborative Care page, including when the body designer is
        on. Add, edit, reorder, or remove partners here. An optional photo can come from the media
        library.
      </p>
      <input type="hidden" name={PARTNERS_JSON_FIELD} value={JSON.stringify(serializePartners(partners))} />

      {partners.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-forest/20 bg-sand/40 px-4 py-6 text-sm text-muted">
          No wellness partners yet. Add the first card to show it on the public page.
        </p>
      ) : null}

      {partners.map((partner, index) => (
        <div key={partner.id} className="grid gap-3 rounded-2xl bg-sand/60 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-forest">Partner {index + 1}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <button type="button" className="text-moss" onClick={() => move(index, -1)} disabled={index === 0}>
                Up
              </button>
              <button
                type="button"
                className="text-moss"
                onClick={() => move(index, 1)}
                disabled={index === partners.length - 1}
              >
                Down
              </button>
              <button type="button" className="text-clay" onClick={() => remove(index)}>
                Remove
              </button>
            </div>
          </div>

          <label className="grid gap-1 text-sm">
            Partner name
            <input
              value={partner.name}
              onChange={(event) => update(index, { name: event.target.value })}
              className={fieldClass}
              placeholder="Arista Smiles"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Subtitle / detail
            <input
              value={partner.detail}
              onChange={(event) => update(index, { detail: event.target.value })}
              className={fieldClass}
              placeholder="Biological & Integrative Dentistry | Bayside, NY"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Body paragraphs
            <span className="text-xs text-muted">Separate paragraphs with a blank line.</span>
            <textarea
              value={partner.bodyText ?? partner.body.join("\n\n")}
              onChange={(event) => update(index, { bodyText: event.target.value })}
              rows={6}
              className={fieldClass}
            />
          </label>
          <label className="grid gap-1 text-sm">
            Button label
            <input
              value={partner.label}
              onChange={(event) => update(index, { label: event.target.value })}
              className={fieldClass}
              placeholder="Visit Arista Smiles"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Button URL
            <input
              value={partner.url}
              onChange={(event) => update(index, { url: event.target.value })}
              className={fieldClass}
              placeholder="https://example.com"
            />
          </label>

          <div className="grid gap-2">
            <MediaPicker
              label="Partner photo (optional)"
              asField={false}
              help="Pick from the media library or paste a URL in the library dialog."
              onSelect={(item) =>
                update(index, {
                  photo: item.url,
                  photoAlt: item.alt || partner.photoAlt || partner.name,
                })
              }
            />
            {partner.photo ? (
              <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white">
                <div className="relative aspect-[16/10] bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={partner.photo} alt={partner.photoAlt || partner.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 text-xs">
                  <span className="truncate text-muted">{partner.photo}</span>
                  <button
                    type="button"
                    className="text-clay"
                    onClick={() => update(index, { photo: "", photoAlt: "" })}
                  >
                    Remove photo
                  </button>
                </div>
              </div>
            ) : null}
            <label className="grid gap-1 text-sm">
              Photo alt text
              <input
                value={partner.photoAlt}
                onChange={(event) => update(index, { photoAlt: event.target.value })}
                className={fieldClass}
                placeholder="Optional description of the photo"
              />
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setPartners((current) => [...current, blankWellnessPartner()])}
        className="w-fit rounded-full bg-forest px-5 py-2 text-sm text-cream"
      >
        Add partner
      </button>
    </fieldset>
  );
}
