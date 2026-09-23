"use client";

import { useState } from "react";
import {
  EVENT_REGISTRATION_REQUIRED_NOTE,
  EVENT_REGISTRATION_SUBMIT,
} from "@/lib/page-copy";

export function EventRegistrationForm({
  eventId,
  eventTitle,
  eventWhen,
  stripeUrl,
}: {
  eventId: string;
  eventTitle: string;
  eventWhen: string;
  stripeUrl: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const agreedPolicy = formData.get("agreedPolicy") === "on";
    if (!agreedPolicy) {
      setStatus("error");
      setError("Please agree to the cancellation and refund policy to continue.");
      return;
    }

    const response = await fetch("/api/event-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventId,
        formKind: "workshop",
        name: String(formData.get("name") || ""),
        email: String(formData.get("email") || ""),
        phone: String(formData.get("phone") || ""),
        notes: String(formData.get("notes") || ""),
        mailingOptIn: formData.get("mailingOptIn") === "on",
        agreedPolicy: true,
      }),
    });

    if (!response.ok) {
      setStatus("error");
      setError("Please complete the required fields and try again.");
      return;
    }

    const result = (await response.json()) as { stripeUrl?: string };
    const paymentUrl = result.stripeUrl || stripeUrl;
    if (paymentUrl) {
      window.location.assign(paymentUrl);
      return;
    }
    setStatus("error");
    setError("Registration was saved, but a payment link was not available. Please email Anna.");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-3xl bg-white p-6 shadow-sm md:p-8">
      <label className="grid gap-1 text-sm">
        Event Name
        <input
          value={eventTitle}
          readOnly
          className="rounded-xl border border-forest/15 bg-mist px-3 py-2 text-primary"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Event Date & Time
        <input
          value={eventWhen}
          readOnly
          className="rounded-xl border border-forest/15 bg-mist px-3 py-2 text-primary"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Full Name *
        <input
          required
          name="name"
          autoComplete="name"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Email Address *
        <input
          required
          type="email"
          name="email"
          autoComplete="email"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Phone Number *
        <input
          required
          type="tel"
          name="phone"
          autoComplete="tel"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Is there anything we should know to help you participate comfortably? (Optional)
        <textarea name="notes" rows={4} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input required type="checkbox" name="agreedPolicy" className="mt-1" />
        <span>
          I have read and agree to the event&apos;s{" "}
          <a href="/event-policy" target="_blank" rel="noreferrer" className="text-teal underline">
            cancellation and refund policy
          </a>
          . *
        </span>
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="mailingOptIn" className="mt-1" />
        <span>I would like to receive updates about future events and wellness experiences.</span>
      </label>
      <button type="submit" disabled={status === "sending"} className="btn-primary mt-2 disabled:opacity-60">
        {status === "sending" ? "Saving…" : EVENT_REGISTRATION_SUBMIT}
      </button>
      <p className="text-sm text-muted">{EVENT_REGISTRATION_REQUIRED_NOTE}</p>
      {error ? <p className="text-sm text-clay">{error}</p> : null}
    </form>
  );
}
