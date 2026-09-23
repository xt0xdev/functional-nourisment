"use client";

import { useState } from "react";
import {
  RETREAT_DIETARY_OPTIONS,
  RETREAT_HEAR_ABOUT_OPTIONS,
} from "@/lib/registration";

type RetreatRegistrationFormProps = {
  eventId: string;
  eventTitle: string;
  eventDate: string;
  stripeUrl: string;
};

export function RetreatRegistrationForm({
  eventId,
  eventTitle,
  eventDate,
  stripeUrl,
}: RetreatRegistrationFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [otherDietary, setOtherDietary] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const dietaryPreferences = formData.getAll("dietaryPreferences").map(String);
    const heardAbout = formData.getAll("heardAbout").map(String);
    if (!dietaryPreferences.length || !heardAbout.length) {
      setStatus("error");
      return;
    }
    const payload = {
      eventId,
      formKind: "retreat" as const,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      residence: String(formData.get("residence") || ""),
      participantCount: Number(formData.get("participantCount") || 1),
      dietaryPreferences,
      dietaryOther: String(formData.get("dietaryOther") || ""),
      foodAllergies: String(formData.get("foodAllergies") || ""),
      accessibilityNeeds: String(formData.get("accessibilityNeeds") || ""),
      inspiration: String(formData.get("inspiration") || ""),
      hopes: String(formData.get("hopes") || ""),
      heardAbout,
      mailingOptIn: formData.get("mailingOptIn") === "on",
      agreedPolicy: formData.get("agreedPolicy") === "on",
      agreedVoluntary: formData.get("agreedVoluntary") === "on",
      agreedEssentialComms: formData.get("agreedEssentialComms") === "on",
    };

    const response = await fetch("/api/event-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const result = (await response.json()) as { stripeUrl?: string };
    const paymentUrl = result.stripeUrl || stripeUrl;
    setStatus("sent");
    if (paymentUrl) {
      window.open(paymentUrl, "_blank", "noopener,noreferrer");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="font-serif text-3xl text-primary">Thank you for registering!</h2>
        <p className="mt-4 leading-relaxed text-muted">
          We look forward to sharing this nourishing experience with you. A confirmation email with
          your retreat details and additional information will be sent to your inbox.
        </p>
        <p className="mt-4 leading-relaxed text-muted">We can&apos;t wait to welcome you!</p>
        <p className="mt-6 text-sm leading-relaxed text-primary">
          Anna Almiroudis, MS, CNS, LN, CDN
          <br />
          Functional Nourishment
          <br />
          Nourishment for mind, body and spirit.
        </p>
        {stripeUrl ? (
          <a href={stripeUrl} target="_blank" rel="noreferrer" className="btn-primary mt-8">
            Continue to Payment
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-10">
      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl text-primary">1. Personal Information</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm">
            Full Name *
            <input required name="name" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Email *
            <input required type="email" name="email" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            Phone *
            <input required type="tel" name="phone" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            City and Country of Residence
            <input name="residence" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl text-primary">2. Your Retreat Selection</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm">
            Retreat Name *
            <input
              required
              name="retreatName"
              value={eventTitle}
              readOnly
              className="rounded-xl border border-forest/15 bg-mist px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Retreat Date *
            <input
              required
              name="retreatDate"
              value={eventDate}
              readOnly
              className="rounded-xl border border-forest/15 bg-mist px-3 py-2"
            />
          </label>
          <label className="grid gap-1 text-sm">
            Number of Participants *
            <input
              required
              type="number"
              min={1}
              max={20}
              name="participantCount"
              defaultValue={1}
              className="rounded-xl border border-forest/15 bg-white px-3 py-2"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl text-primary">3. Dietary Preferences & Accessibility</h2>
        <fieldset className="mt-5 grid gap-2">
          <legend className="text-sm">Do you have any dietary preferences or restrictions? *</legend>
          {RETREAT_DIETARY_OPTIONS.map((option) => (
            <label key={option} className="flex items-start gap-2 text-sm text-muted">
              <input
                type="checkbox"
                name="dietaryPreferences"
                value={option}
                className="mt-1"
                onChange={
                  option === "Other"
                    ? (event) => setOtherDietary(event.currentTarget.checked)
                    : undefined
                }
              />
              {option === "Other" ? "Other (please specify)" : option}
            </label>
          ))}
        </fieldset>
        {otherDietary ? (
          <label className="mt-3 grid gap-1 text-sm">
            Please specify
            <input name="dietaryOther" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
        ) : null}
        <label className="mt-5 grid gap-1 text-sm">
          Food allergies (specify or &quot;None&quot;) *
          <input
            required
            name="foodAllergies"
            placeholder='None'
            className="rounded-xl border border-forest/15 bg-white px-3 py-2"
          />
        </label>
        <label className="mt-4 grid gap-1 text-sm">
          Accessibility needs
          <textarea name="accessibilityNeeds" rows={3} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
        </label>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl text-primary">4. Your Intentions</h2>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-1 text-sm">
            What inspired you to join this retreat? *
            <textarea required name="inspiration" rows={4} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <label className="grid gap-1 text-sm">
            What are you hoping to experience or take away? (Optional)
            <textarea name="hopes" rows={4} className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
          </label>
          <fieldset className="grid gap-2">
            <legend className="text-sm">How did you hear about us? *</legend>
            {RETREAT_HEAR_ABOUT_OPTIONS.map((option) => (
              <label key={option} className="flex items-start gap-2 text-sm text-muted">
                <input type="checkbox" name="heardAbout" value={option} className="mt-1" />
                {option}
              </label>
            ))}
          </fieldset>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-serif text-2xl text-primary">5. Registration & Confirmation</h2>
        <div className="mt-5 grid gap-3 text-sm text-muted">
          <label className="flex items-start gap-2">
            <input required type="checkbox" name="agreedPolicy" className="mt-1" />
            <span>
              I have read and agree to the retreat&apos;s{" "}
              <a href="/event-policy" target="_blank" rel="noreferrer" className="text-teal underline">
                cancellation and refund policy
              </a>
              . *
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input required type="checkbox" name="agreedVoluntary" className="mt-1" />
            <span>
              I understand that participation in retreat activities is voluntary and that I may choose
              not to participate in any activity. *
            </span>
          </label>
          <label className="flex items-start gap-2">
            <input required type="checkbox" name="agreedEssentialComms" className="mt-1" />
            <span>I agree to receive essential communications regarding my retreat registration. *</span>
          </label>
          <label className="flex items-start gap-2">
            <input type="checkbox" name="mailingOptIn" className="mt-1" />
            <span>
              I would like to receive occasional updates about future retreats, gatherings, and
              nourishing offerings. (Optional)
            </span>
          </label>
        </div>
      </section>

      <section className="rounded-3xl bg-mist p-6 md:p-8">
        <h2 className="font-serif text-3xl text-primary">Ready to Join Us?</h2>
        <p className="mt-3 leading-relaxed text-muted">
          Complete your registration and proceed to secure payment to reserve your place.
        </p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="btn-primary mt-6 disabled:opacity-60"
        >
          {status === "sending" ? "Saving…" : "Continue to Payment"}
        </button>
        <p className="mt-4 text-sm text-muted">* Required fields</p>
        {status === "error" ? (
          <p className="mt-3 text-sm text-clay">
            Something went wrong. Please complete the required fields and try again, or email Anna
            directly.
          </p>
        ) : null}
      </section>
    </form>
  );
}
