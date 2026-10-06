import {
  CHILDRENS_BOOK_NOTE,
  FOOTER_BLURB,
  HERO_HEADING,
  MAILING_LIST_BLURB,
  PRACTITIONER_CREDIT,
  resolveFooterBlurb,
} from "./site-defaults";

export const FOOTER_TAGLINE = HERO_HEADING;
export const FOOTER_SERVING_HEADING = "Serving";
export const FOOTER_MAILING_LIST_HEADING = "Mailing list";
export const FOOTER_COPYRIGHT = "Functional Nourishment. All rights reserved.";

export const FOOTER_SETTING_DEFAULTS = {
  footerTagline: FOOTER_TAGLINE,
  footerBlurb: FOOTER_BLURB,
  footerChildrensBookNote: CHILDRENS_BOOK_NOTE,
  footerServingHeading: FOOTER_SERVING_HEADING,
  footerMailingListHeading: FOOTER_MAILING_LIST_HEADING,
  footerMailingListBlurb: MAILING_LIST_BLURB,
  footerText: PRACTITIONER_CREDIT,
  footerCopyright: FOOTER_COPYRIGHT,
  footerCredit: PRACTITIONER_CREDIT,
} as const;

export type FooterSettingKey = keyof typeof FOOTER_SETTING_DEFAULTS;

export const FOOTER_TEXT_FIELDS: {
  key: FooterSettingKey;
  label: string;
  hint: string;
  rows: number;
}[] = [
  {
    key: "footerTagline",
    label: "Logo tagline",
    hint: "Short line under the Functional Nourishment name in the first footer column.",
    rows: 2,
  },
  {
    key: "footerBlurb",
    label: "Practice blurb",
    hint: "Longer description under the tagline, before the address.",
    rows: 4,
  },
  {
    key: "footerChildrensBookNote",
    label: "Children’s book line",
    hint: "Amazon book link text under Instagram.",
    rows: 3,
  },
  {
    key: "footerServingHeading",
    label: "Serving column heading",
    hint: "Heading only. Location links stay in Admin → Menu. Clearing this does not remove the column.",
    rows: 1,
  },
  {
    key: "footerMailingListHeading",
    label: "Mailing list heading",
    hint: "Heading only. The signup form stays in place even if you clear this.",
    rows: 1,
  },
  {
    key: "footerMailingListBlurb",
    label: "Mailing list body",
    hint: "Text above the footer signup form.",
    rows: 3,
  },
  {
    key: "footerText",
    label: "Bottom credit line",
    hint: "First phrase in the copyright bar, before the year.",
    rows: 2,
  },
  {
    key: "footerCopyright",
    label: "Copyright line",
    hint: "Text after the automatic year. Example: Functional Nourishment. All rights reserved.",
    rows: 1,
  },
  {
    key: "footerCredit",
    label: "Practitioner credit",
    hint: "Extra line under the copyright bar.",
    rows: 2,
  },
];

export function resolveFooterSetting(value: string | null | undefined, fallback: string) {
  return value?.trim() || fallback;
}

export function footerFieldValue(settings: Record<string, string>, key: FooterSettingKey) {
  return resolveFooterSetting(settings[key], FOOTER_SETTING_DEFAULTS[key]);
}

export function resolveFooterCopy(settings: Record<string, string>) {
  return {
    tagline: footerFieldValue(settings, "footerTagline"),
    blurb: resolveFooterBlurb(settings.footerBlurb),
    childrensBookNote: footerFieldValue(settings, "footerChildrensBookNote"),
    servingHeading: footerFieldValue(settings, "footerServingHeading"),
    mailingListHeading: footerFieldValue(settings, "footerMailingListHeading"),
    mailingListBlurb: footerFieldValue(settings, "footerMailingListBlurb"),
    creditLine: footerFieldValue(settings, "footerText"),
    copyright: footerFieldValue(settings, "footerCopyright"),
    practitionerCredit: footerFieldValue(settings, "footerCredit"),
  };
}
