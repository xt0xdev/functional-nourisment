import { prisma } from "./prisma";
import { cache } from "react";

export type MenuNode = {
  id: string;
  label: string;
  href: string;
  style: string;
  openInNew: boolean;
  children: MenuNode[];
};

export const getHeaderMenu = cache(async (): Promise<MenuNode[]> => {
  const items = await prisma.menuItem.findMany({
    where: { location: "header", visible: true },
    orderBy: { sortOrder: "asc" },
  });
  const children = items.filter((item) => item.parentId);
  const roots = items.filter((item) => !item.parentId);
  return roots.map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    style: item.style,
    openInNew: item.openInNew,
    children: children
      .filter((child) => child.parentId === item.id)
      .map((child) => ({
        id: child.id,
        label: child.label,
        href: child.href,
        style: child.style,
        openInNew: child.openInNew,
        children: [],
      })),
  }));
});

export const getFooterMenu = cache(async () => {
  const items = await prisma.menuItem.findMany({
    where: { location: "footer", visible: true },
    orderBy: [{ groupName: "asc" }, { sortOrder: "asc" }],
  });
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = item.groupName || "Explore";
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }
  return Array.from(groups.entries()).map(([name, links]) => ({ name, links }));
});

export const RESERVED_SLUGS = new Set([
  "admin",
  "api",
  "about",
  "nutrition",
  "sound-healing",
  "meditation",
  "experiences",
  "events",
  "book",
  "contact",
  "journal",
  "privacy",
  "locations",
  "home",
  "icon",
]);

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
