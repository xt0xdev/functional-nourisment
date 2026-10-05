import {
  extractTurnstileToken,
  formCaptchaAdminNote,
  shouldSkipTurnstile,
  turnstileConfigured,
  verifyTurnstileToken,
  withoutTurnstileFields,
} from "./turnstile";

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

assert(
  shouldSkipTurnstile({ NODE_ENV: "development" }) === true,
  "dev without secret must skip",
);
assert(
  shouldSkipTurnstile({ NODE_ENV: "development", TURNSTILE_SECRET_KEY: "secret" }) === false,
  "dev with secret must verify",
);
assert(
  shouldSkipTurnstile({ NODE_ENV: "production" }) === false,
  "production without secret must not skip",
);
assert(
  shouldSkipTurnstile({ NODE_ENV: "production", VERCEL_ENV: "production" }) === false,
  "Vercel production must not skip",
);
assert(
  shouldSkipTurnstile({ NODE_ENV: "production", VERCEL_ENV: "preview" }) === false,
  "Vercel preview must not skip",
);

assert(
  turnstileConfigured({
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site",
    TURNSTILE_SECRET_KEY: "secret",
  }) === true,
  "both keys mean configured",
);
assert(
  turnstileConfigured({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site" }) === false,
  "site key alone is not configured",
);

assert(
  extractTurnstileToken({ turnstileToken: "abc" }) === "abc",
  "extract turnstileToken",
);
assert(
  extractTurnstileToken({ "cf-turnstile-response": "xyz" }) === "xyz",
  "extract cf-turnstile-response",
);
assert(extractTurnstileToken({ name: "Ada" }) === "", "missing token is empty");

const stripped = withoutTurnstileFields({
  name: "Ada",
  turnstileToken: "abc",
  "cf-turnstile-response": "xyz",
});
assert(stripped.name === "Ada", "strip keeps other fields");
assert(!("turnstileToken" in stripped), "strip removes turnstileToken");
assert(!("cf-turnstile-response" in stripped), "strip removes cf field");

async function runAsyncChecks() {
  const missingProd = await verifyTurnstileToken({
    token: "anything",
    env: { NODE_ENV: "production" },
  });
  assert(missingProd.ok === false, "production missing secret fails closed");
  if (!missingProd.ok) {
    assert(missingProd.error.includes("TURNSTILE_SECRET_KEY"), "missing-key error names the env var");
  }

  const skippedDev = await verifyTurnstileToken({
    token: "",
    env: { NODE_ENV: "development" },
  });
  assert(skippedDev.ok === true && skippedDev.skipped === true, "dev skip allows empty token");

  const missingToken = await verifyTurnstileToken({
    token: "",
    env: { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "secret" },
  });
  assert(missingToken.ok === false, "missing token is rejected when keys exist");

  const failedVerify = await verifyTurnstileToken({
    token: "bad-token",
    env: { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "secret" },
    action: "inquiry",
    fetchImpl: async () =>
      new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] }), {
        status: 200,
      }),
  });
  assert(failedVerify.ok === false, "Cloudflare failure is rejected");

  const passedVerify = await verifyTurnstileToken({
    token: "good-token",
    env: { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "secret" },
    action: "inquiry",
    fetchImpl: async () =>
      new Response(JSON.stringify({ success: true, action: "inquiry", hostname: "example.com" }), {
        status: 200,
      }),
  });
  assert(passedVerify.ok === true, "successful siteverify is accepted");

  const wrongAction = await verifyTurnstileToken({
    token: "good-token",
    env: { NODE_ENV: "production", TURNSTILE_SECRET_KEY: "secret" },
    action: "inquiry",
    fetchImpl: async () =>
      new Response(JSON.stringify({ success: true, action: "subscribe" }), { status: 200 }),
  });
  assert(wrongAction.ok === false, "mismatched action is rejected");

  const note = formCaptchaAdminNote({ NODE_ENV: "production" });
  assert(note.includes("blocked"), "admin note warns that production forms are blocked");
}

runAsyncChecks()
  .then(() => {
    console.log("turnstile.check.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
