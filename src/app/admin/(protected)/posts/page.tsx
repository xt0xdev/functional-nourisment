import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost, savePost } from "../actions";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Journal</h1>
      <form action={savePost} className="mt-6 grid gap-3 rounded-2xl bg-white p-5">
        <h2 className="font-serif text-2xl text-forest">New post</h2>
        <input name="title" placeholder="Title" required className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="slug" placeholder="slug" required className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="metaTitle" placeholder="SEO title" className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="metaDescription" placeholder="SEO description" className="rounded-xl border border-forest/15 px-3 py-2" />
        <textarea name="excerpt" placeholder="Excerpt" className="rounded-xl border border-forest/15 px-3 py-2" />
        <textarea name="body" placeholder="Body (use ## for headings)" rows={8} className="rounded-xl border border-forest/15 px-3 py-2" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked /> Published
        </label>
        <button className="w-fit rounded-full bg-forest px-4 py-2 text-cream">Publish</button>
      </form>
      <div className="mt-8 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="flex items-center justify-between rounded-2xl bg-white p-4">
            <div>
              <p className="font-medium text-forest">{post.title}</p>
              <p className="text-sm text-muted">/journal/{post.slug}</p>
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
