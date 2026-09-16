export const SITE_IMAGES = {
  landingHero: "/images/landing-hero-terrace.png",
  landingHeroAlt:
    "Anna reading on a terrace overlooking the sea, with slippers by the table",
  landingMeet: "/images/landing-meet-anna.jpg",
  landingMeetAlt:
    "Anna Almiroudis at a table with a notebook and mug, overlooking the sea",
  bodyBowl: "/images/nourish-body-bowl.png",
  bodyBowlAlt:
    "Mediterranean bowl with chicken, lentils, roasted vegetables, and greens",
  bodyCooking: "/images/nourish-body-cooking.jpg",
  bodyCookingAlt: "Anna preparing a nourishing salad in a bright kitchen",
  mindMeditation: "/images/nourish-mind-meditation.png",
  mindMeditationAlt: "Woman meditating outdoors in a seated prayer pose",
  mindBowls: "/images/nourish-mind-bowls.png",
  mindBowlsAlt: "Crystal singing bowls and Tibetan bowls arranged for sound healing",
  spiritSoundbath: "/images/nourish-spirit-soundbath.png",
  spiritSoundbathAlt:
    "Sound bath meditation circle at sunset on a pebble beach",
  greeceCircle: "/images/meditation-2025-greece.jpg",
  greeceCircleAlt: "Meditation and sound bath on a pebble beach in Greece, 2025",
  greeceClose: "/images/meditation-2025-greece-circle.jpg",
  greeceCloseAlt: "Closer view of the 2025 Greece retreat sound bath circle",
  wellnessYoga: "/images/wellness-yoga-warriors.png",
  wellnessYogaAlt: "Outdoor yoga class in warrior pose on a hillside terrace",
  wellnessMats: "/images/wellness-mats-bowls.png",
  wellnessMatsAlt: "Meditation mats and singing bowls at an outdoor gathering",
  wellnessCliff: "/images/wellness-cliff-meditation.png",
  wellnessCliffAlt: "Small meditation circle on a cliff overlooking the sea",
  wellnessHerb: "/images/wellness-herb-sunset.png",
  wellnessHerbAlt: "Wild herb held against a sunset over the water",
  wellnessDining: "/images/wellness-outdoor-dining.png",
  wellnessDiningAlt: "Friends sharing a nourishing meal outdoors by the sea",
} as const;

export const WELLNESS_GALLERY = [
  { src: SITE_IMAGES.wellnessYoga, alt: SITE_IMAGES.wellnessYogaAlt },
  { src: SITE_IMAGES.wellnessMats, alt: SITE_IMAGES.wellnessMatsAlt },
  { src: SITE_IMAGES.wellnessCliff, alt: SITE_IMAGES.wellnessCliffAlt },
  { src: SITE_IMAGES.wellnessHerb, alt: SITE_IMAGES.wellnessHerbAlt },
  { src: SITE_IMAGES.wellnessDining, alt: SITE_IMAGES.wellnessDiningAlt },
] as const;

export function isStockOrEmptyImage(url?: string | null) {
  const value = url?.trim() || "";
  if (!value) return true;
  return value.includes("unsplash.com") || value.includes("images.unsplash");
}
