import { prisma } from "./prisma";
import { cache } from "react";
import { eventMediaInclude } from "./media";

export const getSettings = cache(async () => {
  const rows = await prisma.setting.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value])) as Record<string, string>;
});

export const getPage = cache(async (slug: string) => {
  return prisma.page.findUnique({ where: { slug } });
});

export const getPublishedPages = cache(async () => {
  return prisma.page.findMany({ where: { published: true }, orderBy: { title: "asc" } });
});

export const getServices = cache(async () => {
  return prisma.service.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getExperiences = cache(async () => {
  return prisma.experience.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
});

export const getEvents = cache(async () => {
  return prisma.event.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { startsAt: "asc" }],
    include: eventMediaInclude,
  });
});

export const getEvent = cache(async (slug: string) => {
  return prisma.event.findFirst({
    where: { published: true, OR: [{ slug }, { id: slug }] },
    include: eventMediaInclude,
  });
});

export const getPosts = cache(async () => {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
});

export const getPost = cache(async (slug: string) => {
  return prisma.post.findFirst({ where: { slug, published: true } });
});

export function parseContent<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function siteUrl(path = "") {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://functional-nourishment.com").replace(
    /\/$/,
    "",
  );
  return `${base}${path}`;
}
