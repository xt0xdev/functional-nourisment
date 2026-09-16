import type { PrismaClient } from "@prisma/client";

async function ensureItem(
  prisma: PrismaClient,
  where: { location: string; href?: string; label?: string; parentId?: string | null; groupName?: string },
  data: {
    label: string;
    href: string;
    location: string;
    sortOrder: number;
    groupName?: string;
    parentId?: string | null;
    style?: string;
    openInNew?: boolean;
    visible?: boolean;
  },
) {
  const existing = await prisma.menuItem.findFirst({
    where: {
      location: where.location,
      ...(where.href ? { href: where.href } : {}),
      ...(where.label ? { label: where.label } : {}),
      ...(where.parentId !== undefined ? { parentId: where.parentId } : {}),
      ...(where.groupName ? { groupName: where.groupName } : {}),
    },
  });
  if (existing) {
    await prisma.menuItem.update({
      where: { id: existing.id },
      data: {
        label: data.label,
        href: data.href,
        sortOrder: data.sortOrder,
        visible: data.visible ?? true,
        openInNew: data.openInNew ?? false,
        groupName: data.groupName ?? existing.groupName,
        parentId: data.parentId === undefined ? existing.parentId : data.parentId,
        style: data.style ?? existing.style,
      },
    });
    return existing.id;
  }
  const created = await prisma.menuItem.create({ data });
  return created.id;
}

export async function syncLatestNavigation(prisma: PrismaClient) {
  await prisma.menuItem.updateMany({
    where: { label: "Community" },
    data: { label: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { groupName: "Community" },
    data: { groupName: "Wellness" },
  });

  await prisma.menuItem.updateMany({
    where: { location: "header", label: "About" },
    data: { sortOrder: 10, visible: true },
  });
  await prisma.menuItem.updateMany({
    where: { location: "header", parentId: null, label: "Services" },
    data: { sortOrder: 20, visible: true },
  });
  await prisma.menuItem.updateMany({
    where: { location: "header", parentId: null, label: "Wellness" },
    data: { sortOrder: 30, visible: true },
  });
  await prisma.menuItem.updateMany({
    where: { location: "header", label: "Contact" },
    data: { sortOrder: 50, visible: true },
  });
  await prisma.menuItem.updateMany({
    where: { location: "header", label: { in: ["Book a Discovery Call", "Book Now"] } },
    data: { href: "/book", openInNew: false, sortOrder: 70, style: "cta", visible: true },
  });
  await prisma.menuItem.updateMany({
    where: { location: "footer", label: { in: ["Book a Discovery Call", "Book Now"] } },
    data: { href: "/book", openInNew: false, visible: true },
  });

  await prisma.menuItem.updateMany({
    where: { location: "header", label: "Client Portal" },
    data: { visible: false },
  });
  await ensureItem(
    prisma,
    { location: "footer", label: "Client Portal", groupName: "Connect" },
    {
      label: "Client Portal",
      href: "https://client.practicebetter.io/#/signin",
      location: "footer",
      groupName: "Connect",
      sortOrder: 40,
      openInNew: true,
      visible: true,
    },
  );

  const wellness = await prisma.menuItem.findFirst({
    where: { location: "header", parentId: null, label: "Wellness" },
  });
  if (wellness) {
    await prisma.menuItem.updateMany({
      where: {
        parentId: wellness.id,
        label: { in: ["Sound Bath Meditations", "News", "Corporate Wellness", "Events"] },
      },
      data: { visible: false },
    });
    await ensureItem(
      prisma,
      { location: "header", href: "/experiences", parentId: wellness.id },
      {
        label: "Workshops & Experiences",
        href: "/experiences",
        location: "header",
        parentId: wellness.id,
        sortOrder: 10,
        visible: true,
      },
    );
    await ensureItem(
      prisma,
      { location: "header", href: "/retreats", parentId: wellness.id },
      {
        label: "Retreats",
        href: "/retreats",
        location: "header",
        parentId: wellness.id,
        sortOrder: 20,
        visible: true,
      },
    );
    await ensureItem(
      prisma,
      { location: "header", href: "/calendar", parentId: wellness.id },
      {
        label: "Calendar",
        href: "/calendar",
        location: "header",
        parentId: wellness.id,
        sortOrder: 30,
        visible: true,
      },
    );
  }

  let nourish = await prisma.menuItem.findFirst({
    where: { location: "header", parentId: null, label: "Nourish" },
  });
  if (!nourish) {
    nourish = await prisma.menuItem.create({
      data: { label: "Nourish", href: "/nourish", location: "header", sortOrder: 40, style: "link" },
    });
  } else {
    await prisma.menuItem.update({
      where: { id: nourish.id },
      data: { href: "/nourish", sortOrder: 40, visible: true },
    });
  }
  await ensureItem(
    prisma,
    { location: "header", href: "/journal", parentId: nourish.id },
    {
      label: "Journal",
      href: "/journal",
      location: "header",
      parentId: nourish.id,
      sortOrder: 10,
      visible: true,
    },
  );
  await ensureItem(
    prisma,
    { location: "header", href: "/recipes", parentId: nourish.id },
    {
      label: "Recipes",
      href: "/recipes",
      location: "header",
      parentId: nourish.id,
      sortOrder: 20,
      visible: true,
    },
  );
  await ensureItem(
    prisma,
    { location: "header", href: "/nourish#resources", parentId: nourish.id },
    {
      label: "Resources",
      href: "/nourish#resources",
      location: "header",
      parentId: nourish.id,
      sortOrder: 30,
      visible: true,
    },
  );

  await prisma.menuItem.updateMany({
    where: { location: "footer", href: "/experiences" },
    data: { label: "Workshops & Experiences", groupName: "Wellness", visible: true },
  });
  await ensureItem(
    prisma,
    { location: "footer", href: "/retreats" },
    {
      label: "Retreats",
      href: "/retreats",
      location: "footer",
      groupName: "Wellness",
      sortOrder: 18,
      visible: true,
    },
  );
  await ensureItem(
    prisma,
    { location: "footer", href: "/nourish" },
    {
      label: "Nourish",
      href: "/nourish",
      location: "footer",
      groupName: "Wellness",
      sortOrder: 25,
      visible: true,
    },
  );
  await ensureItem(
    prisma,
    { location: "footer", href: "/recipes" },
    {
      label: "Recipes",
      href: "/recipes",
      location: "footer",
      groupName: "Wellness",
      sortOrder: 28,
      visible: true,
    },
  );
}
