import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { renderRichText } from "@/lib/rich-text";

export async function generateStaticParams() {
  const posts = await getPosts("recipe");
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, "recipe");
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/recipes/${post.slug}`,
    image: post.featuredImage || undefined,
  });
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug, "recipe");
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Recipe",
          name: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: "Anna Almiroudis" },
        }}
      />
      <PageHero
        eyebrow="Recipe"
        heading={post.title}
        subheading={post.excerpt}
        image={post.featuredImage || undefined}
        imageAlt={post.featuredImageAlt || post.title}
      />
      <article className="prose-fn mx-auto px-4 py-16 md:px-6">{renderRichText(post.body)}</article>
    </>
  );
}
