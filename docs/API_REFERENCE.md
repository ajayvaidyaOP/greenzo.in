# Greenzo.in — REST API Reference

Base path: `/api` (proxied automatically by Vite in development and served directly by Express in production).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health, SQLite WAL status, and active plant count |
| `GET` | `/api/catalog` | Full storefront bootstrap (`heroReels`, `categories`, `products`, `featuredDeal`, `blogs`, `reviews`) |
| `GET` | `/api/products` | Filterable catalog (`?category=`, `?search=`, `?light=`, `?petFriendly=`, `?sort=`) |
| `GET` | `/api/products/:slug` | Detailed plant specs, care schedule, and related plants |
| `POST` | `/api/coupons/validate` | Validates promo codes (`GREENZO10`, `PUNE50`, `FIRSTPLANT`) |
| `POST` | `/api/orders` | Transactional order creation + stock decrement (`GRZ-2610-XXXX`) |
| `GET` | `/api/orders/track/:query` | Live order tracking by Order ID or phone number |
| `POST` | `/api/consultations` | Schedules a complimentary 1-on-1 botanist call (`CONS-XXXX`) |
| `POST` | `/api/newsletter` | Registers email subscriber and returns welcome code `GREENZO10` |
| `POST` | `/api/reviews` | Publishes a verified customer review |
| `GET` | `/api/admin/overview` | Live Store Ledger metrics, recent orders & scheduled consultations |
