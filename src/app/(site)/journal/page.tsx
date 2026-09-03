import Link from "next/link";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const metadata = buildMetadata({
  title: "Nutrition Journal | Insights from an Astoria & NYC Nutritionist",
  description:
    "Guides on functional nutrition, IBS, prediabetes, and booking an in-network nutritionist in Astoria, Queens, and New York City.",
  path: "/journal",
});

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="News"
        heading="Notes on food, mood, and care in Astoria, Queens & NYC"
        subheading="Practical writing for New Yorkers in Astoria, Queens, and across the city looking for a nutritionist who takes the whole person seriously."
        image="https://images.unsplash.com/photo-1456327102063-fb5054efe647?auto=format&fit=crop&w=1400&q=80"
        imageAlt="Notebook for nutrition writing from an Astoria, Queens practice"
      />
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="font-serif text-3xl text-forest">
                <Link href={`/journal/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="mt-3 text-muted">{post.excerpt}</p>
              <Link href={`/journal/${post.slug}`} className="mt-4 inline-block text-sm text-moss">
                Continue reading
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
