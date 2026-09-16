export function CalendlyEmbed({
  url,
  title = "Schedule your complimentary discovery call",
}: {
  url: string;
  title?: string;
}) {
  const href = url.trim();
  if (!href) return null;

  const isCalendly = href.includes("calendly.com");
  const embedSrc = isCalendly
    ? `${href}${href.includes("?") ? "&" : "?"}hide_gdpr_banner=1`
    : href;

  return (
    <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-primary/10">
      <p className="font-serif text-2xl text-primary">{title}</p>
      <p className="mt-2 text-sm text-muted">
        Your inquiry has been saved. Choose a time below — Anna reviews messages before the call.
      </p>
      {isCalendly ? (
        <iframe
          src={embedSrc}
          title={title}
          className="mt-4 min-h-[720px] w-full rounded-2xl border-0"
        />
      ) : (
        <a className="btn-primary mt-5" href={href} target="_blank" rel="noreferrer">
          Continue to scheduling
        </a>
      )}
    </div>
  );
}
