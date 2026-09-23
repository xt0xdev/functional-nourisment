# Functional Nourishment

Modern, mobile-first website for **Anna Almiroudis, MS, CNS, LN, CDN, CINHC** — a functional nutrition and integrative wellness practice based in Astoria, serving the New York City metro area.

The public site is [FunctionalNourishment.com](https://functionalnourishment.com/) (no hyphen). Local SEO covers nutritionists in NYC, Queens, Astoria, Manhattan, Brooklyn, and the wider metro area. An admin backend lets Anna (or her team) edit copy, services, workshops, events, journal posts, a media library, and incoming inquiries.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma + Postgres (Neon on Vercel) content database
- Cookie-based admin auth

## Local development

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

Default admin login (change immediately in production):

- Email: `admin@functional-nourishment.com`
- Password: `NourishAdmin2026!`

Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` in `.env` before deploying.

For live form emails and production photo uploads, also set `RESEND_API_KEY` and `BLOB_READ_WRITE_TOKEN` in Vercel. See **[VERCEL.md](./VERCEL.md)**. Never commit `.env` secrets.

## Admin capabilities

- Site settings (name, email, insurance copy, Berry Street URL, address)
- Page copy, SEO, and hero images from the media library
- Media library (upload, alt/caption, delete) — files are not stored in Postgres
- Services, wellness experiences, events with cover + gallery photos
- Journal posts with featured images
- Contact / discovery-call inquiries

## Images and the free Neon database

Do **not** store photo binaries in Postgres. Neon’s free tier is about **0.5 GB** of storage plus limited compute. Event photos as BYTEA/base64 would exhaust that quickly.

This app stores **only URLs, alt text, and captions** in Neon. Files go to:

- **Local/dev:** `public/uploads/`
- **Production (Vercel):** [Vercel Blob](https://vercel.com/docs/storage/vercel-blob). `BLOB_READ_WRITE_TOKEN` is required; the serverless disk is read-only.

CMS text rows are tiny compared with photos, so Neon stays well within free limits if images stay out of the database. On Vercel, the serverless filesystem is ephemeral — Blob (or similar object storage) is required for photos to survive deploys.

## SEO

- Unique metadata and canonical URLs on every page
- Local landing pages under `/locations/*`
- JSON-LD for the practice, FAQs, and articles
- `sitemap.xml` and `robots.txt`
- Semantic, mobile-first markup

## Notes

## Deploy on Vercel

See **[VERCEL.md](./VERCEL.md)** for the full checklist. Summary:

1. Deploy from `mikes-branch` (must include the Next.js app, not the empty initial commit).
2. Add **Neon** (free serverless Postgres) and connect it to the project.
3. Confirm `DATABASE_URL` and `DATABASE_URL_UNPOOLED` are set, plus `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `NEXT_PUBLIC_SITE_URL`.
4. Add a **Vercel Blob** store and set `BLOB_READ_WRITE_TOKEN` so uploaded event photos persist. Without it, production uploads return a clear error instead of writing `/var/task/public`.
5. Add `RESEND_API_KEY` so contact, discovery, mailing-list, and registration forms email Anna at Microsoft 365. Optional: `FORMS_FROM_EMAIL` after the sending domain is verified.
6. Redeploy. Production schema is applied on build; seed once if the site is empty.
