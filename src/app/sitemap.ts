import type { MetadataRoute } from "next";
import { getEvents, getPosts, getPublishedPages } from "@/lib/content";
import { locations } from "@/lib/locations";
import { RESERVED_SLUGS } from "@/lib/menu";
import { siteUrl } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pages, events] = await Promise.all([getPosts(), getPublishedPages(), getEvents()]);
  const staticPaths = [
    "/",
    "/about",
    "/nutrition",
    "/sound-healing",
    "/meditation",
    "/experiences",
    "/events",
    "/book",
    "/contact",
    "/journal",
    "/privacy",
  ];

  return [
    ...staticPaths.map((path) => ({
      url: siteUrl(path),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.8,
    })),
    ...locations.map((location) => ({
      url: siteUrl(`/locations/${location.slug}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...pages
      .filter((page) => page.slug !== "home" && !RESERVED_SLUGS.has(page.slug))
      .map((page) => ({
        url: siteUrl(`/${page.slug}`),
        lastModified: page.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...posts.map((post) => ({
      url: siteUrl(`/journal/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...events.map((event) => ({
      url: siteUrl(`/events/${event.slug || event.id}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
