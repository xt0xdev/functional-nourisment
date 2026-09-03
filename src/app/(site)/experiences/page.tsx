import { getExperiences, getPage, getSettings, parseContent } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { CtaBand } from "@/components/site/CtaBand";

export async function generateMetadata() {
  const page = await getPage("experiences");
  return buildMetadata({
    title: page?.metaTitle || "Experiences",
    description: page?.metaDescription || "",
    path: "/experiences",
  });
}

export default async function ExperiencesPage() {
  const [page, settings, experiences] = await Promise.all([
    getPage("experiences"),
    getSettings(),
    getExperiences(),
  ]);
  const content = parseContent<{ intro: string }>(page?.content || "{}", { intro: "" });

  return (
    <>
      <PageHero
        eyebrow="Community"
        heading={page?.heroHeading || ""}
        subheading={page?.heroSubheading}
        image="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Hands preparing fresh herbs and whole foods"
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{content.intro}</p>
        <div className="mt-10 grid gap-6">
          {experiences.map((experience) => (
            <article key={experience.id} className="rounded-3xl bg-white p-8 shadow-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-clay">{experience.subtitle}</p>
              <h2 className="mt-2 font-serif text-3xl text-forest">{experience.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{experience.body}</p>
            </article>
          ))}
        </div>
      </section>
      <CtaBand berryStreetUrl={settings.berryStreetUrl} />
    </>
  );
}
