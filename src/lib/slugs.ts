import { prisma } from "./prisma";
import { slugify } from "./menu";

export async function uniqueEventSlug(title: string, excludeId?: string) {
  const base = slugify(title) || "event";
  let slug = base;
  let n = 2;
  while (true) {
    const found = await prisma.event.findUnique({ where: { slug } });
    if (!found || found.id === excludeId) return slug;
    slug = `${base}-${n++}`;
  }
}
