"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

async function guard() {
  try {
    await requireAdmin();
  } catch {
    redirect("/admin/login");
  }
}

export async function saveSettings(formData: FormData) {
  await guard();
  const entries = Array.from(formData.entries()).filter(([key]) => key !== "intent");
  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }

  const bookingUrl = String(formData.get("bookingUrl") || "").trim();
  if (bookingUrl) {
    await prisma.menuItem.updateMany({
      where: {
        OR: [
          { label: { equals: "Book a Discovery Call", mode: "insensitive" } },
          { label: { equals: "Book Now", mode: "insensitive" } },
          { href: "/book" },
          { href: { contains: "bookings" } },
        ],
      },
      data: {
        href: bookingUrl,
        openInNew: bookingUrl.startsWith("http"),
      },
    });
  }

  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/menu");
}

export async function savePage(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const data = {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    heroHeading: String(formData.get("heroHeading") || ""),
    heroSubheading: String(formData.get("heroSubheading") || ""),
    heroImage: String(formData.get("heroImage") || ""),
    content: String(formData.get("content") || ""),
    published: formData.get("published") === "on",
  };
  if (id) {
    await prisma.page.update({ where: { id }, data });
  } else {
    await prisma.page.create({ data: { ...data, system: false } });
  }
  revalidatePath("/", "layout");
}

export async function createPage(formData: FormData) {
  await guard();
  const { RESERVED_SLUGS, slugify } = await import("@/lib/menu");
  const title = String(formData.get("title") || "New page");
  let slug = slugify(String(formData.get("slug") || title));
  if (!slug || RESERVED_SLUGS.has(slug)) {
    slug = `${slug || "page"}-${Date.now().toString().slice(-4)}`;
  }
  const existing = await prisma.page.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      metaTitle: title,
      metaDescription: String(formData.get("metaDescription") || ""),
      heroHeading: title,
      heroSubheading: "",
      heroImage: "",
      content: String(formData.get("content") || "Write your page content here.\n\nUse a blank line between paragraphs, or ## for headings."),
      system: false,
      published: false,
    },
  });
  revalidatePath("/", "layout");
  redirect(`/admin/pages/${page.id}`);
}

export async function deletePage(formData: FormData) {
  await guard();
  const page = await prisma.page.findUnique({ where: { id: String(formData.get("id")) } });
  if (!page || page.system) return;
  await prisma.page.delete({ where: { id: page.id } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/pages");
}

export async function saveMenuItem(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const parentId = String(formData.get("parentId") || "");
  const data = {
    label: String(formData.get("label") || ""),
    href: String(formData.get("href") || ""),
    location: String(formData.get("location") || "header"),
    groupName: String(formData.get("groupName") || ""),
    style: String(formData.get("style") || "link"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    visible: formData.get("visible") === "on",
    openInNew: formData.get("openInNew") === "on",
    parentId: parentId || null,
  };
  if (id) await prisma.menuItem.update({ where: { id }, data });
  else await prisma.menuItem.create({ data });
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function deleteMenuItem(formData: FormData) {
  await guard();
  await prisma.menuItem.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/", "layout");
  revalidatePath("/admin/menu");
}

export async function saveService(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const data = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    body: String(formData.get("body") || ""),
    icon: String(formData.get("icon") || "leaf"),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(formData: FormData) {
  await guard();
  await prisma.service.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/services");
}

export async function saveExperience(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const data = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    subtitle: String(formData.get("subtitle") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    body: String(formData.get("body") || ""),
    sortOrder: Number(formData.get("sortOrder") || 0),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.experience.update({ where: { id }, data });
  else await prisma.experience.create({ data });
  revalidatePath("/admin/experiences");
  revalidatePath("/experiences");
}

export async function deleteExperience(formData: FormData) {
  await guard();
  await prisma.experience.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/experiences");
}

export async function saveEvent(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const starts = String(formData.get("startsAt") || "");
  const ends = String(formData.get("endsAt") || "");
  const data = {
    title: String(formData.get("title") || ""),
    description: String(formData.get("description") || ""),
    location: String(formData.get("location") || ""),
    startsAt: starts ? new Date(starts) : null,
    endsAt: ends ? new Date(ends) : null,
    published: formData.get("published") === "on",
    sortOrder: Number(formData.get("sortOrder") || 0),
  };
  if (id) await prisma.event.update({ where: { id }, data });
  else await prisma.event.create({ data });
  revalidatePath("/admin/events");
  revalidatePath("/events");
}

export async function deleteEvent(formData: FormData) {
  await guard();
  await prisma.event.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/events");
}

export async function savePost(formData: FormData) {
  await guard();
  const id = String(formData.get("id") || "");
  const data = {
    slug: String(formData.get("slug") || ""),
    title: String(formData.get("title") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    body: String(formData.get("body") || ""),
    metaTitle: String(formData.get("metaTitle") || ""),
    metaDescription: String(formData.get("metaDescription") || ""),
    published: formData.get("published") === "on",
  };
  if (id) await prisma.post.update({ where: { id }, data });
  else await prisma.post.create({ data });
  revalidatePath("/admin/posts");
  revalidatePath("/journal");
}

export async function deletePost(formData: FormData) {
  await guard();
  await prisma.post.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/posts");
}

export async function markInquiryRead(formData: FormData) {
  await guard();
  await prisma.inquiry.update({
    where: { id: String(formData.get("id")) },
    data: { read: true },
  });
  revalidatePath("/admin/inquiries");
}

export async function deleteInquiry(formData: FormData) {
  await guard();
  await prisma.inquiry.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/inquiries");
}
