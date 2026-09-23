import { prisma } from "./prisma";
import { cache } from "react";
import { eventMediaInclude } from "./media";
import { isRetreatEvent } from "./events";

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

export const getUpcomingEvents = cache(async () => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return prisma.event.findMany({
    where: {
      published: true,
      OR: [{ startsAt: null }, { startsAt: { gte: startOfToday } }, { endsAt: { gte: startOfToday } }],
    },
    orderBy: [{ startsAt: "asc" }, { sortOrder: "asc" }],
    include: eventMediaInclude,
  });
});

export const getEvent = cache(async (slug: string) => {
  return prisma.event.findFirst({
    where: { published: true, OR: [{ slug }, { id: slug }] },
    include: eventMediaInclude,
  });
});

export const getUpcomingRetreats = cache(async () => {
  const events = await getUpcomingEvents();
  return events.filter((event) => isRetreatEvent(event));
});

export const getPosts = cache(async (kind?: "journal" | "recipe") => {
  return prisma.post.findMany({
    where: { published: true, ...(kind ? { kind } : {}) },
    orderBy: { publishedAt: "desc" },
  });
});

export const getPost = cache(async (slug: string, kind?: "journal" | "recipe") => {
  return prisma.post.findFirst({
    where: { slug, published: true, ...(kind ? { kind } : {}) },
  });
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
