# Greenzo.in — Luxury Self-Watering Plant Storefront, Razorpay Checkout & Admin Studio

Full-stack e-commerce platform for **Greenzo.in (Empire Agro Nursery, Pune)** featuring an editorial biophilic storefront, multi-reel HD hero video stage, customer/admin authentication, **Razorpay online payment gateway**, and a full **Admin Control Studio** to manage plant photos, pricing, promo offers, banners & orders live.

## Repository Structure

```text
├── backend/       # Node.js + Express REST API, Auth, Razorpay, Uploads & SQLite/Prisma DB
├── docs/          # Architecture, API Reference & Deployment documentation
├── frontend/      # React 18 + Vite 6 + Tailwind CSS Storefront, Login & Admin Panel
├── scripts/       # Dev orchestrator, DB seeder & full-stack health verifier
├── .gitignore
├── README.md
└── package.json
```

## Demo Credentials (1-Click Login Available on Sign-In Page)

- **Admin Control Panel**: `admin@greenzo.in` / `Admin@123`
- **Customer Account**: `rahul@greenzo.in` / `Customer@123`

## Key Features

- **Aesthetic Login, Sign-Up & Customer Sanctuary Account**: Split-screen botanical sign-in with 1-click demo buttons, saved delivery profile auto-fill, and live "My Plant Orders" history.
- **Razorpay Online Checkout + COD**: Supports both Live/Test Razorpay API keys (`rzp_test_...` / `rzp_live_...` configurable right inside Admin Settings) AND an instant built-in Razorpay Secure Checkout Sandbox (UPI / GPay / PhonePe / Cards / Netbanking / Wallets) with cryptographic signature verification.
- **Full Admin Control Studio**:
  - **Upload New Photos**: Drag & drop or pick photos directly from laptop/mobile for new plants and homepage Sanctuary Gallery (`/uploads/...`).
  - **Inline Price, MRP & Stock Editor**: Update ₹ selling prices, stock quantities, offer badges, and **Deal of the Week** spotlight in 1 click.
  - **Offers & Promo Codes Manager**: Create `%` or flat `₹` festival coupons (`DIWALI20`, `GREENZO10`) and pin them live to the homepage offer ticker & cart drawer.
  - **Store & Combo Configurator**: Customize the Top Announcement Bar, Combo Box price (`₹999` or custom), Free Shipping threshold, and Razorpay keys live.

## Design System — "Botanical Atelier"

A warm, editorial storefront language built on travertine paper, deep forest and antique brass.

- **Palette** — `linen` (warm paper backgrounds), `canopy` (deep forest ink & dark surfaces), `brass` (signature accent), `terracotta` (urgency/deals), warm `stone` neutrals. Defined in `frontend/tailwind.config.js`.
- **Typography** — *Fraunces* (variable serif) for display headlines, *Manrope* for UI text. Section headings share the `.display-section` / `.eyebrow` pattern with italic accent words.
- **Components** — reusable `.btn-*`, `.chip`, `.card-surface`, `.glass-panel`, `.tag`, `.hover-lift` and layout helpers (`.shell`, `.section-y`) live in `frontend/src/index.css`.
- **Motion** — `Reveal.jsx` provides scroll-triggered entrances (`up`, `left`, `right`, `scale`, `mask`) via `IntersectionObserver`; it animates the independent `translate`/`scale` properties so it never clashes with Tailwind hover transforms. All motion respects `prefers-reduced-motion`.
- **Navigation** — sticky glass header with scroll progress, rotating announcement ribbon, category mega-menu, ⌘K / Ctrl+K command-palette search, and an animated mobile drawer.
- **Micro-interactions** — product cards cross-fade to a second photo on hover, quick-add slides up, reel selector shows playback progress, cart includes a shipping-progress meter and a bag → delivery → confirm stepper.

## Quick Start

```bash
npm install
npm run dev
```
