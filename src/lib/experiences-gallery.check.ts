import {
  blankExperiencesGalleryItem,
  defaultExperiencesGallery,
  galleryFromFormData,
  normalizeGalleryItem,
  resolveExperiencesGallery,
} from "./experiences-gallery";
import { WELLNESS_GALLERY } from "./site-images";
import { contentFromFormData, resolveExperiencesContent } from "./page-templates";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const defaults = defaultExperiencesGallery();
assert(defaults.length === 5, "default gallery should include the current 5 workshop photos");
assert(
  defaults.every((item, index) => item.src === WELLNESS_GALLERY[index].src && item.alt === WELLNESS_GALLERY[index].alt),
  "defaults must match the published wellness gallery",
);
assert(
  defaults.every((item) => item.caption === ""),
  "default photos should not invent captions",
);

const fromEmpty = resolveExperiencesGallery("");
assert(fromEmpty.length === 5, "missing gallery key should prefill the current 5 photos");
assert(fromEmpty[0].src === WELLNESS_GALLERY[0].src, "empty content should not drop the workshop photos");

const listed = resolveExperiencesGallery(
  JSON.stringify({
    gallery: [
      { id: "one", src: "/one.jpg", alt: "One", caption: "Sound bath" },
      { url: "/two.jpg", photoAlt: "Two" },
    ],
  }),
);
assert(listed.length === 2, "saved gallery array should win over defaults");
assert(listed[0].src === "/one.jpg" && listed[1].src === "/two.jpg", "both saved photos should render");
assert(listed[0].caption === "Sound bath", "optional caption should persist");
assert(listed[1].alt === "Two", "url/photoAlt aliases should normalize");

const emptied = resolveExperiencesGallery(JSON.stringify({ gallery: [] }));
assert(emptied.length === 0, "an explicit empty gallery array must stay empty");

const withoutSrc = resolveExperiencesGallery(
  JSON.stringify({
    gallery: [
      { id: "keep", src: "/keep.jpg", alt: "Keep" },
      { id: "drop", alt: "No image" },
    ],
  }),
);
assert(withoutSrc.length === 1 && withoutSrc[0].src === "/keep.jpg", "items without an image URL should drop");

const blank = blankExperiencesGalleryItem();
assert(blank.id && blank.src === "", "new gallery items start blank so they can be filled in admin");

const normalized = normalizeGalleryItem({ src: "  /photo.jpg  ", alt: "  Circle  ", caption: "  " }, 3);
assert(normalized.src === "/photo.jpg", "src should trim");
assert(normalized.alt === "Circle", "alt should trim");
assert(normalized.caption === "", "blank caption should become empty");
assert(normalized.id === "gallery-4", "missing id should be stable from index");

const form = new FormData();
form.set(
  "gallery_json",
  JSON.stringify([
    { src: "/a.jpg", alt: "A" },
    { src: "", alt: "skip me" },
    { src: "/b.jpg", alt: "B", caption: "Gathering" },
  ]),
);
const fromForm = galleryFromFormData(form);
assert(fromForm && fromForm.length === 2, "form save should drop photos without a URL");
assert(fromForm && fromForm[0].src === "/a.jpg" && fromForm[1].src === "/b.jpg", "form order should be preserved");
assert(fromForm && fromForm[1].caption === "Gathering", "form save should keep captions");

const missingForm = galleryFromFormData(new FormData());
assert(missingForm === null, "missing gallery_json should not wipe existing photos");

const pageForm = new FormData();
pageForm.set("contentMode", "template");
pageForm.set("sec_intro", "Intro stays.");
pageForm.set("sec_introMore", "Second paragraph stays.");
pageForm.set("sec_groupHeading", "Bring an Experience to Your Group");
pageForm.set("sec_groupBody", "Group body");
pageForm.set("sec_galleryEyebrow", "From the field");
pageForm.set("sec_galleryHeading", "Workshops, sound, and gathering");
pageForm.set("sec_datesHeading", "Dates");
pageForm.set("sec_retreatsHeading", "Retreats");
pageForm.set("grp_experienceSections_count", "0");
pageForm.set(
  "gallery_json",
  JSON.stringify([
    { src: "/one.jpg", alt: "One" },
    { src: "/two.jpg", alt: "Two", caption: "Sound" },
  ]),
);
const saved = JSON.parse(contentFromFormData("experiences", pageForm, '{"intro":"old"}'));
assert(Array.isArray(saved.gallery) && saved.gallery.length === 2, "page save should persist the gallery array");
assert(saved.gallery[1].src === "/two.jpg", "page save should keep added photos");
assert(saved.intro === "Intro stays.", "intro copy should stay independently editable");

const resolved = resolveExperiencesContent(JSON.stringify(saved));
assert(resolved.gallery.length === 2, "public resolver should return every saved photo");
assert(resolved.gallery[1].caption === "Sound", "public resolver should keep captions");
assert(resolved.intro === "Intro stays.", "intro should still resolve");

console.log("experiences-gallery.check: ok");
