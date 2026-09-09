import { SmartImage } from "./SmartImage";

export function PageHero({
  eyebrow,
  heading,
  headingSubtitle,
  subheading,
  image,
  imageAlt,
}: {
  eyebrow?: string;
  heading: string;
  headingSubtitle?: string;
  subheading?: string;
  image?: string;
  imageAlt?: string;
}) {
  return (
    <section className="bg-background">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
          <h1 className="mt-3 font-serif text-4xl leading-tight text-primary md:text-6xl">{heading}</h1>
          {headingSubtitle ? (
            <p className="mt-2 font-serif text-xl tracking-wide text-primary/75 md:text-2xl">{headingSubtitle}</p>
          ) : null}
          {subheading ? <p className="mt-5 max-w-xl text-lg text-muted">{subheading}</p> : null}
        </div>
        {image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
            <SmartImage src={image} alt={imageAlt || heading} fill className="object-cover" priority sizes="(min-width: 768px) 50vw, 100vw" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
