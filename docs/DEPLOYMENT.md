# Greenzo.in — Deployment Guide

## 1. Local & Preview Development

```bash
npm install
npm run dev
```

- **Frontend Storefront**: `http://0.0.0.0:5173` (proxies `/api` to `http://127.0.0.1:4000`)
- **Backend REST API**: `http://0.0.0.0:4000`

## 2. Production Single-Server Build

Build the optimized Vite bundle into `frontend/dist` and serve both static assets (with long-lived video/image caching) and `/api` from Express:

```bash
npm run build
PORT=4000 npm run start
```

## 3. Resetting Seed Data

```bash
node --no-warnings scripts/seed.mjs --reset
```
