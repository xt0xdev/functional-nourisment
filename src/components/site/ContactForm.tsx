"use client";

import { useState } from "react";

export function ContactForm({ defaultTopic = "Discovery call" }: { defaultTopic?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
    } else {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl bg-sand p-6 text-forest">
        Thank you. Anna will be in touch shortly about your inquiry.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <label className="grid gap-1 text-sm">
        Name
        <input required name="name" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Email
        <input
          required
          type="email"
          name="email"
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        />
      </label>
      <label className="grid gap-1 text-sm">
        Phone
        <input name="phone" className="rounded-xl border border-forest/15 bg-white px-3 py-2" />
      </label>
      <label className="grid gap-1 text-sm">
        Topic
        <select
          name="topic"
          defaultValue={defaultTopic}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
        >
          <option>Discovery call</option>
          <option>Insurance / Berry Street</option>
          <option>Reiki or sound healing</option>
          <option>Corporate workshop</option>
          <option>General</option>
        </select>
      </label>
      <label className="grid gap-1 text-sm">
        Message
        <textarea
          required
          name="message"
          rows={5}
          className="rounded-xl border border-forest/15 bg-white px-3 py-2"
          placeholder="Share what you would like support with."
        />
      </label>
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded-full bg-forest px-6 py-3 text-cream disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "error" ? (
        <p className="text-sm text-clay">Something went wrong. Please email directly instead.</p>
      ) : null}
    </form>
  );
}
