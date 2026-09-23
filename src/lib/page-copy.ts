export const PILLAR_MIND =
  "Your mind is the compass of your holistic well-being. The thoughts and emotions you foster, your perception and belief-system, your ability to cope with stress- all have an impact on your physical, emotional and spiritual health.";

export const PILLAR_BODY =
  "Your body is the foundation of your holistic well-being. It is the sacred vessel that carries you through life. When your body is healthy, nourished, energized and balanced, it creates the foundational strength and stability for other parts of you to flourish.";

export const PILLAR_SPIRIT =
  "Your spirit is the essence of your holistic well-being. It is the thread that weaves purpose, meaning and connection into your life. When your spirit feels nourished, you experience a deeper sense of peace, belonging and alignment with your true self.";

const LEGACY_PILLARS = [
  "Sound healing, meditation and breathwork to quiet the nervous system",
  "Functional nutrition counseling and medical nutrition therapy tailored",
  "Meditation, breathwork and sound bath experiences that reconnect you",
];

export function resolvePillarCopy(value: string | undefined, fallback: string) {
  const text = value?.trim() || "";
  if (!text) return fallback;
  if (LEGACY_PILLARS.some((legacy) => text.includes(legacy))) return fallback;
  return text;
}

export const ABOUT_NAME = "Anna Almiroudis";
export const ABOUT_CREDENTIALS = "MS, CNS, LN, CDN, CINHC";
export const ABOUT_HERO_SUBHEADING =
  "Certified and NYS licensed dietician-nutritionist and mind-body medicine practitioner based in Astoria, serving Queens and the New York City metro area.";

export const ABOUT_CREDENTIAL_SOUND =
  "Sound Bath, Breathwork & Meditation Facilitator";

export const ABOUT_CREDENTIAL_COACH =
  "Certified Integrative Nutrition Health Coach (CINHC)";

export function normalizeCredentials(value: string) {
  return value.replace(/\bCHHC\b/g, "CINHC");
}

export function splitPractitionerHeading(heading?: string | null) {
  const text = heading?.trim() || "";
  if (!text) return { name: ABOUT_NAME, credentials: ABOUT_CREDENTIALS };
  const match = text.match(/^(.*?)(?:,\s*)(MS,?.*)$/i);
  if (match) {
    return {
      name: match[1].trim() || ABOUT_NAME,
      credentials: normalizeCredentials(match[2].trim()),
    };
  }
  return { name: text, credentials: ABOUT_CREDENTIALS };
}

export function withUpdatedSoundCredential(paragraph: string) {
  return paragraph.replace(
    /Sound Bath(?:\s*&\s*|\s+and\s+)Meditation Facilitator/g,
    ABOUT_CREDENTIAL_SOUND,
  );
}

export const AMAZON_BOOK_URL =
  "https://www.amazon.com/Plant-Superheroes-Adventures-Citrus-Cousins/dp/B0G668ZRQ7";

export const NUTRITION_HERO =
  "Your body is the foundation of your well-being. Through nourishment, movement, rest, and personalized nutrition, we can support the systems that help you feel energized, resilient, and well from the inside out.";

export const NUTRITION_HEADING = "Nourishment from the inside out";

export const NUTRITION_IMAGE = "/images/nourish-body-bowl.png";

export const NUTRITION_IMAGE_ALT =
  "Mediterranean bowl with chicken, lentils, roasted vegetables, and greens";

export const NUTRITION_COOKING_IMAGE = "/images/nourish-body-cooking.jpg";

export const NUTRITION_COOKING_ALT = "Anna preparing a nourishing salad in a bright kitchen";

export const NUTRITION_INTRO =
  "Maybe you’re overwhelmed by conflicting nutrition advice and wondering what is actually right for you. Maybe you’re feeling tired, stressed, or simply not quite like yourself, or perhaps you’re navigating a health concern and looking for an approach that considers the bigger picture.";

export const NUTRITION_NOT_ALONE =
  "Wherever you are in your journey, you don’t have to figure it all out on your own.";

export const NUTRITION_APPROACH =
  "I believe nutrition should be as individual as you are. Together, we look beyond what’s on your plate to consider the many factors that influence your well-being, including nourishment, stress, sleep, movement, environment, and your relationship with food and your body.";

export const NUTRITION_FOOD_FIRST =
  "My approach is personalized, food-first, and rooted in both nutrition science and an understanding of the whole person. Rather than restrictive diets, quick fixes, or the latest health trend, we focus on realistic, meaningful changes that fit into your life.";

