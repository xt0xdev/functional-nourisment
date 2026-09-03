import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { deleteEvent, saveEvent } from "../../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { InsertImageField } from "@/components/admin/InsertImageField";
import { eventMediaInclude } from "@/lib/media";

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

  return (
    <div>
      <p className="text-sm text-muted">
        <Link href="/admin/events" className="hover:underline">
          ← Events
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-4xl text-forest">Edit event</h1>
      <p className="mt-2 text-sm text-muted">
        Public URL: /events/{event.slug || event.id}. Add a cover photo and as many gallery images as you like.
      </p>

      <form action={saveEvent} className="mt-6 grid gap-4">
        <input type="hidden" name="id" value={event.id} />
        <label className="grid gap-1 text-sm">
          Title
          <input name="title" defaultValue={event.title} required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          URL slug
          <input name="slug" defaultValue={event.slug || ""} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
        <InsertImageField name="description" defaultValue={event.description} rows={8} label="Description" />
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
        <MediaPicker
          label="Cover image"
          name="coverImageUrl"
          idName="coverImageId"
          defaultUrl={event.coverImage?.url || ""}
          defaultMediaId={event.coverImageId || ""}
          help="Shown on the events list and at the top of the event page."
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
          help="Optional extra photos. Use Up/Down to reorder."
        />
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
