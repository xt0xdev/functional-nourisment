import {
  createMathChallenge,
  extractCaptchaFields,
  formCaptchaAdminNote,
  formCaptchaConfigured,
  MATH_CAPTCHA_TTL_MS,
  verifyMathChallenge,
  withoutCaptchaFields,
} from "./math-captcha";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

const env = { SESSION_SECRET: "test-session-secret" };
const now = 1_700_000_000_000;

const issued = createMathChallenge({
  action: "inquiry",
  env,
  now,
  operands: { left: 4, right: 7 },
  nonce: "abc123nonce",
});

assert(issued.question === "What is 4 + 7?", "question is a plain-text math prompt");
assert(!issued.token.startsWith("11."), "signed token does not put the answer in a public field");

assert(
  verifyMathChallenge({ token: issued.token, answer: "11", action: "inquiry", env, now }).ok === true,
  "correct answer is accepted",
);
assert(
  verifyMathChallenge({ token: issued.token, answer: 11, action: "inquiry", env, now }).ok === true,
  "numeric answer is accepted",
);
assert(
  verifyMathChallenge({ token: issued.token, answer: "011", action: "inquiry", env, now }).ok === true,
  "leading zeros still match the sum",
);

assert(
  verifyMathChallenge({ token: issued.token, answer: "10", action: "inquiry", env, now }).ok === false,
  "wrong answer is rejected",
);
assert(
  verifyMathChallenge({ token: issued.token, answer: "", action: "inquiry", env, now }).ok === false,
  "missing answer is rejected",
);
assert(
  verifyMathChallenge({ token: "", answer: "11", action: "inquiry", env, now }).ok === false,
  "missing token is rejected",
);
assert(
  verifyMathChallenge({ token: issued.token, answer: "11", action: "subscribe", env, now }).ok === false,
  "token from another form action is rejected",
);
assert(
  verifyMathChallenge({
    token: issued.token,
    answer: "11",
    action: "inquiry",
    env: { SESSION_SECRET: "other-secret" },
    now,
  }).ok === false,
  "token signed with a different secret is rejected",
);

const expired = verifyMathChallenge({
  token: issued.token,
  answer: "11",
  action: "inquiry",
  env,
  now: now + MATH_CAPTCHA_TTL_MS + 1,
});
assert(expired.ok === false, "expired token is rejected");
if (!expired.ok) {
  assert(expired.error.toLowerCase().includes("expired"), "expired error mentions expiry");
}

const tampered = issued.token.replace(/[0-9a-f]{4}$/i, "ffff");
assert(
  verifyMathChallenge({ token: tampered, answer: "11", action: "inquiry", env, now }).ok === false,
  "tampered HMAC is rejected",
);

const extracted = extractCaptchaFields({
  name: "Ada",
  captchaToken: "tok",
  captchaAnswer: "11",
});
assert(extracted.token === "tok" && extracted.answer === "11", "extracts captcha fields");

const stripped = withoutCaptchaFields({
  name: "Ada",
  captchaToken: "tok",
  captchaAnswer: "11",
  turnstileToken: "legacy",
  "cf-turnstile-response": "legacy",
});
assert(stripped.name === "Ada", "strip keeps other fields");
assert(!("captchaToken" in stripped), "strip removes captchaToken");
assert(!("captchaAnswer" in stripped), "strip removes captchaAnswer");
assert(!("turnstileToken" in stripped), "strip removes leftover Turnstile token");

assert(formCaptchaConfigured({}) === true, "captcha is configured without Turnstile keys");
assert(formCaptchaConfigured({ SESSION_SECRET: "secret" }) === true, "captcha is configured with SESSION_SECRET");

const prodNote = formCaptchaAdminNote({ SESSION_SECRET: "secret" });
assert(!/fail closed|are blocked|POSTs are blocked/i.test(prodNote), "admin note never says production forms are blocked");
assert(prodNote.includes("math question") || prodNote.includes("4 + 7"), "admin note describes the math question");
assert(/no cloudflare turnstile keys are needed/i.test(prodNote), "admin note says Turnstile keys are not needed");

const missingSecretNote = formCaptchaAdminNote({});
assert(!missingSecretNote.toLowerCase().includes("blocked"), "missing SESSION_SECRET does not block forms");
assert(missingSecretNote.includes("still accept") || missingSecretNote.includes("not required"), "missing secret still allows submissions");

console.log("math-captcha.check.ts passed");
