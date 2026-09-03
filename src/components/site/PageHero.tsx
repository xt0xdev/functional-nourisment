export function PageHero({
  eyebrow,
  heading,
  subheading,
}: {
  eyebrow?: string;
  heading: string;
  subheading?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-forest text-cream">
      <div className="grain absolute inset-0 opacity-40" />
      <div className="relative mx-auto max-w-4xl px-4 py-16 md:px-6 md:py-24">
        {eyebrow ? (
          <p className="text-xs uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
        ) : null}
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">{heading}</h1>
        {subheading ? <p className="mt-5 max-w-2xl text-lg text-cream/80">{subheading}</p> : null}
      </div>
    </section>
  );
}
