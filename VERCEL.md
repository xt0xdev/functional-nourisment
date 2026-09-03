# Vercel deployment

## Why you saw a 404

Vercel was deploying commit `7503ea0` ("Initial commit") on `mikes-branch`, which only contained an empty README — not the Next.js app. The site code is now merged into `mikes-branch`.

## Deploy steps

1. **Redeploy** from the Vercel dashboard (or push triggers auto-deploy).
2. **Add a Postgres database** (required — SQLite does not work on Vercel):
   - Vercel project → **Storage** → **Create Database** → **Postgres**
   - Connect it to the project; Vercel adds `POSTGRES_URL` (and related vars).
3. **Set environment variables** in Vercel → Settings → Environment Variables:
   - `DATABASE_URL` = your Postgres connection string (often `POSTGRES_URL` or `POSTGRES_PRISMA_URL`)
   - `SESSION_SECRET` = long random string
   - `ADMIN_EMAIL` = admin login email
   - `ADMIN_PASSWORD` = strong password
   - `NEXT_PUBLIC_SITE_URL` = `https://your-domain.vercel.app` (or custom domain)
4. **Redeploy again** after env vars are set (build runs `prisma db push` via `vercel-build`).
5. **Seed content once** (from your machine with production `DATABASE_URL`):
   ```bash
   DATABASE_URL="your-postgres-url" npm run db:seed
   ```

## Build commands

- `vercel-build`: schema sync + Next.js build (used on Vercel)
- `build`: local/production build without DB migration
