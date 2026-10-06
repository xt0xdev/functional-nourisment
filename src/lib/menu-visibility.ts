export type MenuVisibilityRow = {
  id: string;
  href: string;
  location: string;
  parentId: string | null;
  visible: boolean;
  groupName?: string | null;
};

export function normalizeMenuHref(href: string) {
  const trimmed = href.trim();
  if (!trimmed) return "";
  const hashIndex = trimmed.indexOf("#");
  const pathPart = hashIndex >= 0 ? trimmed.slice(0, hashIndex) : trimmed;
  const hash = hashIndex >= 0 ? trimmed.slice(hashIndex + 1) : "";
  const withoutTrailing = pathPart.replace(/\/+$/, "");
  const path = withoutTrailing || "/";
  return hash ? `${path}#${hash}` : path;
}

export function isInternalMenuHref(href: string) {
  const normalized = normalizeMenuHref(href);
  return normalized.startsWith("/") && !normalized.startsWith("//");
}

export function hiddenPublicHrefs(items: MenuVisibilityRow[]): Set<string> {
  const hidden = new Set<string>();
  const hiddenIds = new Set<string>();

  for (const item of items) {
    if (item.visible) continue;
    hiddenIds.add(item.id);
    const href = normalizeMenuHref(item.href);
    if (href && isInternalMenuHref(href)) hidden.add(href);
  }

  for (const item of items) {
    if (!item.parentId || !hiddenIds.has(item.parentId)) continue;
    const href = normalizeMenuHref(item.href);
    if (href && isInternalMenuHref(href)) hidden.add(href);
  }

  return hidden;
}

export function isPubliclyVisibleHref(href: string, hidden: Set<string>) {
  const normalized = normalizeMenuHref(href);
  if (!normalized) return true;
  return !hidden.has(normalized);
}

export function siblingIdsForHref(items: MenuVisibilityRow[], href: string, exceptId?: string | null) {
  const normalized = normalizeMenuHref(href);
  if (!normalized) return [];
  return items
    .filter((item) => item.id !== exceptId && normalizeMenuHref(item.href) === normalized)
    .map((item) => item.id);
}

export function hasServingMenuItems(items: MenuVisibilityRow[]) {
  return items.some(
    (item) => item.location === "footer" && (item.groupName || "").toLowerCase() === "serving",
  );
}

export function resolveServingLinks<T extends { href: string }>(
  servingGroupLinks: T[] | undefined,
  staticServing: T[],
  hidden: Set<string>,
  hasServingMenu: boolean,
  extra?: T,
) {
  const fromMenu = (servingGroupLinks || []).filter((item) => isPubliclyVisibleHref(item.href, hidden));
  const source =
    fromMenu.length > 0 ? fromMenu : hasServingMenu ? [] : staticServing.filter((item) => isPubliclyVisibleHref(item.href, hidden));
  const links = [...source];
  if (extra && isPubliclyVisibleHref(extra.href, hidden) && !links.some((item) => normalizeMenuHref(item.href) === normalizeMenuHref(extra.href))) {
    links.push(extra);
  }
  return links;
}

export function filterPublicLinks<T extends { href: string }>(links: T[], hidden: Set<string>) {
  return links.filter((item) => isPubliclyVisibleHref(item.href, hidden));
}
