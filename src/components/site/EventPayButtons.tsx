import { resolvePaypalUrl, resolveStripeUrl } from "@/lib/site-defaults";

export function EventPayButtons({
  event,
  settings,
  compact = false,
}: {
  event?: { stripeUrl?: string | null; paypalUrl?: string | null } | null;
  settings?: Record<string, string> | null;
  compact?: boolean;
}) {
  const stripeUrl = resolveStripeUrl(event, settings);
  const paypalUrl = resolvePaypalUrl(event, settings);
  if (!stripeUrl && !paypalUrl) return null;

  const buttonClass = compact
    ? "inline-flex rounded-full bg-primary px-4 py-2 text-sm text-white hover:bg-accent hover:text-deep"
    : "btn-primary no-underline";
  const ghostClass = compact
    ? "inline-flex rounded-full border border-primary/20 px-4 py-2 text-sm text-primary hover:bg-mist"
    : "btn-outline no-underline";

  return (
    <div className={`flex flex-wrap gap-3 ${compact ? "mt-4" : "mt-6"}`}>
      {stripeUrl ? (
        <a href={stripeUrl} target="_blank" rel="noreferrer" className={buttonClass}>
          Pay with Stripe
        </a>
      ) : null}
      {paypalUrl ? (
        <a href={paypalUrl} target="_blank" rel="noreferrer" className={ghostClass}>
          Pay with PayPal
        </a>
      ) : null}
    </div>
  );
}