export const NUTRITION_GOAL =
  "My goal isn't simply to tell you what to eat. It's to help you better understand your body, feel confident in the choices you make, and create a way of nourishing yourself that feels supportive and sustainable.";

export const NUTRITION_HOW_IT_WORKS = [
  {
    title: "We start with you",
    text: "A comprehensive assessment helps me understand your health, nutrition, lifestyle, concerns, and goals.",
  },
  {
    title: "We create your path forward",
    text: "Together, we create a personalized plan with realistic steps designed around your needs and everyday life.",
  },
  {
    title: "We grow and adjust together",
    text: "Through ongoing support, we build on what’s working, navigate challenges, and adjust your plan as your needs evolve.",
  },
] as const;

export const NUTRITION_CLOSING =
  "Lasting change isn’t about doing everything perfectly. It’s about creating a way of nourishing yourself that feels supportive, sustainable, and truly your own.";

export const NUTRITION_AREAS = [
  {
    title: "Cardiovascular Health",
    detail: "Cholesterol · High blood pressure · Heart health",
    icon: "heart",
  },
  {
    title: "Blood Sugar & Metabolic Health",
    detail: "Prediabetes · Diabetes · Insulin resistance",
    icon: "droplet",
  },
  {
    title: "Weight Management & GLP-1 Support",
    detail: "Sustainable weight management · GLP-1 nutrition support",
    icon: "weight",
  },
  {
    title: "Gut & Digestive Health",
    detail: "IBS · Celiac disease · Digestive concerns",
    icon: "gut",
  },
  {
    title: "Nutritional Deficiencies",
    detail: "Iron · Vitamin & mineral deficiencies",
    icon: "pill",
  },
  {
    title: "General Well-Being & Stress Support",
    detail: "Energy · Stress · Nourishment · Overall well-being",
    icon: "lotus",
  },
] as const;

export const MIND_HERO =
  "Your mental and emotional well-being are deeply connected to how you feel in your body. Creating space to slow down, manage stress, and cultivate greater awareness can help you feel more present, grounded, and connected to yourself.";

export const MIND_WHAT =
  "Sound healing uses the tones, vibrations, and rhythmic frequencies of instruments such as singing bowls to create an immersive environment that encourages the mind and body to slow down. Much like breathwork and meditation, sound-based practices can support the relaxation response, helping to ease stress, quiet mental activity, and promote a deeper sense of rest and presence.";

export const MIND_HOW =
  "One way sound may influence our state of awareness is through a process known as entrainment, the tendency of biological rhythms to synchronize with repetitive external rhythms. The sustained tones, harmonics, and frequencies produced by singing bowls may influence patterns of neural activity and support shifts toward slower brainwave activity associated with relaxation and meditation, such as alpha and theta states.";

export const MIND_MEDITATIVE =
  "As breathing naturally begins to slow and attention becomes absorbed in the sound, the experience can create a deeply meditative state without requiring you to actively “quiet” the mind. This combination of sound, vibration, focused awareness, and intentional breathing can provide a powerful space to step away from the stimulation of daily life and reconnect with the body.";

export const MIND_SESSIONS =
  "My in-person sessions in Astoria, Queens combine sound healing, breathwork, meditation, and Reiki to create a restorative mind-body experience designed to support relaxation, stress reduction, mindfulness, and overall well-being.";

export const SPIRIT_EYEBROW = "SPIRIT · NATURE · CONNECTION · WELL-BEING";
export const SPIRIT_HERO =
  "A space to reconnect—with yourself, with others, and with the natural world. Through nature, herbs, mindful practices, workshops, retreats, and shared experiences, Nourish Spirit invites you to slow down, cultivate presence, and nurture a deeper sense of meaning, belonging, and well-being.";

export const SPIRIT_GATHER_INTRO =
  "Nourish Spirit comes to life through thoughtfully curated workshops, retreats, and wellness experiences that bring together nourishment, nature, mindfulness, and community.";

export const SPIRIT_GATHER_MORE =
  "Each experience is designed as an opportunity to step away from the busyness of everyday life, reconnect with yourself and others, and explore practices that support a more intentional and nourished way of living.";

export const SPIRIT_EXPERIENCE_ITEMS = [
  "Seasonal wellness and herbal workshops",
  "Mindful cooking and nutrition experiences",
  "Meditation, breathwork, and sound healing",
  "Nature walks and herbal exploration",
  "Half-day and full-day wellness retreats",
  "Community gatherings centered around nourishment and well-being",
];

export const SPIRIT_RETREATS_LEAD =
  "Sometimes we need more than a moment—we need space to truly step away.";

