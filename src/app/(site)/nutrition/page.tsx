import { getPage, getSettings } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import { resolveAreaIcon } from "@/components/site/SupportIcons";
import { isStockOrEmptyImage } from "@/lib/site-images";
import { NUTRITION_HERO, NUTRITION_IMAGE, NUTRITION_IMAGE_ALT } from "@/lib/page-copy";
import { resolveHeroText, resolveNutritionContent } from "@/lib/page-templates";
import { getStoredLayout } from "@/lib/page-layout";
import { PageBodyOrLayout } from "@/components/site/PageLayoutBody";

export async function generateMetadata() {
  const page = await getPage("nutrition");
  return buildMetadata({
    title: page?.metaTitle || "Nutritionist in Queens & NYC | Functional Nutrition Counseling",
    description: page?.metaDescription || NUTRITION_HERO,
    path: "/nutrition",
  });
}

export default async function NutritionPage() {
  const [page, settings] = await Promise.all([getPage("nutrition"), getSettings()]);
  const hero = resolveHeroText(page);
  const content = resolveNutritionContent(page?.content);
  const layout = getStoredLayout(page?.content);

  return (
    <>
      <PageHero
        eyebrow="Body · Astoria, Queens & NYC"
        heading={hero.heading || "Nourish Body"}
        subheading={hero.subheading || NUTRITION_HERO}
        image={isStockOrEmptyImage(page?.heroImage) ? NUTRITION_IMAGE : page!.heroImage}
        imageAlt={page?.heroImageAlt || NUTRITION_IMAGE_ALT}
      />
      <PageBodyOrLayout
        layout={layout}
        fallback={
          <section className="bg-background">
            <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
                <SmartImage
                  src={content.cookingImage}
                  alt={content.cookingImageAlt}
                  fill
                  className="object-cover object-top"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <div>
                <h2 className="font-serif text-4xl text-primary md:text-5xl">{content.heading}</h2>
                <p className="mt-6 leading-relaxed text-muted">{content.intro}</p>
                <p className="mt-5 text-lg font-semibold leading-relaxed text-primary">{content.notAlone}</p>
                <p className="mt-5 leading-relaxed text-muted">{content.approach}</p>
                <p className="mt-5 leading-relaxed text-muted">{content.foodFirst}</p>
                <p className="mt-5 leading-relaxed text-muted">{content.goal}</p>
              </div>
            </div>
          </section>
        }
      />

      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">{content.howEyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.howHeading}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {content.howItWorks.map((step) => (
              <article key={step.title} className="rounded-3xl bg-background p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center font-serif text-xl italic text-primary md:text-2xl">
            {content.closing}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">{content.areasEyebrow}</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">{content.areasHeading}</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {content.areas.map((area) => {
              const Icon = resolveAreaIcon(area.title, area.icon);
              return (
                <article key={area.title} className="rounded-3xl bg-mist p-6">
                  <Icon className="h-9 w-9 text-teal" strokeWidth={1.6} />
                  <h3 className="mt-4 font-serif text-2xl text-primary">{area.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{area.detail}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
