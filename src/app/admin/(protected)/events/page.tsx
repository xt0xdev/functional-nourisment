import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createEvent, deleteEvent, toggleEventPublished } from "../actions";
import { eventMediaInclude } from "@/lib/media";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: [{ sortOrder: "asc" }, { startsAt: "asc" }],
    include: eventMediaInclude,
  });

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-forest">Events</h1>
          <p className="mt-2 text-sm text-muted">
            Add a cover photo and gallery when you post an event. Photos live in the media library, not in the database.
          </p>
        </div>
        <form action={createEvent}>
          <button className="rounded-full bg-forest px-5 py-2 text-cream">Add event</button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white">
        <div className="hidden grid-cols-[88px_1fr_160px_100px_auto] gap-4 border-b border-forest/10 px-4 py-3 text-xs uppercase tracking-wide text-muted md:grid">
          <span>Photo</span>
          <span>Event</span>
          <span>Date</span>
          <span>Status</span>
          <span></span>
        </div>
        {events.length === 0 ? <p className="p-5 text-sm text-muted">No events yet.</p> : null}
        {events.map((event) => (
          <div
            key={event.id}
            className="grid items-center gap-3 border-t border-forest/10 px-4 py-4 md:grid-cols-[88px_1fr_160px_100px_auto]"
          >
            <div className="h-16 w-20 overflow-hidden rounded-xl bg-sand">
              {event.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={event.coverImage.url} alt={event.coverImage.alt || event.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted">No photo</div>
              )}
            </div>
            <div>
              <Link href={`/admin/events/${event.id}`} className="font-medium text-forest hover:underline">
                {event.title}
              </Link>
              <p className="text-xs text-muted">
                /events/{event.slug || event.id}
                {event.images.length ? ` · ${event.images.length} gallery` : ""}
              </p>
            </div>
            <p className="text-sm text-muted">
              {event.startsAt
                ? event.startsAt.toLocaleString("en-US", { timeZone: "America/New_York", month: "short", day: "numeric", year: "numeric" })
                : "No date"}
            </p>
            <form action={toggleEventPublished} className="text-sm">
              <input type="hidden" name="id" value={event.id} />
              {event.published ? null : <input type="hidden" name="published" value="on" />}
              <button className={event.published ? "text-moss" : "text-muted"}>
                {event.published ? "Published" : "Draft"}
              </button>
            </form>
            <div className="flex items-center gap-3 text-sm">
              <Link href={`/admin/events/${event.id}`} className="text-moss">
                Edit
              </Link>
              <form action={deleteEvent}>
                <input type="hidden" name="id" value={event.id} />
                <button className="text-clay">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
