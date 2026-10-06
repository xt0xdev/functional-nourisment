import { SmartImage } from "./SmartImage";
import { isExternalPartnerUrl, type WellnessPartner } from "@/lib/wellness-partners";

export function WellnessPartnerCard({ partner }: { partner: WellnessPartner }) {
  const href = partner.url.trim();
  const label = partner.label.trim() || (href ? "Visit partner" : "");

  return (
    <article className="max-w-3xl rounded-3xl bg-mist p-8 shadow-sm ring-1 ring-primary/10">
      {partner.photo ? (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white">
          <SmartImage
            src={partner.photo}
            alt={partner.photoAlt || partner.name}
            width={1200}
            height={720}
            className="h-auto w-full object-contain"
          />
        </div>
      ) : null}
      <p className="eyebrow">Wellness partner</p>
      {partner.name ? (
        <h2 className="mt-3 font-serif text-3xl text-primary">{partner.name}</h2>
      ) : null}
      {partner.detail ? <p className="mt-2 font-medium text-primary">{partner.detail}</p> : null}
      {partner.body.map((paragraph) => (
        <p key={paragraph.slice(0, 48)} className="mt-4 leading-relaxed text-muted">
          {paragraph}
        </p>
      ))}
      {href && label ? (
        <a
          href={href}
          target={isExternalPartnerUrl(href) ? "_blank" : undefined}
          rel={isExternalPartnerUrl(href) ? "noreferrer" : undefined}
          className="btn-primary mt-6"
        >
          {label}
        </a>
      ) : null}
    </article>
  );
}
