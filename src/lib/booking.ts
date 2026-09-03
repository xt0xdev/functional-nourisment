export const DEFAULT_BOOKING_URL =
  "https://www.berrystreet.co/provider-details/anna-almiroudis";

const BOOKING_LABELS = new Set(["book a discovery call", "book now"]);

export function resolveBookingUrl(settings?: Record<string, string> | string | null): string {
  if (typeof settings === "string" && settings.trim()) return settings.trim();
  if (settings && typeof settings === "object") {
    const value = settings.bookingUrl?.trim();
    if (value) return value;
  }
  return DEFAULT_BOOKING_URL;
}

export function isBookingCta(label: string, href = ""): boolean {
  if (BOOKING_LABELS.has(label.trim().toLowerCase())) return true;

  const normalized = href.trim().toLowerCase();
  if (!normalized) return false;
  if (normalized === "/book" || normalized.endsWith("/book")) return true;
  if (normalized.includes("practicebetter.io") && normalized.includes("booking")) return true;
  return false;
}

export function applyBookingUrl<T extends { label: string; href: string; openInNew?: boolean }>(
  item: T,
  bookingUrl: string,
): T {
  if (!bookingUrl || !isBookingCta(item.label, item.href)) return item;
  return {
    ...item,
    href: bookingUrl,
    openInNew: bookingUrl.startsWith("http") ? true : item.openInNew,
  };
}

export function bookingLinkProps(href: string) {
  return href.startsWith("http")
    ? { href, target: "_blank" as const, rel: "noreferrer" }
    : { href };
}
