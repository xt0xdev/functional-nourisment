import { getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("nutrition");
  return buildMetadata({
    title: page?.metaTitle || "Nutritionist in Queens & NYC | Functional Nutrition Counseling",
    description: page?.metaDescription || "",
    path: "/nutrition",
  });
}

type NutritionContent = {
  questions: string[];
  paragraphs: string[];
  howItWorks: string[];
};

export default async function NutritionPage() {
  const [page, settings] = await Promise.all([getPage("nutrition"), getSettings()]);
  const content = parseContent<NutritionContent>(page?.content || "{}", {
    questions: [],
    paragraphs: [],
    howItWorks: [],
  });

  return (
    <>
      <PageHero
        eyebrow="Body · Astoria, Queens & NYC"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image={
          page?.heroImage ||
          "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1400&q=80"
        }
        imageAlt={page?.heroImageAlt || "Nourishing bowl for functional nutrition clients in Astoria, Queens, and NYC"}
      />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="grid gap-4">
          {content.questions.map((question) => (
            <p key={question} className="rounded-2xl bg-white p-4 text-forest shadow-sm">
              {question}
            </p>
          ))}
        </div>
        <div className="prose-fn mt-10">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
          <h2>How does it work?</h2>
          {content.howItWorks.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} bookingUrl={settings.bookingUrl} />
    </>
  );
}
