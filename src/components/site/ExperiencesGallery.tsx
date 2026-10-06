import { SmartImage } from "@/components/site/SmartImage";
import type { ExperiencesGalleryItem } from "@/lib/experiences-gallery";

export function ExperiencesGallery({
  eyebrow,
  heading,
  items,
  compact = false,
}: {
  eyebrow?: string;
  heading?: string;
  items: ExperiencesGalleryItem[];
  compact?: boolean;
}) {
  if (!items.length) {
    if (!compact) return null;
    return (
      <div className="rounded-2xl border border-dashed border-teal/30 px-4 py-5 text-sm text-muted">
        No gallery photos yet. Add images in Workshop gallery below.
      </div>
    );
  }

  return (
    <div>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {heading ? <h2 className="mt-3 font-serif text-3xl text-primary">{heading}</h2> : null}
      <div className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading || eyebrow ? "mt-8" : ""}`}>
        {items.map((photo) => (
          <figure key={photo.id} className="overflow-hidden rounded-3xl bg-mist">
            <div className="relative aspect-[4/3]">
              <SmartImage
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 33vw, 50vw"
              />
            </div>
            {photo.caption ? (
              <figcaption className="px-1 py-2 text-sm text-muted">{photo.caption}</figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </div>
  );
}
