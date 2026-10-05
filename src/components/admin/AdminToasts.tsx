"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ADMIN_ERROR_PARAM, ADMIN_SAVED_PARAM } from "@/lib/admin-flash";

export type AdminToastTone = "success" | "error";

type AdminToast = {
  id: number;
  tone: AdminToastTone;
  message: string;
};

const DISMISS_MS = 3000;
const listeners = new Set<(toast: AdminToast) => void>();
let nextId = 1;
let lastFlashKey = "";

export function showAdminToast(message: string, tone: AdminToastTone = "success") {
  const toast = { id: nextId++, tone, message };
  listeners.forEach((listener) => listener(toast));
}

function stripFlashParams(pathname: string, searchParams: URLSearchParams) {
  const next = new URLSearchParams(searchParams.toString());
  const hadFlash = next.has(ADMIN_SAVED_PARAM) || next.has(ADMIN_ERROR_PARAM);
  next.delete(ADMIN_SAVED_PARAM);
  next.delete(ADMIN_ERROR_PARAM);
  const query = next.toString();
  return { hadFlash, href: query ? `${pathname}?${query}` : pathname };
}

export function AdminToasts() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [toasts, setToasts] = useState<AdminToast[]>([]);

  useEffect(() => {
    const add = (toast: AdminToast) => {
      setToasts((current) => [...current, toast]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, DISMISS_MS);
    };
    listeners.add(add);
    return () => {
      listeners.delete(add);
    };
  }, []);

  useEffect(() => {
    const saved = searchParams.get(ADMIN_SAVED_PARAM);
    const error = searchParams.get(ADMIN_ERROR_PARAM);
    if (!saved && !error) return;

    const flashKey = `${pathname}?${searchParams.toString()}`;
    if (lastFlashKey === flashKey) return;
    lastFlashKey = flashKey;

    if (error) showAdminToast("Could not save.", "error");
    else showAdminToast("Saved.");

    const { hadFlash, href } = stripFlashParams(pathname, new URLSearchParams(searchParams.toString()));
    if (hadFlash) router.replace(href, { scroll: false });
  }, [pathname, router, searchParams]);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role={toast.tone === "error" ? "alert" : "status"}
          aria-live={toast.tone === "error" ? "assertive" : "polite"}
          className={`pointer-events-auto rounded-xl px-4 py-3 text-sm text-cream shadow-lg ${
            toast.tone === "error" ? "border-l-4 border-[#e07a5f] bg-forest" : "border-l-4 border-teal bg-forest"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
