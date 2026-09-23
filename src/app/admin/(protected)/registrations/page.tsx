import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteEventRegistration } from "../actions";
import { formatEventWhen } from "@/lib/events";
import { parseRegistrationDetails } from "@/lib/registration";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: "desc" },
    include: { event: true },
  });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Event registrations</h1>
      <p className="mt-2 text-sm text-muted">
        People who completed the calendar or retreat registration form. Mailing-list opt-ins also
        appear under Subscribers.
      </p>
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white">
        <div className="hidden min-w-[920px] grid-cols-[1.1fr_1fr_140px_1.2fr_1.4fr_90px_auto] gap-4 border-b border-forest/10 px-4 py-3 text-xs uppercase tracking-wide text-muted md:grid">
          <span>Name</span>
          <span>Email / phone</span>
          <span>Opt-in</span>
          <span>Event</span>
          <span>Notes</span>
          <span>When</span>
          <span></span>
        </div>
        {registrations.length === 0 ? <p className="p-5 text-sm text-muted">No registrations yet.</p> : null}
        {registrations.map((registration) => {
          const details = parseRegistrationDetails(registration.details);
          const notes =
            registration.notes ||
            details.accessibilityNeeds ||
            details.foodAllergies ||
            details.hopes ||
            "";
          return (
            <div
              key={registration.id}
              className="grid gap-3 border-t border-forest/10 px-4 py-4 md:min-w-[920px] md:grid-cols-[1.1fr_1fr_140px_1.2fr_1.4fr_90px_auto]"
            >
              <div>
                <p className="font-medium text-forest">{registration.name}</p>
                <p className="text-xs text-muted">{registration.createdAt.toLocaleString()}</p>
              </div>
              <div className="text-sm text-muted">
                <p>{registration.email}</p>
                <p>{registration.phone || "No phone"}</p>
              </div>
              <p className="text-sm text-muted">{registration.mailingOptIn ? "Yes" : "No"}</p>
              <div>
                <p className="text-sm text-forest">{registration.event.title}</p>
                <p className="text-xs text-muted">{formatEventWhen(registration.event.startsAt, registration.event.endsAt)}</p>
              </div>
              <p className="text-sm text-muted">{notes || "—"}</p>
              <p className="text-xs text-muted">{registration.formKind}</p>
              <div className="flex items-center gap-3 text-sm">
                <Link href={`/admin/events/${registration.eventId}`} className="text-moss">
                  Event
                </Link>
                <form action={deleteEventRegistration}>
                  <input type="hidden" name="id" value={registration.id} />
                  <button className="text-clay">Delete</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
