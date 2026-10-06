import {
  blankWellnessPartner,
  defaultWellnessPartners,
  normalizePartner,
  partnersFromFormData,
  resolveWellnessPartners,
} from "./wellness-partners";
import {
  COLLABORATIVE_CARE_PARTNER_DETAIL,
  COLLABORATIVE_CARE_PARTNER_NAME,
  COLLABORATIVE_CARE_PARTNER_URL,
} from "./page-copy";
import { contentFromFormData, resolveCollaborativeContent } from "./page-templates";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const defaults = defaultWellnessPartners();
assert(defaults.length === 1, "default list should include Arista Smiles");
assert(defaults[0].name === COLLABORATIVE_CARE_PARTNER_NAME, "default partner name");
assert(defaults[0].detail === COLLABORATIVE_CARE_PARTNER_DETAIL, "default partner detail");
assert(defaults[0].url === COLLABORATIVE_CARE_PARTNER_URL, "default partner url");
assert(defaults[0].body.length === 2, "default partner should keep both body paragraphs");

const fromEmpty = resolveWellnessPartners("");
assert(fromEmpty.length === 1, "missing partners key should prefill Arista Smiles");
assert(fromEmpty[0].name === COLLABORATIVE_CARE_PARTNER_NAME, "empty content should not drop Arista Smiles");

const fromLegacy = resolveWellnessPartners(
  JSON.stringify({
    partnerName: "Edited Partner",
    partnerDetail: "Acupuncture | Astoria, NY",
    partnerBody: ["First paragraph.", "Second paragraph."],
    partnerLabel: "Visit clinic",
    partnerUrl: "https://example.com",
  }),
);
assert(fromLegacy.length === 1, "legacy single-card fields should migrate to one partner");
assert(fromLegacy[0].name === "Edited Partner", "legacy name must be preserved");
assert(fromLegacy[0].detail.includes("Astoria"), "legacy detail must be preserved");
assert(fromLegacy[0].label === "Visit clinic", "legacy button label must be preserved");

const listed = resolveWellnessPartners(
  JSON.stringify({
    partners: [
      { id: "one", name: "First", detail: "A", body: ["Hello"], label: "Go", url: "https://a.example" },
      { id: "two", name: "Second", detail: "B", body: "Only one\n\nWait two", photo: "/photo.jpg", photoAlt: "Clinic" },
    ],
    partnerName: "Should be ignored",
  }),
);
assert(listed.length === 2, "saved partners array should win over legacy fields");
assert(listed[0].name === "First" && listed[1].name === "Second", "both saved partners should render");
assert(listed[1].body.length === 2, "body string should split on blank lines");
assert(listed[1].photo === "/photo.jpg", "optional photo should persist");

const emptied = resolveWellnessPartners(JSON.stringify({ partners: [] }));
assert(emptied.length === 0, "an explicit empty partners array must stay empty");

const blank = blankWellnessPartner();
assert(blank.id && blank.name === "", "new partners start blank so they can be filled in admin");

const normalized = normalizePartner({ name: "  Clinic  ", body: ["", "Keep me", ""] }, 3);
assert(normalized.name === "Clinic", "partner name should trim");
assert(normalized.body.join("|") === "Keep me", "empty body lines should drop");
assert(normalized.id === "partner-4", "missing id should be stable from index");

const form = new FormData();
form.set(
  "partners_json",
  JSON.stringify([
    { name: "A", detail: "one" },
    { name: "", detail: "", body: [] },
    { name: "B", url: "https://b.example" },
  ]),
);
const fromForm = partnersFromFormData(form);
assert(fromForm && fromForm.length === 2, "form save should drop completely empty cards");
assert(fromForm && fromForm[0].name === "A" && fromForm[1].name === "B", "form order should be preserved");

const missingForm = partnersFromFormData(new FormData());
assert(missingForm === null, "missing partners_json should not wipe existing partners");

const pageForm = new FormData();
pageForm.set("contentMode", "template");
pageForm.set("sec_eyebrow", "A whole-person care network");
pageForm.set("sec_body", "Intro one.\n\nIntro two.");
pageForm.set(
  "partners_json",
  JSON.stringify([
    { name: "Arista Smiles", detail: "Bayside", body: ["Keep me"], label: "Visit", url: "https://a.example" },
    { name: "Second Clinic", detail: "Astoria", body: ["New partner"], label: "Visit clinic", url: "https://b.example" },
  ]),
);
const saved = JSON.parse(contentFromFormData("collaborative-care", pageForm, '{"eyebrow":"old"}'));
assert(Array.isArray(saved.partners) && saved.partners.length === 2, "page save should persist the partners array");
assert(saved.partners[1].name === "Second Clinic", "page save should keep added partners");
assert(saved.eyebrow === "A whole-person care network", "intro copy should stay independently editable");

const resolved = resolveCollaborativeContent(JSON.stringify(saved));
assert(resolved.partners.length === 2, "public resolver should return every saved partner");
assert(resolved.paragraphs.length === 2, "intro paragraphs should still resolve");

console.log("wellness-partners.check: ok");
