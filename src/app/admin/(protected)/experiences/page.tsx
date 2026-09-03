import { prisma } from "@/lib/prisma";
import { deleteExperience, saveExperience } from "../actions";

export default async function AdminExperiencesPage() {
  const experiences = await prisma.experience.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Experiences</h1>
      <div className="mt-6 space-y-6">
        {experiences.map((experience) => (
          <form key={experience.id} action={saveExperience} className="grid gap-3 rounded-2xl bg-white p-5">
            <input type="hidden" name="id" value={experience.id} />
            <input name="title" defaultValue={experience.title} className="rounded-xl border border-forest/15 px-3 py-2" />
            <input name="subtitle" defaultValue={experience.subtitle} className="rounded-xl border border-forest/15 px-3 py-2" />
            <input name="slug" defaultValue={experience.slug} className="rounded-xl border border-forest/15 px-3 py-2" />
            <textarea name="excerpt" defaultValue={experience.excerpt} rows={2} className="rounded-xl border border-forest/15 px-3 py-2" />
            <textarea name="body" defaultValue={experience.body} rows={5} className="rounded-xl border border-forest/15 px-3 py-2" />
            <div className="flex flex-wrap items-center gap-3">
              <input name="sortOrder" type="number" defaultValue={experience.sortOrder} className="w-24 rounded-xl border border-forest/15 px-3 py-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={experience.published} /> Published
              </label>
              <button className="rounded-full bg-forest px-4 py-2 text-sm text-cream">Save</button>
            </div>
          </form>
        ))}
        <form action={saveExperience} className="grid gap-3 rounded-2xl border border-dashed border-forest/20 p-5">
          <h2 className="font-serif text-2xl text-forest">Add experience</h2>
          <input name="title" placeholder="Title" required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="subtitle" placeholder="Subtitle" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="slug" placeholder="slug" required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <textarea name="excerpt" placeholder="Excerpt" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <textarea name="body" placeholder="Body" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="sortOrder" type="number" defaultValue={99} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button className="w-fit rounded-full bg-forest px-4 py-2 text-cream">Create</button>
        </form>
        {experiences.map((experience) => (
          <form key={`del-${experience.id}`} action={deleteExperience}>
            <input type="hidden" name="id" value={experience.id} />
            <button className="text-sm text-clay">Delete {experience.title}</button>
          </form>
        ))}
      </div>
    </div>
  );
}