export const SPIRIT_RETREATS_BODY =
  "Nourish Spirit retreats bring together nature, nourishment, movement, mindfulness, and meaningful connection in restorative settings designed to help you slow down and return to yourself.";

export const SPIRIT_RETREATS_GREECE =
  "From intimate local gatherings to immersive experiences inspired by the natural beauty and traditions of Greece, each retreat is thoughtfully created to nourish mind, body, and spirit.";

export const EXPERIENCES_TITLE = "Workshops & Experiences";
export const EXPERIENCES_SUB = "Experiences designed to nourish, connect, and inspire.";

export const EXPERIENCES_INTRO =
  "Workshops and experiences are an invitation to pause, gather, and reconnect—with yourself, with others, and with the practices that support a more nourished way of living.";

export const EXPERIENCES_INTRO_MORE =
  "Each offering is thoughtfully designed to bring together nutrition, mindfulness, sound, and nature in a way that feels grounding, educational, and restorative. Whether you are joining a sound bath, a wellness workshop, or a seasonal gathering, you are welcome exactly as you are.";

export const EXPERIENCE_SECTIONS = [
  {
    title: "Sound Bath Meditation",
    body: "Sound bath meditation uses the tones, vibrations, and harmonics of crystal and Tibetan singing bowls to create an immersive environment that encourages the mind and body to slow down. These experiences invite you into a deeply restful state, supporting stress reduction, presence, and a sense of inner quiet—without requiring you to actively silence the mind.",
  },
  {
    title: "Nutrition & Wellness Workshops",
    body: "Interactive workshops explore how food, herbs, and daily rhythms support energy, mood, and long-term well-being. From food-and-mood cooking classes to practical nutrition education, each session offers tools you can bring home and use in everyday life.",
  },
  {
    title: "Mindfulness & Meditation Experiences",
    body: "Mindfulness and meditation experiences create space to step out of the pace of daily life and return to the body. Through breathwork, guided meditation, and restorative pauses, these gatherings support nervous-system balance, emotional clarity, and a deeper sense of presence.",
  },
  {
    title: "Seasonal & Nature-Based Experiences",
    body: "Seasonal and nature-based experiences reconnect you with the rhythms of the natural world. Herbal exploration, outdoor gatherings, and practices rooted in the seasons offer a chance to slow down, notice, and nourish yourself in relationship with the living world around you.",
  },
] as const;

export const EXPERIENCES_GROUP_HEADING = "Bring an Experience to Your Group";
export const EXPERIENCES_GROUP_BODY =
  "Looking to bring an experience to your team, community, or private gathering? Workshops and wellness experiences can be customized for corporate settings, celebrations, and small groups.";

export const RETREATS_TITLE = "Retreats";
export const RETREATS_SUB =
  "Immersive space to step away, slow down, and return to yourself.";

export const RETREATS_INTRO = [
  "Sometimes we need more than a moment—we need space to truly step away.",
  "Retreats bring together nature, nourishment, movement, mindfulness, and meaningful connection in restorative settings designed to help you slow down and return to yourself.",
] as const;

export const RETREATS_WHAT_HEADING = "What You May Experience";
export const RETREATS_WHAT = [
  "Meditation, breathwork, and sound healing",
  "Nourishing meals and mindful eating",
  "Gentle movement and time outdoors",
  "Herbal exploration and seasonal practices",
  "Community, rest, and meaningful connection",
] as const;

export const RETREATS_NATURE_HEADING = "Rooted in Nature";
export const RETREATS_NATURE =
  "From intimate local gatherings to immersive experiences inspired by the natural beauty and traditions of Greece, each retreat is thoughtfully created to nourish mind, body, and spirit. Rooted in nature, these offerings invite you to reconnect with the land, with others, and with your own inner rhythm.";

export const NOURISH_TITLE = "Nourish";
export const NOURISH_HERO_LINE = "Nutrition, wellness, and inspiration for more intentional living.";
export const NOURISH_DESCRIPTION =
  "A space to learn, explore, and feel inspired. Discover evidence-based nutrition and wellness education, thoughtful perspectives, nourishing recipes, and simple ways to bring greater intention and well-being into everyday life.";

export const NOURISH_JOURNAL_LEAD = "Guidance and inspiration for a more nourished life.";
export const NOURISH_JOURNAL_BODY =
  "Explore evidence-based nutrition, mind-body wellness, mindful living, and thoughtful perspectives you can carry into everyday life.";
