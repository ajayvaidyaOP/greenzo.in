# Greenzo.in — Full-Stack Architecture

## Overview

Greenzo.in is structured as a clean full-stack monorepo tailored for luxury D2C plant commerce:

```text
greenzo.in/
├── backend/       # Express.js REST API + SQLite WAL engine + Prisma MySQL schema
├── docs/          # Architecture, API Reference & Deployment guides
├── frontend/      # React 18 + Vite 6 + Tailwind CSS biophilic storefront
├── scripts/       # Unified dev runner, database seeder & verification suite
├── .gitignore
├── README.md
└── package.json
```

## Zero-Lag Frontend Performance Design

1. **Viewport-Aware Hardware Video Stage (`HeroVideoStage.jsx` & `VideoNurseryStrip.jsx`)**:
   - Seamless-looping H.264 `yuv420p` (`+faststart`) `.mp4` botanical reels (~740–980 KB each) load with instant poster frames and zero external CDN buffering.
   - `IntersectionObserver` automatically pauses off-screen `<video>` decoding the moment the user scrolls down, keeping scrolling locked at 60fps with zero GPU contention.
2. **Single-Roundtrip Storefront Bootstrap (`GET /api/catalog`)**:
   - Categories, products, hero reels, featured deal, verified reviews, and journal articles arrive in a single compressed JSON payload (< 5ms local query time).
3. **Composite-Only Animations**:
   - Hover states, drawer transitions, and reel progress bars animate exclusively via GPU `transform` and `opacity` properties.

## Persistence Layer

- **Default Zero-Config Runtime**: Node 22 native `node:sqlite` in `WAL` journal mode (`backend/src/db/database.js`), automatically initialized and seeded on boot.
- **Cloud MySQL Compatibility**: `backend/prisma/schema.prisma` mirrors all tables (`categories`, `products`, `orders`, `order_items`, `consultations`, `newsletter_subscribers`) for managed MySQL deployments.
