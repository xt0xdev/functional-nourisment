# Vercel + Neon

## Why you saw a 404

The first deploy used commit `7503ea0` ("Initial commit") on `mikes-branch`, which only had an empty README. The Next.js app is now on `mikes-branch`.

## Database

Use **Neon** from Vercel Storage (free plan is enough). Vercel injects:

- `DATABASE_URL` — pooled (runtime queries)
- `DATABASE_URL_UNPOOLED` — direct (Prisma schema push / migrations)

Also set in Vercel → Settings → Environment Variables (Production + Preview):

- `SESSION_SECRET` — long random string
- `ADMIN_EMAIL` — admin login email
- `ADMIN_PASSWORD` — strong password
- `NEXT_PUBLIC_SITE_URL` — `https://functionalnourishment.com`
- `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store (required for persistent event/page photos)
- `RESEND_API_KEY` — required for live form emails to Anna at Microsoft 365
- `FORMS_FROM_EMAIL` — optional override. Default is `Functional Nourishment <forms@functionalnourishment.com>` after the domain is verified in Resend
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (public widget). Required on Production + Preview or public forms reject with 400
- `TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret (server only). Required on Production + Preview. Never expose this to the browser

Never commit secrets. Redeploy after env vars are saved. Build runs `prisma db push` via `vercel-build`.

## Custom domain (FunctionalNourishment.com)

The public site URL is **functionalnourishment.com** (no hyphen). Code and CMS defaults use that host. This repo cannot attach a custom domain from git — Mike must do it in the Vercel dashboard:

1. In **Vercel → Project → Settings → Domains**, add `functionalnourishment.com` and `www.functionalnourishment.com`.
2. Point DNS (A/CNAME records, or nameservers) at Vercel using the values Vercel shows for those domains.
3. Set Production `NEXT_PUBLIC_SITE_URL` to `https://functionalnourishment.com` so sitemap, canonicals, Open Graph, robots, and schema.org `url` match the live host.
4. Optionally 301 redirect `functional-nourishment.com` → `functionalnourishment.com` if you still own the hyphenated domain.

Keep `anna@functionalnourishment.com` as-is. Do not rename the GitHub repo (`functional-nourisment`) or the Vercel project slug.

## Form emails (Microsoft 365)

Public forms (contact, discovery/book, mailing list, event registration, retreat registration) still save in Postgres. Each submit also emails **anna@FunctionalNourishment.com** (Site Settings → Form notification email; `anna@functionalnourishment.com` is accepted as the same address).

Do **not** SMTP directly to Microsoft 365 without auth — it will fail. Use **Resend** on Vercel:

1. Create a Resend account and API key.
2. Set `RESEND_API_KEY` in Vercel (Production + Preview).
3. Verify `functionalnourishment.com` in Resend (SPF/DKIM/DMARC). The site then sends from `forms@functionalnourishment.com`.
4. Optional: set `FORMS_FROM_EMAIL` if you want a different verified From address. Reply-To is the visitor so Anna can reply from Outlook.

Microsoft 365 can still put the first messages from a new sending domain in **Junk** even when SPF, DKIM, and DMARC all pass (SCL 5). Extra SPF records will not fix that. In Outlook: open the message → **Not junk** / never junk from Functional Nourishment, and allow `forms@functionalnourishment.com` (or `@functionalnourishment.com`) in junk settings. Avoid sending short “test email” probes — they score worse than a real form notification.

If `RESEND_API_KEY` is missing, the form still saves and does **not** 500. The admin shows a note that live email is off.

## Form CAPTCHA (Cloudflare Turnstile)

Spam bots were submitting the public forms. Every public POST that writes to the database or emails Anna now requires a **server-verified** Cloudflare Turnstile token:

- Contact / discovery inquiry — `/api/inquiries`
- Mailing list subscribe — `/api/subscribe`
- Event (workshop) registration — `/api/event-registrations`
- Retreat registration — `/api/event-registrations`

The widget sits above each submit button. The API routes call Cloudflare `siteverify` and return **400** if the token is missing or invalid. A client-only checkbox is not enough and is not used.

**Mike must set both keys in Vercel (Production + Preview) and redeploy, or live forms will refuse submissions.** Production / Preview fail closed on purpose so spam cannot bypass a missing key.

1. In [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile), add a widget for `functionalnourishment.com` (and `www`, plus `*.vercel.app` if you want Preview to work).
2. Copy the **site key** to `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
3. Copy the **secret key** to `TURNSTILE_SECRET_KEY`.
4. Redeploy so the public site key is baked into the client bundle.

Local/dev can skip the widget **only** when `NODE_ENV=development` **and** the keys are unset. If you set the secret locally, verification runs. Do not commit secrets.

SMTP (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`) is a fallback only. Prefer Resend.

## Media uploads (read-only Vercel disk)

Vercel serverless functions cannot write `public/uploads` (`EROFS: read-only file system, open '/var/task/public/...'`). Uploads **must** use Vercel Blob when `VERCEL` is set or `BLOB_READ_WRITE_TOKEN` is present.

- Add a Blob store and `BLOB_READ_WRITE_TOKEN`.
- If the token is missing on Vercel, upload APIs return 503: `Add BLOB_READ_WRITE_TOKEN in Vercel (Blob store) — local disk cannot be used on production.`
- Local `public/uploads` is only for `NODE_ENV=development` / non-Vercel.

## Images vs Neon free limits

The CMS stores **image URLs only** in Postgres (plus alt/caption). Files go to Vercel Blob or `public/uploads`.

Typical Neon free-tier limits (as of 2026): about **0.5 GB storage**, a modest compute/time allowance, and project caps. A few hundred pages/events/posts are kilobytes. A single event photo stored as BYTEA or base64 can be several megabytes — a handful of those would blow the storage quota.

Without `BLOB_READ_WRITE_TOKEN` on Vercel, the media library will not attempt a local disk write. Add Blob before posting real event photos in production.

Default admin after seed:

- Email: `admin@functional-nourishment.com`
- Password: `NourishAdmin2026!`

If the build compiles Next.js then fails with **No Output Directory named "public"**, the Vercel project is not using the Next.js preset. In **Project Settings → General**:

- Framework Preset: **Next.js**
- Output Directory: **leave empty** (do not set `public`)
- Build Command: leave default, or `npm run vercel-build`

`vercel.json` in the repo now sets `framework` to `nextjs`.

