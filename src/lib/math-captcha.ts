import { createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";

export const CAPTCHA_TOKEN_FIELD = "captchaToken";
export const CAPTCHA_ANSWER_FIELD = "captchaAnswer";
export const MATH_CAPTCHA_TTL_MS = 15 * 60 * 1000;
export const MATH_CAPTCHA_ACTIONS = ["inquiry", "subscribe", "event-registration"] as const;

export type MathCaptchaAction = (typeof MATH_CAPTCHA_ACTIONS)[number];

export type MathCaptchaEnv = {
  SESSION_SECRET?: string;
};

export type MathChallenge = {
  question: string;
  token: string;
};

export type MathCaptchaVerifyResult = { ok: true } | { ok: false; error: string };

const VISITOR_ERROR = "Please answer the number question and try again.";
const EXPIRED_ERROR = "That number question expired. Please solve the new one and try again.";
const FALLBACK_SECRET = "dev-only-session-secret";

export function isMathCaptchaAction(value: string): value is MathCaptchaAction {
  return (MATH_CAPTCHA_ACTIONS as readonly string[]).includes(value);
}

function envRecord(env?: MathCaptchaEnv) {
  return env ?? (process.env as MathCaptchaEnv);
}

function signingSecret(env?: MathCaptchaEnv) {
  return envRecord(env).SESSION_SECRET?.trim() || FALLBACK_SECRET;
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function signingPayload(answer: number, exp: number, nonce: string, action: string) {
  return `${answer}|${exp}|${nonce}|${action}`;
}

/** Always on — no Cloudflare / third-party keys. Forms never fail-close for missing Turnstile. */
export function formCaptchaConfigured(_env?: MathCaptchaEnv) {
  return true;
}

export function formCaptchaAdminNote(env?: MathCaptchaEnv) {
  if (envRecord(env).SESSION_SECRET?.trim()) {
    return "Public forms ask a short math question (for example, What is 4 + 7?). The answer is checked on the server with a signed, time-limited token. No Cloudflare Turnstile keys are needed, and visitors can still submit if those keys are missing.";
  }
  return "Public forms ask a short math question and still accept submissions. Set SESSION_SECRET (the same value used for admin login) so the number challenge is signed with your production secret. Cloudflare Turnstile keys are not used and are not required.";
}

export function createMathChallenge(options: {
  action: string;
  env?: MathCaptchaEnv;
  now?: number;
  operands?: { left: number; right: number };
  nonce?: string;
}): MathChallenge {
  const left = options.operands?.left ?? randomInt(1, 10);
  const right = options.operands?.right ?? randomInt(1, 10);
  const exp = (options.now ?? Date.now()) + MATH_CAPTCHA_TTL_MS;
  const nonce = options.nonce ?? randomBytes(16).toString("hex");
  const secret = signingSecret(options.env);
  const token = `${exp}.${nonce}.${sign(signingPayload(left + right, exp, nonce, options.action), secret)}`;
  return {
    question: `What is ${left} + ${right}?`,
    token,
  };
}

export function normalizeMathAnswer(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/^\+/, "");
  if (!/^\d+$/.test(trimmed)) return "";
  return String(Number(trimmed));
}

export function verifyMathChallenge(options: {
  token: unknown;
  answer: unknown;
  action: string;
  env?: MathCaptchaEnv;
  now?: number;
}): MathCaptchaVerifyResult {
  const token = typeof options.token === "string" ? options.token.trim() : "";
  const answer = normalizeMathAnswer(options.answer);
  if (!token || !answer) {
    return { ok: false, error: VISITOR_ERROR };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { ok: false, error: VISITOR_ERROR };
  }
  const [expRaw, nonce, hmac] = parts;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || !nonce || !/^[a-f0-9]+$/i.test(hmac)) {
    return { ok: false, error: VISITOR_ERROR };
  }
  if (exp < (options.now ?? Date.now())) {
    return { ok: false, error: EXPIRED_ERROR };
  }

  const expected = sign(signingPayload(Number(answer), exp, nonce, options.action), signingSecret(options.env));
  if (!safeEqual(hmac.toLowerCase(), expected)) {
    return { ok: false, error: VISITOR_ERROR };
  }
  return { ok: true };
}

export function extractCaptchaFields(body: unknown) {
  if (!body || typeof body !== "object") {
    return { token: "", answer: "" };
  }
  const record = body as Record<string, unknown>;
  return {
    token: typeof record[CAPTCHA_TOKEN_FIELD] === "string" ? record[CAPTCHA_TOKEN_FIELD].trim() : "",
    answer:
      typeof record[CAPTCHA_ANSWER_FIELD] === "string" || typeof record[CAPTCHA_ANSWER_FIELD] === "number"
        ? record[CAPTCHA_ANSWER_FIELD]
        : "",
  };
}

export function withoutCaptchaFields<T>(body: T): T {
  if (!body || typeof body !== "object") return body;
  const copy = { ...(body as Record<string, unknown>) };
  delete copy[CAPTCHA_TOKEN_FIELD];
  delete copy[CAPTCHA_ANSWER_FIELD];
  delete copy.turnstileToken;
  delete copy["cf-turnstile-response"];
  return copy as T;
}

export function rejectInvalidMathCaptcha(body: unknown, action: string): NextResponse | null {
  const { token, answer } = extractCaptchaFields(body);
  const result = verifyMathChallenge({ token, answer, action });
  if (result.ok) return null;
  return NextResponse.json({ error: result.error }, { status: 400 });
}
