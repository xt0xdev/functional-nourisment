"use client";

import { useEffect, useId, useState } from "react";

export const CAPTCHA_TOKEN_FIELD = "captchaToken";
export const CAPTCHA_ANSWER_FIELD = "captchaAnswer";

export function readCaptchaToken(form: HTMLFormElement) {
  return String(new FormData(form).get(CAPTCHA_TOKEN_FIELD) || "").trim();
}

export function readCaptchaAnswer(form: HTMLFormElement) {
  return String(new FormData(form).get(CAPTCHA_ANSWER_FIELD) || "").trim();
}

export function missingCaptchaMessage() {
  return "Please answer the number question before sending.";
}

export function MathCaptchaField({
  action,
  theme = "light",
  resetSignal = 0,
}: {
  action: string;
  theme?: "light" | "dark";
  resetSignal?: number;
}) {
  const inputId = useId();
  const helpId = useId();
  const [question, setQuestion] = useState("");
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setQuestion("");
    setToken("");

    fetch(`/api/math-captcha?action=${encodeURIComponent(action)}`, { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json().catch(() => null)) as
          | { question?: string; token?: string }
          | null;
        if (cancelled) return;
        if (!response.ok || !payload?.question || !payload.token) {
          setStatus("error");
          return;
        }
        setQuestion(payload.question);
        setToken(payload.token);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [action, resetSignal]);

  const isDark = theme === "dark";
  const frameClass = isDark
    ? "rounded-2xl border border-white/15 bg-white/8 p-3"
    : "rounded-2xl border border-forest/15 bg-mist p-3";
  const labelClass = isDark ? "text-sm text-white/80" : "text-sm text-primary";
  const helpClass = isDark ? "text-xs text-white/60" : "text-xs text-muted";
  const inputClass = isDark
    ? "mt-2 w-full max-w-[9rem] rounded-xl border border-white/15 bg-white/8 px-3 py-2 text-white"
    : "mt-2 w-full max-w-[9rem] rounded-xl border border-forest/15 bg-white px-3 py-2";

  return (
    <div className={frameClass}>
      <label htmlFor={inputId} className={`grid gap-1 ${labelClass}`}>
        {status === "ready" ? question : "Number question"}
        <span className="sr-only">Enter the sum as a number.</span>
        <input
          id={inputId}
          required
          name={CAPTCHA_ANSWER_FIELD}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          aria-describedby={helpId}
          className={inputClass}
        />
      </label>
      <input type="hidden" name={CAPTCHA_TOKEN_FIELD} value={token} readOnly />
      <p id={helpId} className={`mt-2 ${helpClass}`}>
        {status === "loading"
          ? "Loading a short number question…"
          : status === "error"
            ? "The number question could not load. Please refresh the page and try again."
            : "A quick numbers check to keep spam out of Anna’s inbox."}
      </p>
    </div>
  );
}
