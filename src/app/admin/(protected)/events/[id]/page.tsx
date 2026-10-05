import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteEvent, saveEvent } from "../../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { InsertImageField } from "@/components/admin/InsertImageField";
import { PageLayoutDesigner } from "@/components/admin/PageLayoutDesigner";
import { eventMediaInclude } from "@/lib/media";
import { formatEventWhen } from "@/lib/events";
import { getEventLayout, resolveEventEditorLayout } from "@/lib/page-layout";

function dtLocal(value: Date | null) {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: eventMediaInclude,
  });
  if (!event) notFound();

  const storedLayout = getEventLayout(event.layout);
  const editorLayout = resolveEventEditorLayout(event.layout, {
    description: event.description,
    itinerary: event.itinerary,
    coverUrl: event.coverImage?.url || "",
    coverAlt: event.coverImage?.alt || event.title,
    gallery: event.images.map((item) => ({
      url: item.media.url,
      alt: item.media.alt || event.title,
    })),
  });
  const when = formatEventWhen(event.startsAt, event.endsAt);

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/events" className="hover:underline">
          ← Events
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit event</h1>
      <p className="mt-2 text-sm text-muted">
        Public URL: /{event.kind === "retreat" ? "retreats" : "events"}/{event.slug || event.id}.
        Title, date, location, and register or pay buttons stay on the event template. Use the body
        designer to place multiple photos around the copy. Photos live in the media library, not in
        the database.
      </p>

      <form action={saveEvent} className="mt-6 grid gap-6">
        <input type="hidden" name="id" value={event.id} />
        <div className="grid gap-4 rounded-2xl bg-white p-5">
          <label className="grid gap-1 text-sm">
            Title
            <input name="title" defaultValue={event.title} required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            URL slug
            <input name="slug" defaultValue={event.slug || ""} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Event type
            <select name="kind" defaultValue={event.kind || "workshop"} className="rounded-xl border border-forest/15 bg-white px-3 py-2">
              <option value="sound-bath">Sound bath</option>
              <option value="workshop">Workshop</option>
              <option value="retreat">Retreat</option>
              <option value="gathering">Gathering</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            Location
            <input name="location" defaultValue={event.location} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Starts
              <input type="datetime-local" name="startsAt" defaultValue={dtLocal(event.startsAt)} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
            </label>
            <label className="grid gap-1 text-sm">
              Ends
              <input type="datetime-local" name="endsAt" defaultValue={dtLocal(event.endsAt)} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm">
              Stripe payment link
              <input
                name="stripeUrl"
                defaultValue={event.stripeUrl}
                placeholder="https://book.stripe.com/..."
                className="rounded-xl border border-forest/15 bg-white px-3 py-2"
              />
            </label>
            <label className="grid gap-1 text-sm">
              PayPal payment link
              <input
                name="paypalUrl"
                defaultValue={event.paypalUrl}
                placeholder="https://www.paypal.com/..."
                className="rounded-xl border border-forest/15 bg-white px-3 py-2"
              />
            </label>
          </div>
          <p className="text-xs text-muted">
            Leave blank to use the default Sound Bath payment links from Site settings.
          </p>
          <MediaPicker
            label="Cover image"
            name="coverImageUrl"
            idName="coverImageId"
            defaultUrl={event.coverImage?.url || ""}
            defaultMediaId={event.coverImageId || ""}
            help="Shown on the events list and in the locked hero. The designer can also place this photo in the body."
          />
        </div>

        <PageLayoutDesigner
          initialLayout={editorLayout}
          pageTitle={event.title}
          heroHeading={event.title}
          heroSubheading={event.location}
          heroImage={event.coverImage?.url || ""}
          wasPublishedLayout={Boolean(storedLayout?.enabled && storedLayout.blocks.length)}
          title="Event body designer"
          enabledLabel="Use this layout on the live event"
          bodyLabel="Editable event body"
          help="Drag text and multiple images in the body. Event title, date, location, and register or pay buttons stay locked to the template. Wrap left or right so copy flows around a photo. On phones, blocks stack top to bottom."
          lockedAfterHero={
            <div className="pointer-events-none select-none bg-mist px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal">Event details · locked</p>
              <p className="mt-2 text-sm text-clay">{when}</p>
              {event.location ? <p className="text-sm text-muted">{event.location}</p> : null}
            </div>
          }
          lockedAfterBody={
            <div className="pointer-events-none select-none bg-white px-5 py-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-teal">Register & pay · locked</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="btn-primary">Register</span>
                <span className="btn-outline">Pay with Stripe</span>
                <span className="btn-outline">Pay with PayPal</span>
              </div>
            </div>
          }
        />

        <details className="rounded-2xl bg-white p-5">
          <summary className="cursor-pointer font-serif text-2xl text-forest">
            Listing copy & fallback body
          </summary>
          <p className="mt-2 text-sm text-muted">
            Description still appears on event listings and if the visual layout is off. Gallery photos
            are used on the live page only when the designed layout is off — add extra photos on the
            canvas to place them in the body.
          </p>
          <div className="mt-4 grid gap-4">
            <InsertImageField name="description" defaultValue={event.description} rows={8} label="Description" />
            <InsertImageField
              name="itinerary"
              defaultValue={event.itinerary}
              rows={10}
              label="Itinerary (shown on dedicated retreat pages when the layout is off)"
            />
            <MediaPicker
              label="Gallery"
              name="galleryIds"
              multiple
              defaultItems={event.images.map((item) => ({
                id: item.media.id,
                url: item.media.url,
                alt: item.media.alt,
                filename: item.media.filename,
              }))}
              help="Optional extra photos for the fallback gallery. Use Up/Down to reorder."
            />
          </div>
        </details>
        <div className="flex flex-wrap items-center gap-3">
          <input name="sortOrder" type="number" defaultValue={event.sortOrder} className="w-24 rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked={event.published} /> Published
          </label>
        </div>
        <button className="w-fit rounded-full bg-forest px-6 py-3 text-cream">Save event</button>
      </form>

      <form action={deleteEvent} className="mt-8">
        <input type="hidden" name="id" value={event.id} />
        <button className="text-sm text-clay">Delete this event</button>
      </form>
    </div>
  );
}