export const NOURISH_JOURNAL_TAGS = [
  "Nutrition & Health",
  "Mind-Body Wellness",
  "Food & Herbs",
  "Mindful Living",
  "Seasonal Wellness",
] as const;

export const NOURISH_RECIPES_LEAD = "Simple, nourishing recipes";
export const NOURISH_RECIPES_BODY =
  "Explore wholesome recipes inspired by whole foods, Mediterranean flavors, and a food-first approach to feeling well.";
export const NOURISH_RECIPE_TAGS = [
  "Breakfast",
  "Main Dishes",
  "Snacks",
  "Smoothies",
  "Plant-Forward",
  "Mediterranean",
  "Seasonal",
] as const;

export const CONTACT_HERO =
  "Have a question or interested in working together? Get in touch to learn more about nutrition counseling, sound baths, workshops, retreats and other wellness offerings.";

export const CONTACT_SECOND =
  "In-person wellness services are offered in Astoria, Queens, with virtual nutrition counseling available in New York city metro area and NY State.";

export const COLLABORATIVE_CARE_TITLE = "Collaborative Care";
export const COLLABORATIVE_CARE_EYEBROW = "A whole-person care network";
export const COLLABORATIVE_CARE_META_TITLE =
  "Collaborative Care | Functional Nourishment";
export const COLLABORATIVE_CARE_META_DESCRIPTION =
  "Functional Nourishment works with a network of integrative healthcare and wellness professionals to support your unique health needs.";
export const COLLABORATIVE_CARE_BODY =
  "At Functional Nourishment, we believe that true well-being is supported through a collaborative, whole-person approach to care. Through our network of integrative healthcare and wellness professionals, we work together to support your unique health needs, bringing complementary perspectives and expertise to your journey toward lasting well-being.";
export const COLLABORATIVE_CARE_PARTNER_LABEL =
  "Mike Kokkolis — Bell Dental Care, nutritionist collaboration";
export const COLLABORATIVE_CARE_PARTNER_URL = "https://belldentalcare.com/nutritionist";

export const EXPERIENCES_WORKSHOP_NOTE =
  "Stay tuned for future dates by checking the workshop page.";

export const SQUARESPACE_EXPERIENCES = [
  {
    slug: "balanced-food-mood",
    title: "Balanced Food & Mood",
    subtitle: "A Holistic Approach to Stress Resilience",
    excerpt:
      "Discover how food, breath, and mindful awareness work together to support a balanced mood and resilient energy. Includes a hands-on cooking demo of a nourishing meal that supports mood.",
    body: "This interactive workshop supports stress resilience through a whole-person approach, integrating breathwork, nutrition, and mindful awareness. Participants will learn simple techniques to regulate the nervous system, explore how balanced nutrition supports energy and mood, and apply these concepts by creating a simple, nourishing mini-meal that supports a balanced mood.",
    sortOrder: 1,
  },
  {
    slug: "reset-restore-reconnect",
    title: "Reset, Restore, Reconnect",
    subtitle: "A Guided Sound & Breath Experience",
    excerpt:
      "Step away from the demands of the day and into a restorative pause. Breathwork, guided meditation, and a soothing sound bath help release tension and reset the nervous system.",
    body: "This immersive group experience invites busy professionals to step out of the constant demands of the day and into a deeply restorative pause. In today’s fast-paced environments, the nervous system often remains in a heightened state of alert. This session offers a calming, intentional space to unwind, release accumulated tension, and reconnect with their inner stillness.\n\nParticipants are gently guided through a sequence of breathwork practices, a calming visualization meditation, and an immersive sound bath using crystal singing bowls and other instruments. Each element is thoughtfully layered to support the gradual softening of mental overactivity and the release of tension and stress.",
    sortOrder: 2,
  },
  {
    slug: "nourish-your-skin",
    title: "Nourish Your Skin: Inside and Out",
    subtitle: "An edible beauty cooking class",
    excerpt:
      "An interactive edible beauty cooking class using simple, wholesome ingredients to nourish the body and skin from the inside out.",
    body: "This is an interactive group experience that explores how nutrition and food-derived ingredients can support healthy, radiant skin. This hands-on workshop blends skin nutrition education with a guided DIY skincare activity, giving participants both practical knowledge and a take-home product.\n\nParticipants will learn the fundamentals of skin-supportive nutrients such as antioxidants, healthy fats, hydration, and protein, and how these factors influence overall skin appearance and resilience. The session then transitions into a step-by-step guided creation of a gentle antioxidant-rich face mask using simple ingredients commonly found in the kitchen or pantry.",
    sortOrder: 3,
  },
] as const;
