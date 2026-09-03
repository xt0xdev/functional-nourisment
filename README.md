# Functional Nourishment

Modern, mobile-first website for **Anna Almiroudis, MS, CNS, LN, CDN, CHHC** — a functional nutrition and integrative wellness practice based in Astoria, serving the New York City metro area.

The public site is rebuilt from the content on [functional-nourishment.com](https://functional-nourishment.com/), with local SEO for nutritionists in NYC, Queens, Astoria, Manhattan, Brooklyn, and the wider metro area. An admin backend lets Anna (or her team) edit copy, services, workshops, events, journal posts, and incoming inquiries.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite content database
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

## Admin capabilities

- Site settings (name, email, insurance copy, Berry Street URL, address)
- Page copy and SEO titles/descriptions
- Services, wellness experiences, events
- Journal posts
- Contact / discovery-call inquiries

## SEO

- Unique metadata and canonical URLs on every page
- Local landing pages under `/locations/*`
- JSON-LD for the practice, FAQs, and articles
- `sitemap.xml` and `robots.txt`
- Semantic, mobile-first markup

## Notes

SQLite is file-based (`prisma/dev.db`). For production on a platform without a persistent disk, point `DATABASE_URL` at a hosted Postgres instance or keep the SQLite file on persistent storage.
