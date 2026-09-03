import { prisma } from "@/lib/prisma";
import { deleteMenuItem, saveMenuItem } from "../actions";

export default async function AdminMenuPage() {
  const items = await prisma.menuItem.findMany({ orderBy: [{ location: "asc" }, { sortOrder: "asc" }] });
  const parents = items.filter((item) => item.location === "header" && !item.parentId);
  const pages = await prisma.page.findMany({ where: { published: true }, orderBy: { title: "asc" } });

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Navigation</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        Control the public header and footer. Header items can be nested under a parent for dropdowns.
        Use style <strong>cta</strong> for the teal booking button and <strong>ghost</strong> for Client Portal.
        Leave href blank on a parent used only as a dropdown label.
      </p>

      <form action={saveMenuItem} className="mt-6 grid gap-3 rounded-2xl border border-dashed border-forest/20 bg-white p-5">
        <h2 className="font-serif text-2xl text-forest">Add menu item</h2>
        <input name="label" required placeholder="Label" className="rounded-xl border border-forest/15 px-3 py-2" />
        <input name="href" placeholder="/about or https://…" className="rounded-xl border border-forest/15 px-3 py-2" />
        <div className="grid gap-3 md:grid-cols-4">
          <select name="location" className="rounded-xl border border-forest/15 px-3 py-2">
            <option value="header">Header</option>
            <option value="footer">Footer</option>
          </select>
          <select name="parentId" className="rounded-xl border border-forest/15 px-3 py-2">
            <option value="">No parent</option>
            {parents.map((item) => (
              <option key={item.id} value={item.id}>
                Under: {item.label}
              </option>
            ))}
          </select>
          <select name="style" defaultValue="link" className="rounded-xl border border-forest/15 px-3 py-2">
            <option value="link">Link</option>
            <option value="ghost">Ghost</option>
            <option value="cta">CTA button</option>
          </select>
          <input name="groupName" placeholder="Footer group (Services)" className="rounded-xl border border-forest/15 px-3 py-2" />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <input name="sortOrder" type="number" defaultValue={100} className="w-24 rounded-xl border border-forest/15 px-3 py-2" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visible" defaultChecked /> Visible
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="openInNew" /> Open in new tab
          </label>
          <button className="rounded-full bg-forest px-5 py-2 text-cream">Add item</button>
        </div>
        {pages.length ? (
          <p className="text-xs text-muted">
            Published pages:{" "}
            {pages.map((page) => `/${page.slug === "home" ? "" : page.slug}`).join(" · ")}
          </p>
        ) : null}
      </form>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <form key={item.id} action={saveMenuItem} className="grid gap-3 rounded-2xl bg-white p-4">
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-3 md:grid-cols-2">
              <input name="label" defaultValue={item.label} className="rounded-xl border border-forest/15 px-3 py-2" />
              <input name="href" defaultValue={item.href} className="rounded-xl border border-forest/15 px-3 py-2" />
            </div>
            <div className="grid gap-3 md:grid-cols-4">
              <select name="location" defaultValue={item.location} className="rounded-xl border border-forest/15 px-3 py-2">
                <option value="header">Header</option>
                <option value="footer">Footer</option>
              </select>
              <select name="parentId" defaultValue={item.parentId || ""} className="rounded-xl border border-forest/15 px-3 py-2">
                <option value="">No parent</option>
                {parents
                  .filter((parent) => parent.id !== item.id)
                  .map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      Under: {parent.label}
                    </option>
                  ))}
              </select>
              <select name="style" defaultValue={item.style} className="rounded-xl border border-forest/15 px-3 py-2">
                <option value="link">Link</option>
                <option value="ghost">Ghost</option>
                <option value="cta">CTA button</option>
              </select>
              <input name="groupName" defaultValue={item.groupName} placeholder="Footer group" className="rounded-xl border border-forest/15 px-3 py-2" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <input name="sortOrder" type="number" defaultValue={item.sortOrder} className="w-24 rounded-xl border border-forest/15 px-3 py-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visible" defaultChecked={item.visible} /> Visible
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="openInNew" defaultChecked={item.openInNew} /> New tab
              </label>
              <button className="rounded-full bg-forest px-4 py-2 text-sm text-cream">Save</button>
              <button formAction={deleteMenuItem} className="text-sm text-clay">
                Delete
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
