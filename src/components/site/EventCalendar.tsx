"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SmartImage } from "./SmartImage";
import { formatEventWhen, monthLabel, nyDateKey, type CalendarEventDTO } from "@/lib/events";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfMonth(year: number, month: number) {
  return new Date(year, month, 1);
}

export function EventCalendar({
  events,
  emptyTitle = "No upcoming public dates just yet",
  emptyBody = "New sound baths, workshops, retreats, and gatherings are posted here as they are scheduled. Join the mailing list or write to Anna to plan a private session.",
}: {
  events: CalendarEventDTO[];
  emptyTitle?: string;
  emptyBody?: string;
}) {
  const datedEvents = useMemo(() => events.filter((event) => event.startsAt), [events]);
  const now = new Date();
  const [cursor, setCursor] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const [openId, setOpenId] = useState<string | null>(datedEvents[0]?.id ?? null);
  const [selectedDay, setSelectedDay] = useState("");

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEventDTO[]>();
    for (const event of datedEvents) {
      const key = nyDateKey(event.startsAt);
      if (!key) continue;
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [datedEvents]);

  const grouped = useMemo(() => {
    const map = new Map<string, CalendarEventDTO[]>();
    const visible = selectedDay
      ? datedEvents.filter((event) => nyDateKey(event.startsAt) === selectedDay)
      : datedEvents;
    for (const event of visible) {
      if (!event.startsAt) continue;
      const key = monthLabel(event.startsAt);
      const list = map.get(key) ?? [];
      list.push(event);
      map.set(key, list);
    }
    return Array.from(map.entries());
  }, [datedEvents, selectedDay]);

  const monthDate = startOfMonth(cursor.year, cursor.month);
  const monthTitle = monthDate.toLocaleString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = monthDate.getDay();
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    if (index < firstWeekday) return null;
    return index - firstWeekday + 1;
  });

  function shiftMonth(delta: number) {
    setSelectedDay("");
    setCursor((current) => {
      const next = new Date(current.year, current.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
  }

  function dayKey(day: number) {
    const month = String(cursor.month + 1).padStart(2, "0");
    return `${cursor.year}-${month}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="space-y-10">
      <aside className="rounded-3xl bg-white p-6 shadow-sm md:p-10">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={() => shiftMonth(-1)} className="btn-outline px-4 py-2 text-sm">
            Prev
          </button>
          <p className="font-serif text-2xl text-primary md:text-4xl">{monthTitle}</p>
          <button type="button" onClick={() => shiftMonth(1)} className="btn-outline px-4 py-2 text-sm">
            Next
          </button>
        </div>
        <div className="mt-8 grid grid-cols-7 gap-2 text-center text-xs uppercase tracking-wide text-muted md:text-sm">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {cells.map((day, index) => {
            if (!day) return <span key={`empty-${index}`} />;
            const key = dayKey(day);
            const dayEvents = eventsByDay.get(key) || [];
            const active = selectedDay === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (!dayEvents.length) {
                    setSelectedDay("");
                    return;
                  }
                  setSelectedDay(active ? "" : key);
                  setOpenId(dayEvents[0]?.id ?? null);
                }}
                className={`relative min-h-12 rounded-2xl px-1 py-3 text-base md:min-h-16 md:text-lg ${
                  active
                    ? "bg-primary text-white"
                    : dayEvents.length
                      ? "bg-mist text-primary"
                      : "text-muted hover:bg-mist"
                }`}
              >
                {day}
                {dayEvents.length ? (
                  <span
                    className={`mx-auto mt-1 block h-1.5 w-1.5 rounded-full ${active ? "bg-white" : "bg-teal"}`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>
        {selectedDay ? (
          <button
            type="button"
            onClick={() => setSelectedDay("")}
            className="mt-6 text-sm text-teal hover:underline"
          >
            Show all upcoming dates
          </button>
        ) : (
          <p className="mt-6 text-sm text-muted">Days with a teal mark have a published experience.</p>
        )}
      </aside>

      <div>
        {datedEvents.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">{emptyTitle}</h2>
            <p className="mt-3 leading-relaxed text-muted">{emptyBody}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary">
                Inquire about a private session
              </Link>
              <Link href="/event-policy" className="btn-outline">
                Cancellation policy
              </Link>
            </div>
          </div>
        ) : grouped.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="font-serif text-3xl text-primary">No experiences on this date</h2>
            <p className="mt-3 text-muted">Choose another day, or view the full upcoming list.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {grouped.map(([month, items]) => (
              <section key={month}>
                <p className="eyebrow">{month}</p>
                <div className="mt-4 space-y-4">
                  {items.map((event) => {
                    const open = openId === event.id;
                    return (
                      <article key={event.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                        <button
                          type="button"
                          className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left"
                          onClick={() => setOpenId(open ? null : event.id)}
                          aria-expanded={open}
                        >
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-mist px-3 py-1 text-xs uppercase tracking-wide text-teal">
                                {event.typeLabel}
                              </span>
                              <span className="text-sm text-teal">{formatEventWhen(event.startsAt, event.endsAt)}</span>
                            </div>
                            <h2 className="mt-2 font-serif text-2xl text-primary">{event.title}</h2>
                            {event.location ? <p className="mt-1 text-sm text-muted">{event.location}</p> : null}
                          </div>
                          <span className="mt-1 text-sm text-teal">{open ? "Hide" : "Details"}</span>
                        </button>
                        {open ? (
                          <div className="border-t border-forest/10 px-6 py-6">
                            <div className={event.coverUrl ? "grid gap-6 md:grid-cols-[220px_1fr]" : ""}>
                              {event.coverUrl ? (
                                <div className="relative min-h-44 overflow-hidden rounded-2xl">
                                  <SmartImage
                                    src={event.coverUrl}
                                    alt={event.coverAlt}
                                    fill
                                    className="object-cover"
                                    sizes="220px"
                                  />
                                </div>
                              ) : null}
                              <div>
                                {event.description ? (
                                  <p className="leading-relaxed text-muted">{event.description}</p>
                                ) : (
                                  <p className="leading-relaxed text-muted">
                                    More details will be shared after you reserve your spot.
                                  </p>
                                )}
                                <div className="mt-6 flex flex-wrap gap-3">
                                  {event.type === "retreat" ? (
                                    <>
                                      <Link href={event.detailsHref} className="btn-outline">
                                        View retreat
                                      </Link>
                                      <Link href={event.registerHref} className="btn-primary">
                                        Register
                                      </Link>
                                    </>
                                  ) : (
                                    <>
                                      <Link href={event.registerHref} className="btn-primary">
                                        {event.acceptsRegistration ? "Register" : "Reserve your spot"}
                                      </Link>
                                      <Link href={event.detailsHref} className="btn-outline">
                                        Full details
                                      </Link>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
