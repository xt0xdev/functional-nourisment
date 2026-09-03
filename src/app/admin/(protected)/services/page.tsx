import { prisma } from "@/lib/prisma";
import { deleteService, saveService } from "../actions";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Services</h1>
      <div className="mt-6 space-y-6">
        {services.map((service) => (
          <form key={service.id} action={saveService} className="grid gap-3 rounded-2xl bg-white p-5">
            <input type="hidden" name="id" value={service.id} />
            <input name="title" defaultValue={service.title} className="rounded-xl border border-forest/15 px-3 py-2" />
            <input name="slug" defaultValue={service.slug} className="rounded-xl border border-forest/15 px-3 py-2" />
            <textarea name="excerpt" defaultValue={service.excerpt} rows={2} className="rounded-xl border border-forest/15 px-3 py-2" />
            <textarea name="body" defaultValue={service.body} rows={4} className="rounded-xl border border-forest/15 px-3 py-2" />
            <div className="flex flex-wrap items-center gap-3">
              <input name="icon" defaultValue={service.icon} className="w-32 rounded-xl border border-forest/15 px-3 py-2" />
              <input name="sortOrder" type="number" defaultValue={service.sortOrder} className="w-24 rounded-xl border border-forest/15 px-3 py-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={service.published} /> Published
              </label>
              <button className="rounded-full bg-forest px-4 py-2 text-sm text-cream">Save</button>
            </div>
          </form>
        ))}
        <form action={saveService} className="grid gap-3 rounded-2xl border border-dashed border-forest/20 p-5">
          <h2 className="font-serif text-2xl text-forest">Add service</h2>
          <input name="title" placeholder="Title" required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="slug" placeholder="slug" required className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <textarea name="excerpt" placeholder="Excerpt" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <textarea name="body" placeholder="Body" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="icon" defaultValue="leaf" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <input name="sortOrder" type="number" defaultValue={99} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked /> Published
          </label>
          <button className="w-fit rounded-full bg-forest px-4 py-2 text-cream">Create</button>
        </form>
        <div className="space-y-2">
          {services.map((service) => (
            <form key={`del-${service.id}`} action={deleteService}>
              <input type="hidden" name="id" value={service.id} />
              <button className="text-sm text-clay">Delete {service.title}</button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
