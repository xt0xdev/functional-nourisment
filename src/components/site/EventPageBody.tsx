import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";
import { SmartImage } from "@/components/site/SmartImage";
import { getEventLayout } from "@/lib/page-layout";
import { renderRichText } from "@/lib/rich-text";

type EventGalleryItem = {
  id: string;
  media: {
    id: string;
    url: string;
    alt: string;
    caption: string;
  };
};

export function EventGallery({
  title,
  items,
}: {
  title: string;
  items: EventGalleryItem[];
}) {
  if (!items.length) return null;
  return (
    <div className="mt-10 grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <figure key={item.id} className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[4/3]">
            <SmartImage
              src={item.media.url}
              alt={item.media.alt || title}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          {item.media.caption ? <figcaption className="mt-2 text-sm text-muted">{item.media.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  );
}

export function EventPageBody({
  event,
  showItinerary = false,
}: {
  event: {
    title: string;
    description: string;
    itinerary?: string | null;
    layout?: string | null;
    coverImageId?: string | null;
    images: EventGalleryItem[];
  };
  showItinerary?: boolean;
}) {
  const layout = getEventLayout(event.layout);
  const gallery = event.images.filter((item) => item.media.id !== event.coverImageId);
  const itinerary = event.itinerary?.trim();

  return (
    <PageBodyOrLayout
      layout={layout}
      bare
      fallback={
        <>
          <div className="prose-fn max-w-none">{renderRichText(event.description)}</div>
          {showItinerary && itinerary ? (
            <section className="mt-12">
              <h2 className="font-serif text-3xl text-primary">Itinerary</h2>
              <div className="prose-fn mt-4 max-w-none">{renderRichText(itinerary)}</div>
            </section>
          ) : null}
          <EventGallery title={event.title} items={gallery} />
        </>
      }
    />
  );
}
