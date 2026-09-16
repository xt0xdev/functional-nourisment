"use client";

import { useMemo, useState } from "react";
import { CalendlyEmbed } from "@/components/site/CalendlyEmbed";
import { INQUIRY_INTERESTS, INQUIRY_SOURCES, showsReferredBy } from "@/lib/inquiry";

export function ContactForm({
  defaultTopic = "General Inquiry",
  showCalendlyOnSuccess = false,
  calendlyUrl = "",
}: {
  defaultTopic?: string;
  showCalendlyOnSuccess?: boolean;
  calendlyUrl?: string;
}) {
  const initialInterest = INQUIRY_INTERESTS.includes(defaultTopic as (typeof INQUIRY_INTERESTS)[number])
    ? defaultTopic
    : defaultTopic.toLowerCase().includes("discover")
      ? "Nutrition Counseling"
      : "General Inquiry";
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [source, setSource] = useState("");
  const [interest, setInterest] = useState(initialInterest);
  const needsReferral = useMemo(() => showsReferredBy(source), [source]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      setStatus("sent");
      form.reset();
      setSource("");
      setInterest(initialInterest);
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-sand p-6 text-forest">
        <p>Thank you. Your inquiry has been received, and Anna will be in touch shortly.</p>
        {showCalendlyOnSuccess ? <CalendlyEmbed url={calendlyUrl} /> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        Name*
        <input
          required
          name="name"
          placeholder="Your name"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Email*
        <input
          required
          type="email"
          name="email"
          placeholder="Your email address"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Phone*
        <input
          required
          name="phone"
          type="tel"
          placeholder="Your phone number"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        What are you interested in?*
        <select
          required
          name="topic"
          value={interest}
          onChange={(event) => setInterest(event.target.value)}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        >
          {INQUIRY_INTERESTS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        How did you hear about Functional Nourishment?*
        <select
          required
          name="source"
          value={source}
          onChange={(event) => setSource(event.target.value)}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        >
          <option value="" disabled>
            Select one
          </option>
          {INQUIRY_SOURCES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {needsReferral ? (
        <label className="grid gap-1 text-sm">
          Who referred you?*
          <input
            required
            name="referredBy"
            className="rounded-xl border border-forest/15 bg-white px-3 py-2"
            placeholder="Name of person or organization"
          />
        </label>
      ) : (
        <input type="hidden" name="referredBy" value="" />
      )}
      <label className="grid gap-1 text-sm">
        Message*
        <textarea
          required
          name="message"
          rows={5}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
          placeholder="How can I support you? Please share a few details about why you are seeking my services."
        />
        <span className="text-xs text-muted">
          Please do not include sensitive medical or health information in this form.
        </span>
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-forest px-6 py-3 text-cream disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Inquiry"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-clay">Something went wrong. Please email directly instead.</p>
      ) : null}
    </form>
  );
}
