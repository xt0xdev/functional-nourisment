import Link from "next/link";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { SmartImage } from "@/components/site/SmartImage";
import { NOURISH_RECIPE_TAGS, NOURISH_RECIPES_BODY, NOURISH_RECIPES_LEAD } from "@/lib/page-copy";
import { SITE_IMAGES } from "@/lib/site-images";

export const metadata = buildMetadata({
  title: "Nourishing Recipes | Functional Nourishment",
  description: NOURISH_RECIPES_BODY,
  path: "/recipes",
});

export default async function RecipesPage() {
  const recipes = await getPosts("recipe");

  return (
    <>
      <PageHero
        eyebrow="Nourish"
        heading="Recipes"
        subheading={NOURISH_RECIPES_LEAD}
        image={SITE_IMAGES.bodyBowl}
        imageAlt={SITE_IMAGES.bodyBowlAlt}
      />
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{NOURISH_RECIPES_BODY}</p>
        <p className="mt-4 text-sm text-teal">{NOURISH_RECIPE_TAGS.join(" · ")}</p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {recipes.map((post) => (
            <article key={post.id} className="overflow-hidden rounded-3xl bg-white shadow-sm">
              {post.featuredImage ? (
                <Link href={`/recipes/${post.slug}`} className="relative block aspect-[16/9]">
                  <SmartImage
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 768px) 50vw, 100vw"
                  />
                </Link>
              ) : null}
              <div className="p-6">
                <h2 className="font-serif text-3xl text-primary">
                  <Link href={`/recipes/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="mt-3 text-muted">{post.excerpt}</p>
                {post.tags ? <p className="mt-3 text-xs uppercase tracking-wide text-teal">{post.tags}</p> : null}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
