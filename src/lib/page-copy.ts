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
export const ABOUT_CREDENTIALS = "MS, CNS, LN, CDN, CHHC";
export const ABOUT_HERO_SUBHEADING =
  "Certified and NYS licensed dietician-nutritionist and mind-body medicine practitioner based in Astoria, serving Queens and the New York City metro area.";

export const ABOUT_CREDENTIAL_SOUND =
  "Sound Bath, Breathwork & Meditation Facilitator";

export function splitPractitionerHeading(heading?: string | null) {
  const text = heading?.trim() || "";
  if (!text) return { name: ABOUT_NAME, credentials: ABOUT_CREDENTIALS };
  const match = text.match(/^(.*?)(?:,\s*)(MS,?.*)$/i);
  if (match) {
    return { name: match[1].trim() || ABOUT_NAME, credentials: match[2].trim() };
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

export const NUTRITION_IMAGE =
  "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=1400&q=80";

export const NUTRITION_IMAGE_ALT =
  "Placeholder: fresh herbs and produce on a kitchen table — replace in admin";

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
    icon: "activity",
  },
  {
    title: "Weight Management & GLP-1 Support",
    detail: "Sustainable weight management · GLP-1 nutrition support",
    icon: "scale",
  },
  {
    title: "Gut & Digestive Health",
    detail: "IBS · Celiac disease · Digestive concerns",
    icon: "leaf",
  },
  {
    title: "Nutritional Deficiencies",
    detail: "Iron · Vitamin & mineral deficiencies",
    icon: "sparkle",
  },
  {
    title: "General Well-Being & Stress Support",
    detail: "Energy · Stress · Nourishment · Overall well-being",
    icon: "sun",
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

export const EXPERIENCES_INTRO =
  "I offer bespoke corporate wellness workshops, as well as intimate small group and local experiences, that blend functional nutrition and culinary experiences, stress resilience, and immersive mind-body practices, including breathwork, meditation, sound baths. Each session is thoughtfully designed to restore balance, elevate energy, and provide practical tools for sustained well-being.";

export const EXPERIENCES_INTRO_MORE =
  "If you don’t see exactly what you’re looking for, you’re welcome to share your preferences, each experience can be thoughtfully customized to meet your needs.";

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
