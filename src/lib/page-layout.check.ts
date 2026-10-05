import { AMAZON_BOOK_LABEL, AMAZON_BOOK_URL } from "./page-copy";
import {
  buttonStyle,
  ensureAboutAmazonButton,
  getEventLayout,
  hasEnabledEventLayout,
  imageCaption,
  imageFit,
  layoutButtonLabel,
  normalizeBlock,
  normalizeLayout,
  prefillEventLayout,
  prefillLayout,
  resolveEventEditorLayout,
  sanitizeLayoutHref,
} from "./page-layout";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const stored = normalizeBlock({
  type: "image",
  wrap: "left",
  w: 38,
  h: 460,
  src: "/images/anna-almiroudis-grass.png",
  alt: "Anna Almiroudis sitting on the grass in a white dress with a water bottle and book",
});

assert(stored, "normalizeBlock should accept an image block");
assert(stored && (stored.alt || "").includes("water bottle"), "alt text must stay on the block for accessibility");
assert(stored && imageCaption(stored) === "", "alt must not become a visible caption");
assert(stored && imageFit(stored) === "contain", "existing layouts default to contain so photos are not cropped");

const withCaption = normalizeBlock({
  type: "image",
  caption: "  On the grass in Astoria  ",
  alt: "Screen reader only",
  fit: "cover",
});
assert(withCaption && imageCaption(withCaption) === "On the grass in Astoria", "editor caption should be trimmed and shown");
assert(withCaption && imageFit(withCaption) === "cover", "explicit crop mode should be preserved");

const circle = normalizeBlock({ type: "image", fit: "circle" });
assert(circle && imageFit(circle) === "circle", "circle crop is opt-in");

const bogus = normalizeBlock({ type: "image", fit: "oval" });
assert(bogus && imageFit(bogus) === "contain", "unknown fit falls back to contain");

const layout = normalizeLayout({
  enabled: true,
  blocks: [
    {
      type: "image",
      wrap: "left",
      src: "/images/anna-almiroudis-grass.png",
      alt: "Anna Almiroudis sitting on the grass in a white dress with a water bottle and book",
    },
    { type: "text", wrap: "full", html: "<p>Hello</p>" },
  ],
});
assert(layout?.blocks[0].wrap === "left", "wrap-left must survive normalize");
assert(layout && imageCaption(layout.blocks[0]) === "", "published layout must not surface alt as a caption");

const button = normalizeBlock({
  type: "button",
  label: "Buy on Amazon",
  href: AMAZON_BOOK_URL,
  style: "outline",
});
assert(button?.type === "button", "button blocks are a first-class type");
assert(button && layoutButtonLabel(button) === "Buy on Amazon", "button label must survive normalize");
assert(button?.href === AMAZON_BOOK_URL, "button href must survive normalize");
assert(button && buttonStyle(button) === "outline", "button style defaults to outline");

const filled = normalizeBlock({ type: "button", style: "primary", label: "Shop" });
assert(filled && buttonStyle(filled) === "primary", "explicit button style should be preserved");

assert(sanitizeLayoutHref("javascript:alert(1)") === "", "javascript hrefs must be stripped");
assert(sanitizeLayoutHref(AMAZON_BOOK_URL) === AMAZON_BOOK_URL, "https book url stays usable");

const aboutPrefill = prefillLayout("about");
const prefilledButton = aboutPrefill.blocks.find((block) => block.type === "button");
assert(prefilledButton, "about prefill must include the published Amazon button");
assert(prefilledButton?.label === AMAZON_BOOK_LABEL, "prefilled button uses the published label");
assert(prefilledButton?.href === AMAZON_BOOK_URL, "prefilled button uses AMAZON_BOOK_URL");

const legacyAbout = normalizeLayout({
  enabled: true,
  blocks: [{ type: "text", wrap: "full", html: "<p>Book note</p>" }],
});
assert(legacyAbout, "legacy about layout should normalize");
const seeded = ensureAboutAmazonButton(legacyAbout!);
assert(seeded.blocks.some((block) => block.type === "button"), "legacy about layouts get the published button so it does not disappear");
assert(seeded.seededButton, "injected button should mark the layout as seeded");

const afterDelete = ensureAboutAmazonButton({ ...seeded, blocks: seeded.blocks.filter((block) => block.type !== "button") });
assert(!afterDelete.blocks.some((block) => block.type === "button"), "deleting the seeded button must not re-inject it");

const hidden = ensureAboutAmazonButton(legacyAbout!, JSON.stringify({ showAmazonButton: false }));
assert(!hidden.blocks.some((block) => block.type === "button"), "admin hide skips the template Amazon button");

const eventPrefill = prefillEventLayout({
  description: "A weekend of rest in Astoria.\n\nBring a journal.",
  itinerary: "## Saturday\n\nArrive and settle.",
  coverUrl: "https://blob.example/cover.jpg",
  coverAlt: "Cover photo",
  gallery: [
    { url: "https://blob.example/one.jpg", alt: "Garden" },
    { url: "https://blob.example/cover.jpg", alt: "Duplicate cover" },
    { url: "https://blob.example/two.jpg", alt: "Kitchen" },
  ],
});
assert(eventPrefill.blocks.some((block) => block.type === "image" && block.src === "https://blob.example/cover.jpg"), "event prefill includes the cover photo");
assert(eventPrefill.blocks.filter((block) => block.type === "image").length === 3, "event prefill adds unique gallery photos around existing copy");
assert(eventPrefill.blocks.some((block) => (block.html || "").includes("weekend of rest")), "event prefill keeps the current description");
assert(eventPrefill.blocks.some((block) => block.type === "heading" && (block.html || "").includes("Itinerary")), "retreat itinerary is prefilled as a heading");
assert(!eventPrefill.enabled, "prefilled event layouts stay off until Anna designs them");

const storedEvent = JSON.stringify({
  version: 1,
  enabled: true,
  canvasHeight: 700,
  blocks: [
    { type: "image", src: "https://blob.example/a.jpg", alt: "One", wrap: "left", w: 40, h: 240 },
    { type: "image", src: "https://blob.example/b.jpg", alt: "Two", wrap: "right", w: 40, h: 240 },
    { type: "text", html: "<p>Designed copy</p>", wrap: "full" },
  ],
});
assert(hasEnabledEventLayout(storedEvent), "saved event layouts render when enabled");
assert(getEventLayout(storedEvent)?.blocks.length === 3, "event layout JSON persists multiple image blocks");
const resolvedStored = resolveEventEditorLayout(storedEvent, { description: "ignored" });
assert(resolvedStored.blocks.some((block) => (block.html || "").includes("Designed copy")), "saved event layouts win over prefill");
assert(!hasEnabledEventLayout(null), "events without layout JSON keep the current description fallback");
assert(!hasEnabledEventLayout("{}"), "empty objects are not live event layouts");

console.log("page-layout caption/fit/button checks passed");
