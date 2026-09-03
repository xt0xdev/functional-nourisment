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
- `NEXT_PUBLIC_SITE_URL` — `https://functional-nourishment.vercel.app` (or your custom domain)
- `BLOB_READ_WRITE_TOKEN` — from a Vercel Blob store (required for persistent event/page photos)

Redeploy after env vars are saved. Build runs `prisma db push` via `vercel-build`.

## Images vs Neon free limits

The CMS stores **image URLs only** in Postgres (plus alt/caption). Files go to Vercel Blob or `public/uploads`.

Typical Neon free-tier limits (as of 2026): about **0.5 GB storage**, a modest compute/time allowance, and project caps. A few hundred pages/events/posts are kilobytes. A single event photo stored as BYTEA or base64 can be several megabytes — a handful of those would blow the storage quota.

Without `BLOB_READ_WRITE_TOKEN`, uploads write to the serverless disk and disappear on the next deploy. Add Blob before posting real event photos in production.

Default admin after seed:

- Email: `admin@functional-nourishment.com`
- Password: `NourishAdmin2026!`

If the build compiles Next.js then fails with **No Output Directory named "public"**, the Vercel project is not using the Next.js preset. In **Project Settings → General**:

- Framework Preset: **Next.js**
- Output Directory: **leave empty** (do not set `public`)
- Build Command: leave default, or `npm run vercel-build`

`vercel.json` in the repo now sets `framework` to `nextjs`.

