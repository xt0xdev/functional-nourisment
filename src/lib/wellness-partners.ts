import {
  COLLABORATIVE_CARE_PARTNER_BODY,
  COLLABORATIVE_CARE_PARTNER_DETAIL,
  COLLABORATIVE_CARE_PARTNER_LABEL,
  COLLABORATIVE_CARE_PARTNER_NAME,
  COLLABORATIVE_CARE_PARTNER_URL,
} from "./page-copy";

export const PARTNERS_JSON_FIELD = "partners_json";

export type WellnessPartner = {
  id: string;
  name: string;
  detail: string;
  body: string[];
  label: string;
  url: string;
  photo: string;
  photoAlt: string;
};

export function newPartnerId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `partner-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function blankWellnessPartner(): WellnessPartner {
  return {
    id: newPartnerId(),
    name: "",
    detail: "",
    body: [],
    label: "Visit partner",
    url: "",
    photo: "",
    photoAlt: "",
  };
}

export function defaultWellnessPartners(): WellnessPartner[] {
  return [
    {
      id: "arista-smiles",
      name: COLLABORATIVE_CARE_PARTNER_NAME,
      detail: COLLABORATIVE_CARE_PARTNER_DETAIL,
      body: [...COLLABORATIVE_CARE_PARTNER_BODY],
      label: COLLABORATIVE_CARE_PARTNER_LABEL,
      url: COLLABORATIVE_CARE_PARTNER_URL,
      photo: "",
      photoAlt: "",
    },
  ];
}

function text(value: unknown, fallback = "") {
  const next = typeof value === "string" ? value.trim() : "";
  return next || fallback;
}

function paragraphs(value: unknown, fallback: readonly string[] = []) {
  const items = Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : typeof value === "string" && value.trim()
      ? value.split(/\n\n+/).map((item) => item.trim()).filter(Boolean)
      : [];
  return items.length ? items : [...fallback];
}

function parseObject(raw?: string | null): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw || "{}") as unknown;
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

export function normalizePartner(raw: unknown, index = 0): WellnessPartner {
  const row = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
  return {
    id: text(row.id, `partner-${index + 1}`),
    name: text(row.name),
    detail: text(row.detail),
    body: paragraphs(row.body),
    label: text(row.label),
    url: text(row.url),
    photo: text(row.photo),
    photoAlt: text(row.photoAlt),
  };
}

export function partnerHasContent(partner: WellnessPartner) {
  return Boolean(partner.name || partner.detail || partner.body.length || partner.url || partner.photo);
}

function partnerFromLegacy(stored: Record<string, unknown>): WellnessPartner {
  return {
    id: "arista-smiles",
    name: text(stored.partnerName, COLLABORATIVE_CARE_PARTNER_NAME),
    detail: text(stored.partnerDetail, COLLABORATIVE_CARE_PARTNER_DETAIL),
    body: paragraphs(stored.partnerBody, COLLABORATIVE_CARE_PARTNER_BODY),
    label: text(stored.partnerLabel, COLLABORATIVE_CARE_PARTNER_LABEL),
    url: text(stored.partnerUrl, COLLABORATIVE_CARE_PARTNER_URL),
    photo: text(stored.partnerPhoto),
    photoAlt: text(stored.partnerPhotoAlt),
  };
}

export function resolveWellnessPartnersFromContent(stored: Record<string, unknown>): WellnessPartner[] {
  if (Array.isArray(stored.partners)) {
    return stored.partners.map((item, index) => normalizePartner(item, index)).filter(partnerHasContent);
  }
  return [partnerFromLegacy(stored)];
}

export function resolveWellnessPartners(raw?: string | null): WellnessPartner[] {
  return resolveWellnessPartnersFromContent(parseObject(raw));
}

export function partnersFromFormData(formData: FormData): WellnessPartner[] | null {
  const raw = formData.get(PARTNERS_JSON_FIELD);
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return null;
    return parsed.map((item, index) => normalizePartner(item, index)).filter(partnerHasContent);
  } catch {
    return null;
  }
}

export function isExternalPartnerUrl(url: string) {
  return /^https?:\/\//i.test(url.trim());
}
