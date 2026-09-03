"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={logout} className="w-full rounded-lg px-3 py-2 text-left hover:bg-white/10">
      Log out
    </button>
  );
}
