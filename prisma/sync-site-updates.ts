import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const CALENDLY = "https://calendly.com/functionalnourishment-krbc/new-meeting";
const INSTAGRAM = "https://www.instagram.com/functional_nourishment/";
const FOOTER_BLURB =
  "Personalized, evidence-based functional nutrition rooted in a whole-person approach to health and well-being. Based in Astoria, Queens, serving New York City and New York State through telehealth.";
const STRIPE = "https://book.stripe.com/dRm7sLewW98h3uTaCo6Zy00";
const PAYPAL = "https://www.paypal.com/ncp/payment/KZSXHPJZ4HCMU";
const HOME_INTRO =
  "Personalized, evidence-based functional nutrition and integrative mind-body practices to support your health and well-being. Based in Astoria, Queens, serving New York City and beyond through telehealth, with meditation and sound bath experiences offered locally.";

function isLegacyBooking(value?: string | null) {
  const url = value?.trim().toLowerCase() || "";
  if (!url) return true;
  if (url.includes("berrystreet.co/provider-details")) return true;
  if (url.includes("practicebetter.io") && url.includes("booking")) return true;
  return false;
}

function isLegacyInstagram(value?: string | null) {
  const url = value?.trim().toLowerCase() || "";
  if (!url) return true;
  return url.includes("instagram.com/functionalnourishment") && !url.includes("functional_nourishment");
}

function isLegacyFooter(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return text.includes("A whole-person functional nutrition practice in Astoria, Queens, serving New York City");
}

function isLegacyIntro(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return text.includes("Holistic functional nutrition and mind-body care from Astoria, Queens");
}

async function upsertSetting(key: string, value: string, shouldWrite: boolean) {
  if (!shouldWrite) return;
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function main() {
  const rows = await prisma.setting.findMany({
    where: { key: { in: ["bookingUrl", "instagram", "footerBlurb", "stripeUrl", "paypalUrl"] } },
  });
  const current = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  await upsertSetting("bookingUrl", CALENDLY, isLegacyBooking(current.bookingUrl));
  await upsertSetting("instagram", INSTAGRAM, isLegacyInstagram(current.instagram));
  await upsertSetting("footerBlurb", FOOTER_BLURB, isLegacyFooter(current.footerBlurb));
  await upsertSetting("stripeUrl", STRIPE, !current.stripeUrl?.trim());
  await upsertSetting("paypalUrl", PAYPAL, !current.paypalUrl?.trim());

  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    let content: Record<string, unknown> = {};
    try {
      content = JSON.parse(home.content || "{}") as Record<string, unknown>;
    } catch {
      content = {};
    }
    const intro = typeof content.intro === "string" ? content.intro : "";
    if (isLegacyIntro(home.heroSubheading) || isLegacyIntro(intro)) {
      await prisma.page.update({
        where: { slug: "home" },
        data: {
          heroSubheading: HOME_INTRO,
          content: JSON.stringify({ ...content, intro: HOME_INTRO }),
        },
      });
    }
  }

  await prisma.menuItem.updateMany({
    where: { label: "Community" },
    data: { label: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { groupName: "Community" },
    data: { groupName: "Wellness" },
  });
  await prisma.menuItem.updateMany({
    where: { label: { in: ["Book a Discovery Call", "Book Now"] } },
    data: {
      href: CALENDLY,
      openInNew: true,
    },
  });

  const calendarExists = await prisma.menuItem.findFirst({ where: { href: "/calendar" } });
  if (!calendarExists) {
    const wellnessParent = await prisma.menuItem.findFirst({
      where: { location: "header", parentId: null, label: "Wellness" },
    });
    if (wellnessParent) {
      await prisma.menuItem.create({
        data: {
          parentId: wellnessParent.id,
          label: "Calendar",
          href: "/calendar",
          location: "header",
          sortOrder: 24,
        },
      });
    }
    await prisma.menuItem.create({
      data: {
        label: "Calendar",
        href: "/calendar",
        location: "footer",
        groupName: "Wellness",
        sortOrder: 15,
      },
    });
  }

  const nys = await prisma.menuItem.findFirst({
    where: { location: "footer", href: "/locations/new-york-state" },
  });
  if (!nys) {
    await prisma.menuItem.create({
      data: {
        label: "New York State telehealth",
        href: "/locations/new-york-state",
        location: "footer",
        groupName: "Serving",
        sortOrder: 70,
      },
    });
  }

  const calendarPage = await prisma.page.findUnique({ where: { slug: "calendar" } });
  if (!calendarPage) {
    await prisma.page.create({
      data: {
        slug: "calendar",
        title: "Calendar",
        metaTitle: "Workshop & Sound Bath Calendar | Functional Nourishment",
        metaDescription:
          "Upcoming workshops and sound bath meditations with Anna Almiroudis. Book and pay online with Stripe or PayPal.",
        heroHeading: "Calendar",
        heroSubheading: "Upcoming workshops and sound bath meditations. Reserve your spot with Stripe or PayPal.",
        content: JSON.stringify({
          intro:
            "Join Anna for workshops and sound bath meditations. Browse upcoming dates and pay securely through Stripe or PayPal.",
        }),
        system: true,
        published: true,
      },
    });
  }

  console.log("Targeted site-update sync complete.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
