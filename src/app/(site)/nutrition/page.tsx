import { Activity, Heart, Leaf, Scale, Sparkle, Sun } from "lucide-react";
import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";
import { SmartImage } from "@/components/site/SmartImage";
import {
  NUTRITION_APPROACH,
  NUTRITION_AREAS,
  NUTRITION_CLOSING,
  NUTRITION_FOOD_FIRST,
  NUTRITION_GOAL,
  NUTRITION_HEADING,
  NUTRITION_HERO,
  NUTRITION_HOW_IT_WORKS,
  NUTRITION_IMAGE,
  NUTRITION_IMAGE_ALT,
  NUTRITION_INTRO,
  NUTRITION_NOT_ALONE,
} from "@/lib/page-copy";

export async function generateMetadata() {
  const page = await getPage("nutrition");
  return buildMetadata({
    title: page?.metaTitle || "Nutritionist in Queens & NYC | Functional Nutrition Counseling",
    description: page?.metaDescription || NUTRITION_HERO,
    path: "/nutrition",
  });
}

const areaIcons = {
  heart: Heart,
  activity: Activity,
  scale: Scale,
  leaf: Leaf,
  sparkle: Sparkle,
  sun: Sun,
} as const;

type NutritionContent = {
  intro?: string;
  notAlone?: string;
  approach?: string;
  foodFirst?: string;
  goal?: string;
  closing?: string;
};

export default async function NutritionPage() {
  const [page, settings] = await Promise.all([getPage("nutrition"), getSettings()]);
  const content = parseContent<NutritionContent>(page?.content || "{}", {});
  const intro = content.intro?.includes("overwhelmed by conflicting") ? content.intro : NUTRITION_INTRO;
  const notAlone = content.notAlone?.includes("don’t have to figure") ? content.notAlone : NUTRITION_NOT_ALONE;
  const approach = content.approach?.includes("nutrition should be as individual") ? content.approach : NUTRITION_APPROACH;
  const foodFirst = content.foodFirst?.includes("personalized, food-first") ? content.foodFirst : NUTRITION_FOOD_FIRST;
  const goal = content.goal?.includes("isn't simply to tell you") ? content.goal : NUTRITION_GOAL;
  const closing = content.closing?.includes("Lasting change") ? content.closing : NUTRITION_CLOSING;

  return (
    <>
      <PageHero
        eyebrow="Body · Astoria, Queens & NYC"
        heading={page?.heroHeading || "Nourish Body"}
        subheading={page?.heroSubheading?.includes("foundation of your well-being") ? page.heroSubheading : NUTRITION_HERO}
        image={page?.heroImage || NUTRITION_IMAGE}
        imageAlt={page?.heroImageAlt || NUTRITION_IMAGE_ALT}
      />
      <section className="bg-background">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-mist">
            <SmartImage
              src={NUTRITION_IMAGE}
              alt={NUTRITION_IMAGE_ALT}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl text-primary md:text-5xl">{NUTRITION_HEADING}</h2>
            <p className="mt-6 leading-relaxed text-muted">{intro}</p>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-primary">{notAlone}</p>
            <p className="mt-5 leading-relaxed text-muted">{approach}</p>
            <p className="mt-5 leading-relaxed text-muted">{foodFirst}</p>
            <p className="mt-5 leading-relaxed text-muted">{goal}</p>
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">How it works</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {NUTRITION_HOW_IT_WORKS.map((step) => (
              <article key={step.title} className="rounded-3xl bg-background p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-primary">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{step.text}</p>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center font-serif text-xl italic text-primary md:text-2xl">
            {closing}
          </p>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
          <p className="eyebrow">Care that meets you where you are</p>
          <h2 className="mt-3 font-serif text-4xl text-primary md:text-5xl">Areas I Support</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {NUTRITION_AREAS.map((area) => {
              const Icon = areaIcons[area.icon];
              return (
                <article key={area.title} className="rounded-3xl bg-mist p-6">
                  <Icon className="h-7 w-7 text-teal" strokeWidth={1.5} />
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
