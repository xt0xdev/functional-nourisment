import { PrismaClient } from "@prisma/client";
import {
  ABOUT_HERO_SUBHEADING,
  ABOUT_NAME,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  MIND_HOW,
  MIND_HERO,
  MIND_MEDITATIVE,
  MIND_SESSIONS,
  MIND_WHAT,
  NUTRITION_APPROACH,
  NUTRITION_CLOSING,
  NUTRITION_FOOD_FIRST,
  NUTRITION_GOAL,
  NUTRITION_HERO,
  NUTRITION_INTRO,
  NUTRITION_NOT_ALONE,
  PILLAR_BODY,
  PILLAR_MIND,
  PILLAR_SPIRIT,
  SPIRIT_GATHER_INTRO,
  SPIRIT_GATHER_MORE,
  SPIRIT_HERO,
  SPIRIT_RETREATS_BODY,
  SPIRIT_RETREATS_GREECE,
  SPIRIT_RETREATS_LEAD,
  SQUARESPACE_EXPERIENCES,
  withUpdatedSoundCredential,
} from "../src/lib/page-copy";
import { FOOTER_BLURB } from "../src/lib/site-defaults";

const prisma = new PrismaClient();

const CALENDLY = "https://calendly.com/functionalnourishment-krbc/new-meeting";
const INSTAGRAM = "https://www.instagram.com/functional_nourishment/";
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
  return (
    text.includes("A whole-person functional nutrition practice in Astoria, Queens, serving New York City") ||
    text.includes(
      "Personalized, evidence-based functional nutrition rooted in a whole-person approach to health and well-being. Based in Astoria, Queens, serving New York City and New York State through telehealth.",
    )
  );
}

function isLegacyIntro(value?: string | null) {
  const text = value?.trim() || "";
  if (!text) return true;
  return text.includes("Holistic functional nutrition and mind-body care from Astoria, Queens");
}

function parseJson(raw?: string | null): Record<string, unknown> {
  try {
    return JSON.parse(raw || "{}") as Record<string, unknown>;
  } catch {
    return {};
  }
}

async function upsertSetting(key: string, value: string, shouldWrite: boolean) {
  if (!shouldWrite) return;
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

async function mergePage(
  slug: string,
  data: {
    heroHeading?: string;
    heroSubheading?: string;
    content?: Record<string, unknown>;
  },
) {
  const page = await prisma.page.findUnique({ where: { slug } });
  if (!page) return;
  const content = { ...parseJson(page.content), ...data.content };
  await prisma.page.update({
    where: { slug },
    data: {
      ...(data.heroHeading ? { heroHeading: data.heroHeading } : {}),
      ...(data.heroSubheading ? { heroSubheading: data.heroSubheading } : {}),
      content: JSON.stringify(content),
    },
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
    const content = parseJson(home.content);
    const intro = typeof content.intro === "string" ? content.intro : "";
    await prisma.page.update({
      where: { slug: "home" },
      data: {
        heroSubheading: isLegacyIntro(home.heroSubheading) ? HOME_INTRO : home.heroSubheading,
        content: JSON.stringify({
          ...content,
          intro: isLegacyIntro(intro) ? HOME_INTRO : intro,
          mind: PILLAR_MIND,
          body: PILLAR_BODY,
          spirit: PILLAR_SPIRIT,
        }),
      },
    });
  }

  const about = await prisma.page.findUnique({ where: { slug: "about" } });
  if (about) {
    const content = parseJson(about.content);
    const paragraphs = Array.isArray(content.paragraphs)
      ? (content.paragraphs as string[]).map(withUpdatedSoundCredential)
      : content.paragraphs;
    await prisma.page.update({
      where: { slug: "about" },
      data: {
        heroHeading: ABOUT_NAME,
        heroSubheading: ABOUT_HERO_SUBHEADING,
        content: JSON.stringify({ ...content, paragraphs }),
      },
    });
  }

  await mergePage("nutrition", {
    heroSubheading: NUTRITION_HERO,
    content: {
      intro: NUTRITION_INTRO,
      notAlone: NUTRITION_NOT_ALONE,
      approach: NUTRITION_APPROACH,
      foodFirst: NUTRITION_FOOD_FIRST,
      goal: NUTRITION_GOAL,
      closing: NUTRITION_CLOSING,
    },
  });

  await mergePage("sound-healing", {
    heroSubheading: MIND_HERO,
    content: {
      what: MIND_WHAT,
      how: MIND_HOW,
      meditative: MIND_MEDITATIVE,
      close: MIND_SESSIONS,
    },
  });

  await mergePage("meditation", {
    heroHeading: "Nourish Spirit",
    heroSubheading: SPIRIT_HERO,
    content: {
      gatherIntro: SPIRIT_GATHER_INTRO,
      gatherMore: SPIRIT_GATHER_MORE,
      retreatsLead: SPIRIT_RETREATS_LEAD,
      retreatsBody: SPIRIT_RETREATS_BODY,
      retreatsGreece: SPIRIT_RETREATS_GREECE,
    },
  });

  await mergePage("experiences", {
    content: {
      intro: EXPERIENCES_INTRO,
      introMore: EXPERIENCES_INTRO_MORE,
    },
  });

  for (const experience of SQUARESPACE_EXPERIENCES) {
    await prisma.experience.upsert({
      where: { slug: experience.slug },
      update: {
        title: experience.title,
        subtitle: experience.subtitle,
        excerpt: experience.excerpt,
        body: experience.body,
        sortOrder: experience.sortOrder,
        published: true,
      },
      create: { ...experience, published: true },
    });
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
