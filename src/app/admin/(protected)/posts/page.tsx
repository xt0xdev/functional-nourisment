import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost, generateContentDraft, savePost } from "../actions";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { InsertImageField } from "@/components/admin/InsertImageField";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Journal & Recipes</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">
        Generate unpublished drafts, then edit and publish. Nothing auto-publishes. After you publish,
        mailing-list send is manual for now — use the Subscribers list if you want to email people
        yourself.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <form action={generateContentDraft}>
          <input type="hidden" name="kind" value="journal" />
          <button className="rounded-full bg-forest px-4 py-2 text-cream">Generate journal draft</button>
        </form>
        <form action={generateContentDraft}>
          <input type="hidden" name="kind" value="recipe" />
          <button className="rounded-full border border-forest px-4 py-2 text-forest">
            Generate recipe draft
          </button>
        </form>
      </div>
      <form action={savePost} className="mt-6 grid gap-3 rounded-2xl bg-white p-5">
        <h2 className="font-serif text-2xl text-forest">New post</h2>
        <input name="title" placeholder="Title" required className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="slug" placeholder="slug" required className="rounded-xl border border-forest/15 px-3 py-2" />
        <select name="kind" className="rounded-xl border border-forest/15 px-3 py-2">
          <option value="journal">Journal</option>
          <option value="recipe">Recipe</option>
        </select>
        <input name="tags" placeholder="Tags (comma separated)" className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="metaTitle" placeholder="SEO title" className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="metaDescription" placeholder="SEO description" className="rounded-xl border border-forest/15 px-3 py-2" />
        <textarea name="excerpt" placeholder="Excerpt" className="rounded-xl border border-forest/15 px-3 py-2" />
        <MediaPicker label="Featured image" name="featuredImage" />
        <input name="featuredImageAlt" placeholder="Featured image alt text" className="rounded-xl border border-forest/15 px-3 py-2" />
        <InsertImageField name="body" defaultValue="" rows={8} label="Body" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" /> Published
        </label>
        <button className="w-fit rounded-full bg-forest px-4 py-2 text-cream">Save draft</button>
      </form>
      <div className="mt-8 overflow-hidden rounded-2xl bg-white">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center gap-4 border-t border-forest/10 p-4 first:border-t-0">
            <div className="h-14 w-16 overflow-hidden rounded-lg bg-sand">
              {post.featuredImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.featuredImage} alt={post.featuredImageAlt || post.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-[10px] text-muted">—</div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium text-forest">{post.title}</p>
              <p className="text-sm text-muted">
                {post.kind === "recipe" ? `/recipes/${post.slug}` : `/journal/${post.slug}`} ·{" "}
                {post.kind} · {post.published ? "Published" : "Draft"} · {post.publishedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href={`/admin/posts/${post.id}`} className="text-sm text-moss">
                Edit
              </Link>
              <form action={deletePost}>
                <input type="hidden" name="id" value={post.id} />
                <button className="text-sm text-clay">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
