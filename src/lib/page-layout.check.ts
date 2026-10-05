import { imageCaption, imageFit, normalizeBlock, normalizeLayout } from "./page-layout";

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

console.log("page-layout caption/fit checks passed");
