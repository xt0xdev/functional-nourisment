"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    if (!response.ok) {
      setError("Invalid email or password.");
      return;
    }
    router.push(params.get("next") || "/admin");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-24 w-full max-w-md rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="font-serif text-3xl text-forest">Admin login</h1>
      <p className="mt-2 text-sm text-muted">Manage content for Functional Nourishment.</p>
      <label className="mt-6 grid gap-1 text-sm">
        Email
        <input name="email" type="email" required className="rounded-xl border border-forest/15 px-3 py-2" />
      </label>
      <label className="mt-4 grid gap-1 text-sm">
        Password
        <input name="password" type="password" required className="rounded-xl border border-forest/15 px-3 py-2" />
      </label>
      {error ? <p className="mt-3 text-sm text-clay">{error}</p> : null}
      <button className="mt-6 w-full rounded-full bg-forest py-3 text-cream">Sign in</button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
