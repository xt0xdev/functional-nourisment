import { prisma } from "@/lib/prisma";
import { saveSettings } from "../actions";
import { DEFAULT_NOTIFY_EMAIL, formEmailAdminNote, formEmailConfigured } from "@/lib/notify";
import { blobAdminNote, hasBlobToken, storageDriver } from "@/lib/storage";

const fields = [
  ["siteName", "Site name"],
  ["practitionerName", "Practitioner name"],
  ["practitionerShortName", "Short name"],
  ["credentials", "Credentials"],
  ["tagline", "Tagline"],
  ["email", "Public contact email"],
  ["notifyEmail", "Form notification email"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["city", "City"],
  ["region", "Region"],
  ["postalCode", "Postal code"],
  ["serviceArea", "Service area"],
  ["instagram", "Instagram URL"],
  ["berryStreetUrl", "Berry Street URL"],
  ["stripeUrl", "Default Stripe payment URL"],
  ["paypalUrl", "Default PayPal payment URL"],
  ["insurance", "Insurance copy"],
  ["bookingNote", "Booking note"],
  ["npi", "NPI"],
  ["languages", "Languages"],
  ["footerText", "Footer text"],
  ["footerBlurb", "Footer description"],
  ["clientPortalUrl", "Client portal URL"],
  ["bookingUrl", "Book a Discovery Call URL"],
];

export default async function SettingsPage() {
  const rows = await prisma.setting.findMany();
  const settings = Object.fromEntries(rows.map((row) => [row.key, row.value]));
  const driver = storageDriver();
  const emailReady = formEmailConfigured();

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Site settings</h1>
      <div className="mt-4 grid gap-3">
        <div className={`rounded-2xl bg-white p-4 text-sm ${emailReady ? "text-muted" : "text-clay"}`}>
          <p className="font-medium text-forest">Form emails</p>
          <p className="mt-1">{formEmailAdminNote()}</p>
        </div>
        <div className={`rounded-2xl bg-white p-4 text-sm ${hasBlobToken() ? "text-muted" : "text-clay"}`}>
          <p className="font-medium text-forest">Media uploads</p>
          <p className="mt-1">{blobAdminNote(driver)}</p>
        </div>
      </div>
      <form action={saveSettings} className="mt-6 grid gap-4">
        {fields.map(([key, label]) => (
          <label key={key} className="grid gap-1 text-sm">
            {label}
            {key === "insurance" || key === "tagline" || key === "bookingNote" || key === "serviceArea" || key === "footerBlurb" ? (
              <textarea
                name={key}
                defaultValue={settings[key] || ""}
                rows={3}
                className="rounded-xl border border-forest/15 bg-white px-3 py-2"
              />
            ) : (
              <input
                name={key}
                defaultValue={key === "notifyEmail" ? settings[key] || DEFAULT_NOTIFY_EMAIL : settings[key] || ""}
                className="rounded-xl border border-forest/15 bg-white px-3 py-2"
              />
            )}
            {key === "notifyEmail" ? (
              <p className="text-xs text-muted">
                Every public form (contact, discovery, mailing list, event and retreat registration)
                emails this address. Default is {DEFAULT_NOTIFY_EMAIL}. Reply-To is the visitor.
              </p>
            ) : null}
            {key === "bookingUrl" ? (
              <p className="text-xs text-muted">
                Calendly URL people are redirected to after submitting the discovery inquiry on /book.
                Header, footer, and CTA buttons still go to /book first — they do not open Calendly
                directly.
              </p>
            ) : null}
            {key === "stripeUrl" || key === "paypalUrl" ? (
              <p className="text-xs text-muted">
                Default checkout link for workshops and sound baths. Individual events can override this.
              </p>
            ) : null}
          </label>
        ))}
        <button className="mt-2 w-fit rounded-full bg-forest px-6 py-3 text-cream">Save settings</button>
      </form>
    </div>
  );
}
