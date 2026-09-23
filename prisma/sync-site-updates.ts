import { PrismaClient } from "@prisma/client";
import {
  ABOUT_CREDENTIALS,
  ABOUT_HERO_SUBHEADING,
  ABOUT_NAME,
  COLLABORATIVE_CARE_BODY,
  COLLABORATIVE_CARE_META_DESCRIPTION,
  COLLABORATIVE_CARE_META_TITLE,
  COLLABORATIVE_CARE_TITLE,
  CONTACT_HERO,
  CONTACT_SECOND,
  EXPERIENCES_INTRO,
  EXPERIENCES_INTRO_MORE,
  EXPERIENCES_SUB,
  EXPERIENCES_TITLE,
  NOURISH_DESCRIPTION,
  NOURISH_HERO_LINE,
  NOURISH_TITLE,
  RETREATS_SUB,
  RETREATS_TITLE,
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
  normalizeCredentials,
  withUpdatedSoundCredential,
} from "../src/lib/page-copy";
import { FOOTER_BLURB } from "../src/lib/site-defaults";
import { SITE_IMAGES, isStockOrEmptyImage } from "../src/lib/site-images";
import { STARTER_JOURNAL, STARTER_RECIPES } from "../src/lib/starter-content";
import { syncLatestNavigation } from "./sync-nav";

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
      ? (content.paragraphs as string[]).map((paragraph) =>
          normalizeCredentials(
            withUpdatedSoundCredential(paragraph).replace(
              /\bCertified Health Coach\b/g,
              "Certified Integrative Nutrition Health Coach (CINHC)",
            ),
          ),
        )
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
    heroHeading: EXPERIENCES_TITLE,
    heroSubheading: EXPERIENCES_SUB,
    content: {
      intro: EXPERIENCES_INTRO,
      introMore: EXPERIENCES_INTRO_MORE,
    },
  });

  await mergePage("contact", {
    heroSubheading: CONTACT_HERO,
    content: { intro: CONTACT_SECOND },
  });

  const retreats = await prisma.page.findUnique({ where: { slug: "retreats" } });
  if (!retreats) {
    await prisma.page.create({
      data: {
        slug: "retreats",
        title: RETREATS_TITLE,
        metaTitle: "Retreats | Functional Nourishment",
        metaDescription: RETREATS_SUB,
        heroHeading: RETREATS_TITLE,
        heroSubheading: RETREATS_SUB,
        heroImage: SITE_IMAGES.spiritSoundbath,
        heroImageAlt: SITE_IMAGES.spiritSoundbathAlt,
        content: JSON.stringify({ intro: RETREATS_SUB }),
        system: true,
        published: true,
      },
    });
  }

  const nourish = await prisma.page.findUnique({ where: { slug: "nourish" } });
  if (!nourish) {
    await prisma.page.create({
      data: {
        slug: "nourish",
        title: NOURISH_TITLE,
        metaTitle: "Nourish | Journal, Recipes & Resources",
        metaDescription: NOURISH_DESCRIPTION,
        heroHeading: NOURISH_TITLE,
        heroSubheading: NOURISH_HERO_LINE,
        heroImage: SITE_IMAGES.bodyBowl,
        heroImageAlt: SITE_IMAGES.bodyBowlAlt,
        content: JSON.stringify({ description: NOURISH_DESCRIPTION }),
        system: true,
        published: true,
      },
    });
  }

  await prisma.page.deleteMany({
    where: {
      OR: [
        { slug: "seasonal-reset" },
        { slug: { equals: "seasonal-reset", mode: "insensitive" } },
        { title: { equals: "Seasonal Reset", mode: "insensitive" } },
      ],
    },
  });

  const collaborative = await prisma.page.findUnique({ where: { slug: "collaborative-care" } });
  if (!collaborative) {
    await prisma.page.create({
      data: {
        slug: "collaborative-care",
        title: COLLABORATIVE_CARE_TITLE,
        metaTitle: COLLABORATIVE_CARE_META_TITLE,
        metaDescription: COLLABORATIVE_CARE_META_DESCRIPTION,
        heroHeading: COLLABORATIVE_CARE_TITLE,
        heroSubheading: COLLABORATIVE_CARE_META_DESCRIPTION,
        heroImage: SITE_IMAGES.wellnessDining,
        heroImageAlt: SITE_IMAGES.wellnessDiningAlt,
        content: JSON.stringify({ body: COLLABORATIVE_CARE_BODY }),
        system: true,
        published: true,
      },
    });
  } else {
    await prisma.page.update({
      where: { slug: "collaborative-care" },
      data: {
        title: COLLABORATIVE_CARE_TITLE,
        metaTitle: COLLABORATIVE_CARE_META_TITLE,
        metaDescription: COLLABORATIVE_CARE_META_DESCRIPTION,
        heroHeading: COLLABORATIVE_CARE_TITLE,
        heroSubheading: COLLABORATIVE_CARE_META_DESCRIPTION,
        content: JSON.stringify({ body: COLLABORATIVE_CARE_BODY }),
        system: true,
        published: true,
      },
    });
  }

  for (const key of ["practitionerName", "credentials"] as const) {
    const row = await prisma.setting.findUnique({ where: { key } });
    if (!row) {
      await prisma.setting.create({
        data: {
          key,
          value: key === "credentials" ? ABOUT_CREDENTIALS : `${ABOUT_NAME}, ${ABOUT_CREDENTIALS}`,
        },
      });
      continue;
    }
    if (row.value.includes("CHHC")) {
      await prisma.setting.update({
        where: { key },
        data: { value: normalizeCredentials(row.value) },
      });
    }
  }

  const imageUpdates: Record<string, { image: string; alt: string }> = {
    home: { image: SITE_IMAGES.landingHero, alt: SITE_IMAGES.landingHeroAlt },
    nutrition: { image: SITE_IMAGES.bodyBowl, alt: SITE_IMAGES.bodyBowlAlt },
    "sound-healing": { image: SITE_IMAGES.mindMeditation, alt: SITE_IMAGES.mindMeditationAlt },
    meditation: { image: SITE_IMAGES.spiritSoundbath, alt: SITE_IMAGES.spiritSoundbathAlt },
    experiences: { image: SITE_IMAGES.wellnessYoga, alt: SITE_IMAGES.wellnessYogaAlt },
    contact: { image: SITE_IMAGES.landingMeet, alt: SITE_IMAGES.landingMeetAlt },
    book: { image: SITE_IMAGES.landingMeet, alt: SITE_IMAGES.landingMeetAlt },
  };
  for (const [slug, next] of Object.entries(imageUpdates)) {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (!page) continue;
    if (!isStockOrEmptyImage(page.heroImage)) continue;
    await prisma.page.update({
      where: { slug },
      data: { heroImage: next.image, heroImageAlt: next.alt },
    });
  }

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
      href: "/book",
      openInNew: false,
    },
  });

  await syncLatestNavigation(prisma);

  for (const post of STARTER_JOURNAL) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    await prisma.post.create({
      data: { ...post, kind: "journal", published: true },
    });
  }
  for (const post of STARTER_RECIPES) {
    const existing = await prisma.post.findUnique({ where: { slug: post.slug } });
    if (existing) continue;
    await prisma.post.create({
      data: { ...post, kind: "recipe", published: true },
    });
  }

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
