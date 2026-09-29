import Link from "next/link";
import { getPage, getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { NOURISH_DESCRIPTION, NOURISH_HERO_LINE, NOURISH_TITLE } from "@/lib/page-copy";
import { resolveHeroText, resolveNourishContent } from "@/lib/page-templates";
import { SITE_IMAGES, isStockOrEmptyImage } from "@/lib/site-images";

function postHref(kind: string, slug: string) {
  return kind === "recipe" ? `/recipes/${slug}` : `/journal/${slug}`;
}

export async function generateMetadata() {
  const page = await getPage("nourish");
  return buildMetadata({
    title: page?.metaTitle || "Nourish | Journal, Recipes & Resources",
    description: page?.metaDescription || NOURISH_DESCRIPTION,
    path: "/nourish",
  });
}

export default async function NourishPage() {
  const [page, journal, recipes] = await Promise.all([
    getPage("nourish"),
    getPosts("journal"),
    getPosts("recipe"),
  ]);
  const hero = resolveHeroText(page);
  const content = resolveNourishContent(page?.content);

  return (
    <>
      <PageHero
        eyebrow="Nourish"
        heading={hero.heading || NOURISH_TITLE}
        subheading={hero.subheading || NOURISH_HERO_LINE}
        image={isStockOrEmptyImage(page?.heroImage) ? SITE_IMAGES.bodyBowl : page!.heroImage}
        imageAlt={page?.heroImageAlt || SITE_IMAGES.bodyBowlAlt}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{content.description}</p>

        <section id="journal" className="mt-16 scroll-mt-28">
          <p className="eyebrow">Journal</p>
          <h2 className="mt-3 font-serif text-4xl text-primary">{content.insightsHeading}</h2>
          <p className="mt-4 max-w-3xl font-medium text-primary">{content.journalLead}</p>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">{content.journalBody}</p>
          <p className="mt-4 text-sm text-teal">{content.journalTags.join(" · ")}</p>
          <div className="mt-8 grid gap-5">
            {journal.slice(0, 4).map((post) => (
              <article key={post.id} className="rounded-3xl bg-white p-6 shadow-sm">
                <h3 className="font-serif text-2xl text-primary">
                  <Link href={postHref(post.kind, post.slug)}>{post.title}</Link>
                </h3>
                <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
                <Link href={postHref(post.kind, post.slug)} className="mt-4 inline-flex text-sm text-teal hover:underline">
                  Continue reading →
                </Link>
              </article>
            ))}
          </div>
          <Link href="/journal" className="btn-outline mt-8">
            View all insights
          </Link>
        </section>

        <section id="recipes" className="mt-16 scroll-mt-28">
          <p className="eyebrow">Recipes</p>
          <h2 className="mt-3 font-serif text-4xl text-primary">{content.recipesLead}</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted">{content.recipesBody}</p>
          <p className="mt-4 text-sm text-teal">{content.recipeTags.join(" · ")}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {recipes.map((post) => (
              <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                {post.featuredImage ? (
                  <Link href={postHref(post.kind, post.slug)} className="relative block aspect-[4/3]">
                    <SmartImage
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 33vw, 100vw"
                    />
                  </Link>
                ) : null}
                <div className="p-5">
                  <h3 className="font-serif text-2xl text-primary">
                    <Link href={postHref(post.kind, post.slug)}>{post.title}</Link>
                  </h3>
                  <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
          <Link href="/recipes" className="btn-outline mt-8">
            Browse recipes
          </Link>
        </section>

        <section id="resources" className="mt-16 scroll-mt-28 rounded-3xl bg-mist p-8">
          <p className="eyebrow">Resources</p>
          <h2 className="mt-3 font-serif text-4xl text-primary">{content.resourcesHeading}</h2>
          <p className="mt-4 max-w-3xl text-muted">{content.resourcesBody}</p>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            <li>
              <Link href="/nutrition" className="text-teal hover:underline">
                Nourish Body — nutrition counseling
              </Link>
            </li>
            <li>
              <Link href="/sound-healing" className="text-teal hover:underline">
                Nourish Mind — sound, breath, and meditation
              </Link>
            </li>
            <li>
              <Link href="/experiences" className="text-teal hover:underline">
                Workshops & Experiences
              </Link>
            </li>
            <li>
              <Link href="/retreats" className="text-teal hover:underline">
                Retreats
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-teal hover:underline">
                Inquire or ask a question
              </Link>
            </li>
            <li>
              <Link href="/book" className="text-teal hover:underline">
                Book a Discovery Call
              </Link>
            </li>
          </ul>
        </section>
      </section>
    </>
  );
}
