import {
  filterPublicLinks,
  hasServingMenuItems,
  hiddenPublicHrefs,
  isInternalMenuHref,
  isPubliclyVisibleHref,
  normalizeMenuHref,
  resolveServingLinks,
  siblingIdsForHref,
} from "./menu-visibility";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(normalizeMenuHref("/nourish/") === "/nourish", "trailing slashes collapse");
assert(normalizeMenuHref("/nourish#resources") === "/nourish#resources", "hash fragments stay on the path");
assert(normalizeMenuHref("  /recipes  ") === "/recipes", "hrefs are trimmed");
assert(normalizeMenuHref("") === "", "empty href stays empty");
assert(isInternalMenuHref("/nourish") === true, "/nourish is an internal nav href");
assert(isInternalMenuHref("https://client.practicebetter.io/#/signin") === false, "Client Portal stays location-specific");

const items = [
  { id: "h-nourish", href: "/nourish", location: "header", parentId: null, visible: false, groupName: null },
  { id: "h-journal", href: "/journal", location: "header", parentId: "h-nourish", visible: true, groupName: null },
  { id: "h-recipes", href: "/recipes", location: "header", parentId: "h-nourish", visible: true, groupName: null },
  { id: "h-resources", href: "/nourish#resources", location: "header", parentId: "h-nourish", visible: true, groupName: null },
  { id: "f-nourish", href: "/nourish", location: "footer", parentId: null, visible: true, groupName: "Wellness" },
  { id: "f-recipes", href: "/recipes", location: "footer", parentId: null, visible: true, groupName: "Wellness" },
  { id: "f-journal", href: "/journal", location: "footer", parentId: null, visible: true, groupName: "Wellness" },
  { id: "f-about", href: "/about", location: "footer", parentId: null, visible: true, groupName: "Connect" },
  { id: "f-portal", href: "https://client.practicebetter.io/#/signin", location: "footer", parentId: null, visible: true, groupName: "Connect" },
  { id: "h-portal", href: "https://client.practicebetter.io/#/signin", location: "header", parentId: null, visible: false, groupName: null },
  { id: "f-astoria", href: "/locations/astoria", location: "footer", parentId: null, visible: true, groupName: "Serving" },
  { id: "f-queens", href: "/locations/queens", location: "footer", parentId: null, visible: false, groupName: "Serving" },
];

const hidden = hiddenPublicHrefs(items);

assert(hidden.has("/nourish"), "hidden header Nourish hides /nourish everywhere");
assert(hidden.has("/recipes"), "children of hidden Nourish hide /recipes in the footer");
assert(hidden.has("/journal"), "children of hidden Nourish hide /journal in the footer");
assert(hidden.has("/nourish#resources"), "hidden Nourish also hides its Resources child");
assert(hidden.has("/locations/queens"), "a hidden Serving row stays hidden");
assert(!hidden.has("/about"), "Connect links stay public when they are visible");
assert(!hidden.has("/locations/astoria"), "visible Serving rows stay public");
assert(
  !Array.from(hidden).some((href) => href.includes("practicebetter")),
  "a hidden header Client Portal does not hide the footer Connect link",
);

assert(isPubliclyVisibleHref("/nourish", hidden) === false, "public nav must drop /nourish");
assert(isPubliclyVisibleHref("/recipes", hidden) === false, "public nav must drop /recipes");
assert(isPubliclyVisibleHref("/about", hidden) === true, "About stays in Connect");
assert(isPubliclyVisibleHref("https://client.practicebetter.io/#/signin", hidden) === true, "Client Portal stays in Connect");

const wellness = filterPublicLinks(
  [
    { href: "/nourish", label: "Nourish" },
    { href: "/recipes", label: "Recipes" },
    { href: "/experiences", label: "Workshops & Experiences" },
  ],
  hidden,
);
assert(
  wellness.map((item) => item.href).join(",") === "/experiences",
  "footer Wellness keeps other links after Nourish/Recipes are hidden",
);

const siblings = siblingIdsForHref(items, "/nourish/", "h-nourish");
assert(siblings.includes("f-nourish"), "saving header Nourish visibility updates the footer sibling");
assert(!siblings.includes("h-nourish"), "the saved row is not a sibling of itself");
assert(!siblings.includes("f-recipes"), "Recipes is a different href");

assert(hasServingMenuItems(items) === true, "Serving group is detected from footer rows");
assert(
  resolveServingLinks(
    [{ href: "/locations/astoria", label: "Nutritionist in Astoria" }],
    [
      { href: "/locations/astoria", label: "Nutritionist in Astoria" },
      { href: "/locations/queens", label: "Nutritionist in Queens" },
    ],
    hidden,
    true,
    { href: "/locations/new-york-state", label: "New York State Telehealth" },
  )
    .map((item) => item.href)
    .join(",") === "/locations/astoria,/locations/new-york-state",
  "Serving uses visible menu rows and does not revive a hidden Queens chip",
);

assert(
  resolveServingLinks(
    undefined,
    [
      { href: "/nourish", label: "Nourish" },
      { href: "/recipes", label: "Recipes" },
      { href: "/locations/astoria", label: "Nutritionist in Astoria" },
    ],
    hidden,
    false,
  )
    .map((item) => item.href)
    .join(",") === "/locations/astoria",
  "static footer fallbacks must not inject hidden Nourish or Recipes",
);

assert(
  resolveServingLinks(undefined, [{ href: "/locations/queens", label: "Queens" }], hidden, true).length === 0,
  "when Serving exists in the CMS, do not replace a fully hidden group with static chips",
);

const recipesOnlyHidden = hiddenPublicHrefs([
  { id: "h-nourish", href: "/nourish", location: "header", parentId: null, visible: true, groupName: null },
  { id: "h-recipes", href: "/recipes", location: "header", parentId: "h-nourish", visible: false, groupName: null },
  { id: "f-nourish", href: "/nourish", location: "footer", parentId: null, visible: true, groupName: "Wellness" },
  { id: "f-recipes", href: "/recipes", location: "footer", parentId: null, visible: true, groupName: "Wellness" },
]);
assert(recipesOnlyHidden.has("/recipes"), "deactivating Recipes hides it in the footer");
assert(!recipesOnlyHidden.has("/nourish"), "Nourish stays public when only Recipes is hidden");

console.log("menu-visibility.check.ts passed");
