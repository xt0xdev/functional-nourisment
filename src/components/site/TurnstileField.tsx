"use client";

import { useEffect, useId, useRef, useState } from "react";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SCRIPT_ATTR = "data-fn-turnstile";

type TurnstileTheme = "light" | "dark" | "auto";
type TurnstileSize = "normal" | "compact" | "flexible";

type TurnstileAPI = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      theme?: TurnstileTheme;
      size?: TurnstileSize;
      appearance?: "always" | "execute" | "interaction-only";
      action?: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      "timeout-callback"?: () => void;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

let scriptPromise: Promise<TurnstileAPI> | null = null;

function loadTurnstile(): Promise<TurnstileAPI> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Turnstile is browser-only."));
  }
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`);
    const settle = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("Turnstile script loaded without an API."));
    };

    if (existing) {
      if (window.turnstile) {
        resolve(window.turnstile);
        return;
      }
      existing.addEventListener("load", settle, { once: true });
      existing.addEventListener("error", () => reject(new Error("Turnstile script failed to load.")), {
        once: true,
      });
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.setAttribute(SCRIPT_ATTR, "true");
    script.addEventListener("load", settle, { once: true });
    script.addEventListener("error", () => reject(new Error("Turnstile script failed to load.")), {
      once: true,
    });
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function turnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
}

export function turnstileRequiredInBrowser() {
  return Boolean(turnstileSiteKey()) || process.env.NODE_ENV === "production";
}

export function readTurnstileToken(form: HTMLFormElement) {
  return String(new FormData(form).get("turnstileToken") || "").trim();
}

export function missingTurnstileMessage() {
  if (!turnstileSiteKey() && process.env.NODE_ENV === "production") {
    return "This form is protected and cannot be submitted until the site owner adds Cloudflare Turnstile keys.";
  }
  return "Please complete the security check and try again.";
}

export function TurnstileField({
  action,
  theme = "auto",
  size = "flexible",
  resetSignal = 0,
  onTokenChange,
}: {
  action: string;
  theme?: TurnstileTheme;
  size?: TurnstileSize;
  resetSignal?: number;
  onTokenChange?: (token: string) => void;
}) {
  const siteKey = turnstileSiteKey();
  const required = turnstileRequiredInBrowser();
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const labelId = useId();
  const statusId = useId();
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "unavailable">(
    siteKey ? "loading" : required ? "unavailable" : "ready",
  );
  const [token, setToken] = useState("");

  onTokenChangeRef.current = onTokenChange;

  function publishToken(next: string) {
    setToken(next);
    onTokenChangeRef.current?.(next);
  }

  useEffect(() => {
    if (!siteKey) {
      publishToken("");
      return;
    }

    let cancelled = false;
    setStatus("loading");
    publishToken("");

    loadTurnstile()
      .then((api) => {
        if (cancelled || !containerRef.current) return;
        if (widgetIdRef.current) {
          api.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
        widgetIdRef.current = api.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          appearance: "always",
          action,
          callback: (nextToken) => {
            publishToken(nextToken);
            setStatus("ready");
          },
          "expired-callback": () => {
            publishToken("");
          },
          "error-callback": () => {
            publishToken("");
            setStatus("error");
          },
          "timeout-callback": () => {
            publishToken("");
          },
        });
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [action, siteKey, size, theme]);

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return;
    window.turnstile.reset(widgetIdRef.current);
    publishToken("");
  }, [resetSignal]);

  if (!siteKey && !required) {
    return null;
  }

  const isDark = theme === "dark";
  const frameClass = isDark
    ? "rounded-2xl border border-white/15 bg-white/8 p-3"
    : "rounded-2xl border border-forest/15 bg-mist p-3";
  const labelClass = isDark ? "text-sm text-white/80" : "text-sm text-primary";
  const helpClass = isDark ? "text-xs text-white/60" : "text-xs text-muted";

  return (
    <div className={frameClass} role="group" aria-labelledby={labelId} aria-describedby={statusId}>
      <p id={labelId} className={labelClass}>
        Security check
      </p>
      {siteKey ? (
        <div ref={containerRef} className="mt-2 min-h-[65px] overflow-x-auto" />
      ) : (
        <p id={statusId} className={`mt-2 ${helpClass}`} role="alert">
          This form is protected and cannot be submitted until Cloudflare Turnstile keys are added
          in Vercel.
        </p>
      )}
      {siteKey && status === "loading" ? (
        <p id={statusId} className={`mt-2 ${helpClass}`}>
          Loading security check…
        </p>
      ) : null}
      {siteKey && status === "error" ? (
        <p id={statusId} className={`mt-2 ${isDark ? "text-sm text-accent" : "text-sm text-clay"}`} role="alert">
          The security check could not load. Please refresh the page and try again.
        </p>
      ) : null}
      {siteKey && status === "ready" ? (
        <p id={statusId} className={`mt-2 ${helpClass}`}>
          Complete the check above before sending. This helps keep spam out of Anna&apos;s inbox.
        </p>
      ) : null}
      <input type="hidden" name="turnstileToken" value={token} readOnly />
    </div>
  );
}
