# Neuraxine AI — Deployment Guide

## Prerequisites

- Node.js 20+
- npm 10+
- Vercel account (recommended)

## Local Development

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Default credentials (change after first login): `admin@neuraxine.ai` / value of `ADMIN_PASSWORD`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | SQLite path locally; hosted DB URL in production |
| `JWT_SECRET` | Yes | Secret for admin auth tokens |
| `NEXT_PUBLIC_SITE_URL` | Yes | Public site URL for SEO/OG |
| `ADMIN_EMAIL` | Seed only | Admin account email |
| `ADMIN_PASSWORD` | Seed only | Admin account password |
| `SMTP_*` | Optional | Lead email notifications |
| `WHATSAPP_WEBHOOK_URL` | Optional | WhatsApp lead alerts |
| `CRM_WEBHOOK_URL` | Optional | CRM sync webhook |

## Database

**Local:** SQLite via `file:./prisma/dev.db`

**Production:** Use a hosted database. For Vercel, options include:

- [Turso](https://turso.tech) (SQLite-compatible)
- [Neon](https://neon.tech) (Postgres — update `schema.prisma` provider)

```bash
npm run db:push    # Apply schema
npm run db:seed    # Create admin user
```

## Vercel Deployment

1. Push repo to GitHub
2. Import project in Vercel
3. Set root directory to `neuraxine` if monorepo
4. Add environment variables from `.env.example`
5. Deploy

Build command: `npm run build`  
Output: Next.js default

### Post-deploy

1. Run database migration/seed against production DB
2. Change default admin password
3. Add `/public/og-image.png` and `/public/logo.png` for social previews
4. Configure SMTP and webhooks for lead routing

## Performance

- 3D scene lazy-loads via `dynamic()` with `ssr: false`
- Canvas uses `dpr={[1, 1.5]}` for GPU efficiency
- Post-processing bloom is tuned for balance of quality and FPS
- Lenis smooth scroll + GSAP ScrollTrigger for cinematic sections

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API routes
├── components/
│   ├── 3d/           # React Three Fiber scene
│   ├── demos/        # Interactive demo lab
│   ├── sections/     # Scroll storytelling sections
│   └── ui/           # Glass panels, loader, buttons
├── hooks/            # Scroll, mouse, magnetic effects
└── lib/              # Auth, Prisma, email, integrations
prisma/
├── schema.prisma     # Lead + Admin models
└── seed.ts           # Admin seed script
```

## API Routes

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/leads` | POST | Public | Submit lead form |
| `/api/leads` | GET | Bearer JWT | List leads (admin) |
| `/api/leads/export` | GET | Bearer JWT | Export CSV |
| `/api/auth/login` | POST | Public | Admin login |
