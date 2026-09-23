export const EVENT_KINDS = ["sound-bath", "workshop", "retreat", "gathering"] as const;
export type EventKind = (typeof EVENT_KINDS)[number];

export const EVENT_KIND_LABELS: Record<EventKind, string> = {
  "sound-bath": "Sound bath",
  workshop: "Workshop",
  retreat: "Retreat",
  gathering: "Gathering",
};

type EventLike = {
  id?: string;
  slug?: string | null;
  kind?: string | null;
  title?: string | null;
  description?: string | null;
};

export function normalizeEventKind(value?: string | null): EventKind {
  const kind = (value || "").trim().toLowerCase().replace(/[_\s]+/g, "-");
  if (kind === "sound-bath" || kind === "soundbath") return "sound-bath";
  if (kind === "retreat") return "retreat";
  if (kind === "gathering") return "gathering";
  if (kind === "workshop") return "workshop";
  return "workshop";
}

export function inferEventKind(event: EventLike): EventKind {
  const explicit = normalizeEventKind(event.kind);
  const haystack = `${event.title || ""} ${event.description || ""} ${event.kind || ""}`;
  if (explicit === "retreat" || /retreat/i.test(haystack)) return "retreat";
  if (explicit === "sound-bath" || /sound[\s-]?bath/i.test(haystack)) return "sound-bath";
  if (explicit === "gathering" || /gathering/i.test(haystack)) return "gathering";
  return "workshop";
}

export function isRetreatEvent(event: EventLike) {
  return inferEventKind(event) === "retreat";
}

export function eventSlug(event: EventLike) {
  return event.slug || event.id || "";
}

export function eventPublicPath(event: EventLike) {
  const slug = eventSlug(event);
  return isRetreatEvent(event) ? `/retreats/${slug}` : `/events/${slug}`;
}

export function eventRegisterPath(event: EventLike) {
  const slug = eventSlug(event);
  return isRetreatEvent(event) ? `/retreats/${slug}/register` : `/calendar/${slug}/register`;
}

export type CalendarEventDTO = {
  id: string;
  slug: string;
  title: string;
  type: EventKind;
  typeLabel: string;
  startsAt: string | null;
  endsAt: string | null;
  location: string;
  description: string;
  coverUrl: string | null;
  coverAlt: string;
  detailsHref: string;
  registerHref: string;
  acceptsRegistration: boolean;
};

export function acceptsRegistration(event: EventLike) {
  const kind = inferEventKind(event);
  return kind === "sound-bath" || kind === "workshop" || kind === "retreat" || kind === "gathering";
}

export function toCalendarEvent(event: {
  id: string;
  slug?: string | null;
  title: string;
  description: string;
  kind?: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  location: string;
  coverImage?: { url: string; alt?: string | null } | null;
}): CalendarEventDTO {
  const kind = inferEventKind(event);
  const slug = eventSlug(event);
  return {
    id: event.id,
    slug,
    title: event.title,
    type: kind,
    typeLabel: EVENT_KIND_LABELS[kind],
    startsAt: event.startsAt ? event.startsAt.toISOString() : null,
    endsAt: event.endsAt ? event.endsAt.toISOString() : null,
    location: event.location,
    description: event.description.replace(/!\[[^\]]*\]\([^)]+\)/g, "").trim(),
    coverUrl: event.coverImage?.url || null,
    coverAlt: event.coverImage?.alt || event.title,
    detailsHref: eventPublicPath(event),
    registerHref: eventRegisterPath(event),
    acceptsRegistration: acceptsRegistration(event),
  };
}

export function monthLabel(value: Date | string | null | undefined) {
  if (!value) return "Open scheduling";
  return new Date(value).toLocaleString("en-US", {
    timeZone: "America/New_York",
    month: "long",
    year: "numeric",
  });
}

export function nyDateKey(value: Date | string | null | undefined) {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function formatEventWhen(
  startsAt: Date | string | null | undefined,
  endsAt?: Date | string | null,
) {
  if (!startsAt) return "Date to be announced";
  const startDate = new Date(startsAt);
  const start = startDate.toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
  if (!endsAt) return start;
  const end = new Date(endsAt).toLocaleString("en-US", {
    timeZone: "America/New_York",
    hour: "numeric",
    minute: "2-digit",
  });
  return `${start} – ${end}`;
}

export function formatEventDateLabel(startsAt: Date | string | null | undefined) {
  if (!startsAt) return "Date to be announced";
  return new Date(startsAt).toLocaleString("en-US", {
    timeZone: "America/New_York",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
