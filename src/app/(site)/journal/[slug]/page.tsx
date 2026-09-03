import { notFound } from "next/navigation";
import { getPost, getPosts } from "@/lib/content";
import { buildMetadata, JsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/PageHero";
import { siteUrl } from "@/lib/content";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/journal/${post.slug}`,
  });
}

function renderMarkdown(body: string) {
  return body.split(/\n\n+/).map((block, index) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={index} className="font-serif text-3xl text-forest">
          {block.replace(/^## /, "")}
        </h2>
      );
    }
    if (/^\d+\.\s/.test(block)) {
      return (
        <p key={index} className="text-muted">
          {block}
        </p>
      );
    }
    return (
      <p key={index} className="leading-relaxed text-muted">
        {block}
      </p>
    );
  });
}

export default async function JournalPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.publishedAt,
          author: { "@type": "Person", name: "Anna Almiroudis" },
          publisher: { "@type": "Organization", name: "Functional Nourishment" },
          mainEntityOfPage: siteUrl(`/journal/${post.slug}`),
        }}
      />
      <PageHero heading={post.title} subheading={post.excerpt} />
      <article className="prose-fn mx-auto px-4 py-16 md:px-6">{renderMarkdown(post.body)}</article>
    </>
  );
}
