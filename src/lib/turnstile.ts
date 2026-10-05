import { NextResponse } from "next/server";

export const TURNSTILE_SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const TURNSTILE_TOKEN_FIELD = "turnstileToken";
export const TURNSTILE_CF_FIELD = "cf-turnstile-response";

const VISITOR_ERROR = "Please complete the security check and try again.";
const MISSING_KEYS_ERROR =
  "Form security check is not configured. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY in Vercel.";

export type TurnstileEnv = {
  NODE_ENV?: string;
  VERCEL_ENV?: string;
  TURNSTILE_SECRET_KEY?: string;
  NEXT_PUBLIC_TURNSTILE_SITE_KEY?: string;
};

export type TurnstileVerifyResult =
  | { ok: true; skipped?: boolean }
  | { ok: false; error: string };

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function envValue(env: TurnstileEnv, key: keyof TurnstileEnv) {
  return env[key]?.trim() || "";
}

export function turnstileSiteKey(env: TurnstileEnv = process.env) {
  return envValue(env, "NEXT_PUBLIC_TURNSTILE_SITE_KEY");
}

export function turnstileSecretKey(env: TurnstileEnv = process.env) {
  return envValue(env, "TURNSTILE_SECRET_KEY");
}

export function turnstileConfigured(env: TurnstileEnv = process.env) {
  return Boolean(turnstileSiteKey(env) && turnstileSecretKey(env));
}

/** Local/dev may skip only when NODE_ENV=development and the secret is unset. */
export function shouldSkipTurnstile(env: TurnstileEnv = process.env) {
  return env.NODE_ENV === "development" && !turnstileSecretKey(env);
}

export function formCaptchaConfigured(env: TurnstileEnv = process.env) {
  return turnstileConfigured(env);
}

export function formCaptchaAdminNote(env: TurnstileEnv = process.env) {
  if (turnstileConfigured(env)) {
    return "Public forms are protected with Cloudflare Turnstile. Tokens are checked on the server before a submission is saved or emailed.";
  }
  if (shouldSkipTurnstile(env)) {
    return "Cloudflare Turnstile keys are unset. Local development can submit forms without CAPTCHA. Production on Vercel fails closed until NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY are set.";
  }
  return "Public form POSTs are blocked until Cloudflare Turnstile is configured. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY (public) and TURNSTILE_SECRET_KEY (server only) in Vercel Production + Preview, then redeploy. Spam cannot bypass a missing key.";
}

export function extractTurnstileToken(body: unknown) {
  if (!body || typeof body !== "object") return "";
  const record = body as Record<string, unknown>;
  const raw = record[TURNSTILE_TOKEN_FIELD] ?? record[TURNSTILE_CF_FIELD] ?? "";
  return typeof raw === "string" ? raw.trim() : "";
}

export function withoutTurnstileFields<T>(body: T): T {
  if (!body || typeof body !== "object") return body;
  const copy = { ...(body as Record<string, unknown>) };
  delete copy[TURNSTILE_TOKEN_FIELD];
  delete copy[TURNSTILE_CF_FIELD];
  return copy as T;
}

function visitorIp(request?: Request) {
  if (!request) return "";
  const forwarded = request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0];
  return forwarded?.trim() || "";
}

export async function verifyTurnstileToken(options: {
  token: unknown;
  request?: Request;
  action?: string;
  env?: TurnstileEnv;
  fetchImpl?: typeof fetch;
}): Promise<TurnstileVerifyResult> {
  const env = options.env ?? process.env;
  if (shouldSkipTurnstile(env)) {
    return { ok: true, skipped: true };
  }

  const secret = turnstileSecretKey(env);
  if (!secret) {
    return { ok: false, error: MISSING_KEYS_ERROR };
  }

  const token = typeof options.token === "string" ? options.token.trim() : "";
  if (!token) {
    return { ok: false, error: VISITOR_ERROR };
  }

  const params = new URLSearchParams({
    secret,
    response: token,
  });
  const ip = visitorIp(options.request);
  if (ip) params.set("remoteip", ip);

  try {
    const fetchImpl = options.fetchImpl ?? fetch;
    const response = await fetchImpl(TURNSTILE_SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const outcome = (await response.json()) as SiteverifyResponse;
    if (!response.ok || outcome.success !== true) {
      return { ok: false, error: VISITOR_ERROR };
    }
    if (options.action && outcome.action && outcome.action !== options.action) {
      return { ok: false, error: VISITOR_ERROR };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: VISITOR_ERROR };
  }
}

export async function rejectInvalidTurnstile(
  request: Request,
  body: unknown,
  action?: string,
): Promise<NextResponse | null> {
  const result = await verifyTurnstileToken({
    token: extractTurnstileToken(body),
    request,
    action,
  });
  if (result.ok) return null;
  return NextResponse.json({ error: result.error }, { status: 400 });
}
