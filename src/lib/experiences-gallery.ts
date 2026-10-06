import { WELLNESS_GALLERY } from "./site-images";

export const GALLERY_JSON_FIELD = "gallery_json";

export type ExperiencesGalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
};

export function newGalleryItemId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `gallery-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function blankExperiencesGalleryItem(): ExperiencesGalleryItem {
  return {
    id: newGalleryItemId(),
    src: "",
    alt: "",
    caption: "",
  };
}

export function defaultExperiencesGallery(): ExperiencesGalleryItem[] {
  return WELLNESS_GALLERY.map((photo, index) => ({
    id: `wellness-gallery-${index + 1}`,
    src: photo.src,
    alt: photo.alt,
    caption: "",
  }));
}

function text(value: unknown, fallback = "") {
  const next = typeof value === "string" ? value.trim() : "";
  return next || fallback;
}

function parseObject(raw?: string | null): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw || "{}") as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function normalizeGalleryItem(raw: unknown, index = 0): ExperiencesGalleryItem {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: text(row.id, `gallery-${index + 1}`),
    src: text(row.src || row.url || row.photo),
    alt: text(row.alt || row.photoAlt),
    caption: text(row.caption),
  };
}

export function galleryItemHasImage(item: ExperiencesGalleryItem) {
  return Boolean(item.src);
}

export function resolveExperiencesGalleryFromContent(stored: Record<string, unknown>): ExperiencesGalleryItem[] {
  if (Array.isArray(stored.gallery)) {
    return stored.gallery.map((item, index) => normalizeGalleryItem(item, index)).filter(galleryItemHasImage);
  }
  return defaultExperiencesGallery();
}

export function resolveExperiencesGallery(raw?: string | null): ExperiencesGalleryItem[] {
  return resolveExperiencesGalleryFromContent(parseObject(raw));
}

export function galleryFromFormData(formData: FormData): ExperiencesGalleryItem[] | null {
  const raw = formData.get(GALLERY_JSON_FIELD);
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item, index) => normalizeGalleryItem(item, index)).filter(galleryItemHasImage);
  } catch {
    return null;
  }
}
