# Greenzo.in — Deployment Guide

> The complete, command-by-command walkthrough (VS Code → GitHub → live server, plus Render/Railway and Netlify/Vercel) lives in the main **[README → Complete Deployment Guide](../README.md#complete-deployment-guide--vs-code--github-every-single-command)**. This page is the short reference.

## 1. Local & Preview Development

```bash
npm install
npm run seed
npm run dev
```

- **Frontend Storefront**: `http://0.0.0.0:5173` (proxies `/api` to `http://127.0.0.1:4000`)
- **Backend REST API**: `http://0.0.0.0:4000`

Run the servers separately when you want clean logs:

```bash
npm run dev:backend    # terminal 1 — API on :4000 with --watch
npm run dev:frontend   # terminal 2 — Vite on :5173
```

## 2. Production Single-Server Build

Build the optimized Vite bundle into `frontend/dist` and serve both static assets (with long-lived video/image caching) and `/api` from Express:

```bash
npm run build
PORT=4000 npm run start
```

Health check once it is up:

```bash
curl -s http://127.0.0.1:4000/api/health
API_URL=http://127.0.0.1:4000 npm run verify
```

## 3. Push to GitHub

```bash
git status
git add .
git commit -m "feat: your change"
git push origin main
```

## 4. Environment Variables

Copy [`.env.example`](../.env.example) to `.env` and set the values. The backend has **no dotenv loader**, so pass the file explicitly or export the variables:

```bash
cd backend
node --no-warnings --env-file=../.env src/index.js
```

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `4000` | API + built storefront |
| `HOST` | `0.0.0.0` | Bind address |
| `DB_PATH` | `backend/data/greenzo.sqlite` | Must point at a persistent disk in production |
| `UPLOADS_DIR` | `backend/uploads` | Admin photo uploads — persistent disk |
| `JWT_SECRET` | dev fallback | **Change in production**, or users are logged out on redeploy |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | *(empty)* | Optional; Admin Studio values take precedence |

## 5. Deployment Targets

| Target | Effort | Notes |
| --- | --- | --- |
| **VPS + Nginx + PM2** (recommended) | Medium | Same-origin `/api`, no CORS/config rewrites. See README §7 |
| **Render / Railway** | Low | Auto-deploy on push; **must** mount a disk at `/var/data` for SQLite + uploads. See README §8 |
| **Netlify / Vercel frontend + VPS API** | Medium | Requires `/api` and `/uploads` rewrites to the API domain. See README §9 |

## 6. Go-Live Checklist

- [ ] `npm run build` succeeds and `npm run verify` passes locally
- [ ] `JWT_SECRET` is a long random string, set on the host (not in Git)
- [ ] Razorpay live keys saved in Admin Studio → Store Settings (or env)
- [ ] Seeded admin password rotated (`README §7.4`)
- [ ] `DB_PATH` + `UPLOADS_DIR` on a persistent disk, with a nightly backup
- [ ] HTTPS certificate issued and auto-renewal verified
- [ ] Domain `A` records point at the server / host custom domain verified
- [ ] `npm run verify` run against the live domain (`API_URL=https://greenzo.in`)

## 7. Resetting Seed Data

```bash
node --no-warnings scripts/seed.mjs --reset
```

⚠️ `--reset` deletes products, orders, coupons, users and settings, then re-seeds demo data. Never run it on a live database with real orders.
