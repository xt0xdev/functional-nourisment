import { prisma } from "@/lib/prisma";
import { saveSettings } from "../actions";

const fields = [
  ["siteName", "Site name"],
  ["practitionerName", "Practitioner name"],
  ["practitionerShortName", "Short name"],
  ["credentials", "Credentials"],
  ["tagline", "Tagline"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["address", "Address"],
  ["city", "City"],
  ["region", "Region"],
  ["postalCode", "Postal code"],
  ["serviceArea", "Service area"],
  ["instagram", "Instagram URL"],
  ["berryStreetUrl", "Berry Street URL"],
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

  return (
    <div>
      <h1 className="font-serif text-4xl text-forest">Site settings</h1>
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
                defaultValue={settings[key] || ""}
                className="rounded-xl border border-forest/15 bg-white px-3 py-2"
              />
            )}
            {key === "bookingUrl" ? (
              <p className="text-xs text-muted">
                Used by the header Book a Discovery Call button, footer link, homepage, and other
                booking CTAs.
              </p>
            ) : null}
          </label>
        ))}
        <button className="mt-2 w-fit rounded-full bg-forest px-6 py-3 text-cream">Save settings</button>
      </form>
    </div>
  );
}
