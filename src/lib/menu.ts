import { prisma } from "./prisma";
import { cache } from "react";
import { applyBookingUrl, resolveBookingUrl } from "./booking";
import { getSettings } from "./content";
import {
  hasServingMenuItems,
  hiddenPublicHrefs,
  isPubliclyVisibleHref,
  siblingIdsForHref,
} from "./menu-visibility";

export type MenuNode = {
  id: string;
  label: string;
  href: string;
  style: string;
  openInNew: boolean;
  children: MenuNode[];
};

export type FooterMenu = {
  groups: {
    name: string;
    links: {
      id: string;
      label: string;
      href: string;
      style: string;
      openInNew: boolean;
      groupName: string;
    }[];
  }[];
  hiddenHrefs: string[];
  hasServingMenu: boolean;
};

const getAllMenuItems = cache(async () =>
  prisma.menuItem.findMany({
    orderBy: [{ location: "asc" }, { groupName: "asc" }, { sortOrder: "asc" }],
  }),
);

export const getHiddenPublicHrefs = cache(async () => {
  const items = await getAllMenuItems();
  return hiddenPublicHrefs(items);
});

export async function syncMenuVisibilityByHref(href: string, visible: boolean, exceptId?: string | null) {
  const items = await prisma.menuItem.findMany({ select: { id: true, href: true, location: true, parentId: true, visible: true } });
  const ids = siblingIdsForHref(items, href, exceptId);
  if (!ids.length) return;
  await prisma.menuItem.updateMany({
    where: { id: { in: ids } },
    data: { visible },
  });
}

export const getHeaderMenu = cache(async (): Promise<MenuNode[]> => {
  const [items, settings] = await Promise.all([getAllMenuItems(), getSettings()]);
  const hidden = hiddenPublicHrefs(items);
  const visibleItems = items.filter(
    (item) => item.location === "header" && item.visible && isPubliclyVisibleHref(item.href, hidden),
  );
  const bookingUrl = resolveBookingUrl(settings);
  const children = visibleItems.filter((item) => item.parentId);
  const roots = visibleItems.filter((item) => !item.parentId);
  return roots
    .map((item) => {
      const node = applyBookingUrl(
        {
          id: item.id,
          label: item.label,
          href: item.href,
          style: item.style,
          openInNew: item.openInNew,
          children: children
            .filter((child) => child.parentId === item.id)
            .map((child) =>
              applyBookingUrl(
                {
                  id: child.id,
                  label: child.label,
                  href: child.href,
                  style: child.style,
                  openInNew: child.openInNew,
                  children: [],
                },
                bookingUrl,
              ),
            ),
        },
        bookingUrl,
      );
      return node;
    })
    .filter((item) => item.href || item.children.length > 0);
});

export const getFooterMenu = cache(async (): Promise<FooterMenu> => {
  const [items, settings] = await Promise.all([getAllMenuItems(), getSettings()]);
  const hidden = hiddenPublicHrefs(items);
  const bookingUrl = resolveBookingUrl(settings);
  const footerItems = items
    .filter((item) => item.location === "footer" && item.visible && isPubliclyVisibleHref(item.href, hidden))
    .sort((a, b) => {
      const group = (a.groupName || "Explore").localeCompare(b.groupName || "Explore");
      return group || a.sortOrder - b.sortOrder;
    });
  const groups = new Map<string, typeof footerItems>();
  for (const item of footerItems) {
    const key = item.groupName || "Explore";
    const list = groups.get(key) ?? [];
    list.push(applyBookingUrl(item, bookingUrl));
    groups.set(key, list);
  }
  return {
    groups: Array.from(groups.entries()).map(([name, links]) => ({ name, links })),
    hiddenHrefs: Array.from(hidden),
    hasServingMenu: hasServingMenuItems(items),
  };
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
  "calendar",
  "book",
  "contact",
  "journal",
  "nourish",
  "recipes",
  "retreats",
  "collaborative-care",
  "privacy",
  "event-policy",
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
