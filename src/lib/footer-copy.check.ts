import {
  FOOTER_COPYRIGHT,
  FOOTER_MAILING_LIST_HEADING,
  FOOTER_SERVING_HEADING,
  FOOTER_SETTING_DEFAULTS,
  FOOTER_TAGLINE,
  FOOTER_TEXT_FIELDS,
  footerFieldValue,
  resolveFooterCopy,
  resolveFooterSetting,
} from "./footer-copy";
import { CHILDRENS_BOOK_NOTE, FOOTER_BLURB, MAILING_LIST_BLURB, PRACTITIONER_CREDIT } from "./site-defaults";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(FOOTER_TAGLINE === "Nourishing your whole self from the inside out.", "tagline matches published copy");
assert(FOOTER_SERVING_HEADING === "Serving", "serving heading matches published copy");
assert(FOOTER_MAILING_LIST_HEADING === "Mailing list", "mailing-list heading matches published copy");
assert(FOOTER_COPYRIGHT === "Functional Nourishment. All rights reserved.", "copyright matches published copy");
assert(FOOTER_SETTING_DEFAULTS.footerBlurb === FOOTER_BLURB, "blurb default is published footer blurb");
assert(FOOTER_SETTING_DEFAULTS.footerText === PRACTITIONER_CREDIT, "footerText default is practitioner credit");
assert(FOOTER_SETTING_DEFAULTS.footerCredit === PRACTITIONER_CREDIT, "credit default is practitioner credit");
assert(FOOTER_SETTING_DEFAULTS.footerChildrensBookNote === CHILDRENS_BOOK_NOTE, "book note default is published copy");
assert(FOOTER_SETTING_DEFAULTS.footerMailingListBlurb === MAILING_LIST_BLURB, "mailing body default is published copy");

const keys = FOOTER_TEXT_FIELDS.map((field) => field.key);
assert(keys.includes("footerTagline"), "admin fields include logo tagline");
assert(keys.includes("footerBlurb"), "admin fields surface existing footerBlurb");
assert(keys.includes("footerText"), "admin fields surface existing footerText");
assert(keys.includes("footerServingHeading"), "admin fields include serving heading");
assert(keys.includes("footerMailingListHeading"), "admin fields include mailing-list heading");
assert(keys.includes("footerMailingListBlurb"), "admin fields include mailing-list body");
assert(keys.includes("footerChildrensBookNote"), "admin fields include children's book line");
assert(keys.includes("footerCopyright"), "admin fields include copyright extras");
assert(keys.includes("footerCredit"), "admin fields include practitioner credit");

assert(resolveFooterSetting("", FOOTER_TAGLINE) === FOOTER_TAGLINE, "empty settings fall back to published copy");
assert(resolveFooterSetting("  Custom tagline  ", FOOTER_TAGLINE) === "Custom tagline", "custom copy is trimmed");
assert(footerFieldValue({}, "footerServingHeading") === "Serving", "missing serving heading stays Serving");

const empty = resolveFooterCopy({});
assert(empty.tagline === FOOTER_TAGLINE, "empty footerTagline uses published tagline");
assert(empty.blurb === FOOTER_BLURB, "empty footerBlurb uses published blurb");
assert(empty.childrensBookNote === CHILDRENS_BOOK_NOTE, "empty book note uses published line");
assert(empty.servingHeading === "Serving", "empty serving heading does not drop the column word");
assert(empty.mailingListHeading === "Mailing list", "empty mailing heading does not drop the column word");
assert(empty.mailingListBlurb === MAILING_LIST_BLURB, "empty mailing body uses published blurb");
assert(empty.creditLine === PRACTITIONER_CREDIT, "empty footerText uses practitioner credit");
assert(empty.copyright === FOOTER_COPYRIGHT, "empty copyright uses published extras");
assert(empty.practitionerCredit === PRACTITIONER_CREDIT, "empty credit uses practitioner credit");

const custom = resolveFooterCopy({
  footerTagline: "A custom tagline.",
  footerBlurb: "A custom blurb for Astoria clients.",
  footerChildrensBookNote: "Read the new book.",
  footerServingHeading: "Locations",
  footerMailingListHeading: "Stay in touch",
  footerMailingListBlurb: "Monthly notes from the practice.",
  footerText: "Custom credit",
  footerCopyright: "All rights reserved.",
  footerCredit: "Anna, Functional Nourishment",
});
assert(custom.tagline === "A custom tagline.", "custom tagline is used");
assert(custom.blurb === "A custom blurb for Astoria clients.", "custom blurb is used");
assert(custom.childrensBookNote === "Read the new book.", "custom book note is used");
assert(custom.servingHeading === "Locations", "custom serving heading is used");
assert(custom.mailingListHeading === "Stay in touch", "custom mailing heading is used");
assert(custom.mailingListBlurb === "Monthly notes from the practice.", "custom mailing body is used");
assert(custom.creditLine === "Custom credit", "custom footerText is used");
assert(custom.copyright === "All rights reserved.", "custom copyright is used");
assert(custom.practitionerCredit === "Anna, Functional Nourishment", "custom credit is used");

console.log("footer-copy.check: ok");
