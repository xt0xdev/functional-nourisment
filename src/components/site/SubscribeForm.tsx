"use client";

import { useState } from "react";

export function SubscribeForm({ variant = "page" }: { variant?: "page" | "footer" }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "exists">("idle");
  const isFooter = variant === "footer";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const response = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (response.ok) {
      const payload = (await response.json()) as { alreadySubscribed?: boolean };
      setStatus(payload.alreadySubscribed ? "exists" : "sent");
      form.reset();
      return;
    }
    setStatus("error");
  }

  const fieldClass = isFooter
    ? "rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-white placeholder:text-white/40"
    : "rounded-xl border border-forest/15 bg-white px-3 py-2";

  if (status === "sent" || status === "exists") {
    return (
      <p className={isFooter ? "text-sm text-accent" : "rounded-2xl bg-sand p-6 text-forest"}>
        {status === "exists"
          ? "You’re already on the list. Thank you."
          : "You’re on the list. Thank you for subscribing."}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <label className={`grid gap-1 text-sm ${isFooter ? "text-white/80" : ""}`}>
        Full Name
        <input required name="name" autoComplete="name" className={fieldClass} />
      </label>
      <label className={`grid gap-1 text-sm ${isFooter ? "text-white/80" : ""}`}>
        Email address
        <input required type="email" name="email" autoComplete="email" className={fieldClass} />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className={
          isFooter
            ? "rounded-full bg-accent px-5 py-2 text-sm font-medium text-deep disabled:opacity-60"
            : "rounded-full bg-forest px-6 py-3 text-cream disabled:opacity-60"
        }
      >
        {status === "sending" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" ? (
        <p className={isFooter ? "text-sm text-accent" : "text-sm text-clay"}>
          Something went wrong. Please try again or email Anna directly.
        </p>
      ) : null}
    </form>
  );
}
