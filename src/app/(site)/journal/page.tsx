import Link from "next/link";
import { getPosts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";

export const metadata = buildMetadata({
  title: "Nutrition Journal | NYC Functional Nutrition Insights",
  description:
    "Guides on functional nutrition, IBS, prediabetes, and booking an in-network nutritionist in New York City.",
  path: "/journal",
});

export default async function JournalPage() {
  const posts = await getPosts();

  return (
    <>
      <PageHero
        eyebrow="Journal"
        heading="Notes on food, mood, and metro-area care"
        subheading="Practical writing for New Yorkers looking for a nutritionist who takes the whole person seriously."
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
