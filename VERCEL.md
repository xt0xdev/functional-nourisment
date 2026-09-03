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

Redeploy after env vars are saved. Build runs `prisma db push` via `vercel-build`.

Default admin after seed:

- Email: `admin@functional-nourishment.com`
- Password: `NourishAdmin2026!`

Change that password in production.
