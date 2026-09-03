import { prisma } from "@/lib/prisma";
import { deleteEvent, saveEvent } from "../actions";

function dtLocal(value: Date | null) {
  if (!value) return "";
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Events</h1>
      <div className="mt-6 space-y-6">
        {events.map((event) => (
          <form key={event.id} action={saveEvent} className="grid gap-3 rounded-2xl bg-white p-5">
            <input type="hidden" name="id" value={event.id} />
            <input name="title" defaultValue={event.title} className="rounded-xl border border-forest/15 px-3 py-2" />
            <textarea name="description" defaultValue={event.description} rows={4} className="rounded-xl border border-forest/15 px-3 py-2" />
            <input name="location" defaultValue={event.location} className="rounded-xl border border-forest/15 px-3 py-2" />
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="datetime-local" name="startsAt" defaultValue={dtLocal(event.startsAt)} className="rounded-xl border border-forest/15 px-3 py-2" />
              <input type="datetime-local" name="endsAt" defaultValue={dtLocal(event.endsAt)} className="rounded-xl border border-forest/15 px-3 py-2" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input name="sortOrder" type="number" defaultValue={event.sortOrder} className="w-24 rounded-xl border border-forest/15 px-3 py-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={event.published} /> Published
              </label>
              <button className="rounded-full bg-forest px-4 py-2 text-sm text-cream">Save</button>
            </div>
          </form>
        ))}
        <form action={saveEvent} className="grid gap-3 rounded-2xl border border-dashed border-forest/20 p-5">
          <h2 className="font-serif text-2xl text-forest">Add event</h2>
          <input name="title" placeholder="Title" required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <textarea name="description" placeholder="Description" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="location" placeholder="Location" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input type="datetime-local" name="startsAt" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input type="datetime-local" name="endsAt" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="sortOrder" type="number" defaultValue={99} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button className="w-fit rounded-full bg-forest px-4 py-2 text-cream">Create</button>
        </form>
        {events.map((event) => (
          <form key={`del-${event.id}`} action={deleteEvent}>
            <input type="hidden" name="id" value={event.id} />
            <button className="text-sm text-clay">Delete {event.title}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
