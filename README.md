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

## Quick Start

```bash
npm install
npm run dev
```
