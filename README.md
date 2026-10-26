# Greenzo.in — Luxury Self-Watering Plant Storefront, Razorpay Checkout & Admin Studio

Full-stack e-commerce platform for **Greenzo.in (Empire Agro Nursery, Pune)** featuring an editorial biophilic storefront, multi-reel HD hero video stage, customer/admin authentication, **Razorpay online payment gateway**, and a full **Admin Control Studio** to manage plant photos, pricing, promo offers, banners & orders live.

## Repository Structure

```text
├── backend/       # Node.js + Express REST API, Auth, Razorpay, Uploads & SQLite/Prisma DB
├── docs/          # Architecture, API Reference & Deployment documentation
├── frontend/      # React 18 + Vite 6 + Tailwind CSS Storefront, Login & Admin Panel
├── scripts/       # Dev orchestrator, DB seeder & full-stack health verifier
├── .env.example   # Every environment variable the backend understands
├── .gitignore
├── README.md
└── package.json
```

## Demo Credentials (1-Click Login Available on Sign-In Page)

- **Admin Control Panel**: `admin@greenzo.in` / `Admin@123`
- **Customer Account**: `rahul@greenzo.in` / `Customer@123`

> ⚠️ Before a public launch, rotate the admin password (steps in **[§7.4](#74-change-the-seeded-admin-password-before-going-live)**) and set a strong `JWT_SECRET`.

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
npm run seed
npm run dev
```

Storefront → `http://localhost:5173` · API → `http://localhost:4000/api/health`

---

## Complete Deployment Guide — VS Code + GitHub (Every Single Command)

This is the full walkthrough, start to finish: **open the project in VS Code → run locally → push to GitHub → deploy live → ship updates → roll back.**
Every command is copy-paste ready. Run all commands **from the repository root** (`greenzo.in/`) unless a step says otherwise.

**Contents**

1. [Install the tools (one time)](#1-install-the-tools-one-time)
2. [First-time setup in VS Code](#2-first-time-setup-in-vs-code)
3. [Connect VS Code to GitHub (one time)](#3-connect-vs-code-to-github-one-time)
4. [Daily Git & GitHub workflow (every command)](#4-daily-git--github-workflow-every-command)
5. [Pre-deploy check (run before every deploy)](#5-pre-deploy-check-run-before-every-deploy)
6. [Environment variables](#6-environment-variables)
7. [Option A — Deploy on your own VPS (recommended, Nginx + PM2 + HTTPS)](#7-option-a--deploy-on-your-own-vps-recommended-nginx--pm2--https)
8. [Option B — Deploy on Render / Railway (auto-deploy from GitHub, no server)](#8-option-b--deploy-on-render--railway-auto-deploy-from-github-no-server)
9. [Option C — Frontend on Netlify/Vercel + API on a VPS](#9-option-c--frontend-on-netlifyvercel--api-on-a-vps)
10. [Post-deployment verification](#10-post-deployment-verification)
11. [Rollback, logs & backups](#11-rollback-logs--backups)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Install the tools (one time)

| Tool | Required version | Why | Download |
| --- | --- | --- | --- |
| **Node.js** | **v22.5.0 or newer** (LTS 22.x) | The backend uses Node's built-in `node:sqlite`; older versions crash on boot | <https://nodejs.org> |
| **npm** | 10.x (ships with Node 22) | Install & run scripts | (bundled with Node) |
| **Git** | 2.40+ | Version control | <https://git-scm.com> |
| **VS Code** | latest | Editor + integrated terminal | <https://code.visualstudio.com> |
| **GitHub CLI** *(optional but handy)* | latest | Create/merge PRs from the terminal | <https://cli.github.com> |

Check everything from the **VS Code terminal** (`Ctrl` + `` ` ``):

```bash
node -v      # must print v22.5.0 or higher
npm -v
git --version
gh --version # optional; skip if you did not install GitHub CLI
```

**Recommended VS Code extensions** (`Ctrl` + `Shift` + `X`, then search):

| Extension ID | Purpose |
| --- | --- |
| `dbaeumer.vscode-eslint` | JS/JSX linting |
| `esbenp.prettier-vscode` | Code formatting |
| `eamodio.gitlens` | See who changed which line, branch graph |
| `GitHub.vscode-pull-request-github` | Create/review PRs inside VS Code |
| `bradlc.vscode-tailwindcss` | Tailwind class autocomplete |
| `ms-vscode.vscode-typescript-next` | Better JS IntelliSense |

**Set your Git identity** (once per machine — use your own name and GitHub email):

```bash
git config --global user.name "Ajay Vaidya"
git config --global user.email "ajay@greenzo.in"
git config --global init.defaultBranch main
git config --global core.autocrlf true      # Windows
# git config --global core.autocrlf input   # macOS / Linux instead of the line above
```

**Windows-only tips**

```powershell
# PowerShell treats `curl` as an alias — always use curl.exe
curl.exe -s http://127.0.0.1:4000/api/health

# Set an environment variable for the current PowerShell session
$env:PORT = "4000"
```

> Full-stack health of the database schema needs nothing extra: SQLite file + uploads folder are auto-created on first backend boot.

---

## 2. First-time setup in VS Code

```bash
# 2.1 Clone the repository (HTTPS)
git clone https://github.com/ajayvaidyaOP/greenzo.in.git

# 2.2 Move into the project folder
cd greenzo.in

# 2.3 Open the folder in VS Code (File → Open Folder also works)
code .

# 2.4 Install dependencies for root + backend + frontend (npm workspaces)
npm install

# 2.5 Create and seed the local SQLite database (first run only)
npm run seed

# 2.6 Start backend (port 4000) + storefront (port 5173) together
npm run dev
```

Then open:

| URL | What it is |
| --- | --- |
| <http://localhost:5173> | Public storefront |
| <http://localhost:5173> → Sign In → **Admin** | Admin Control Studio |
| <http://localhost:4000/api/health> | API health JSON |
| <http://localhost:4000/uploads/...> | Admin-uploaded photos |

**Stop everything:** press `Ctrl` + `C` in the terminal.

**Run the two servers in separate terminals** (better log visibility):

```bash
# Terminal 1 — API with auto-restart on file save
npm run dev:backend

# Terminal 2 — Vite storefront with HMR
npm run dev:frontend
```

**Run the automated smoke test** (backend must be running):

```bash
npm run verify
# or point it at any deployed URL:
API_URL=https://greenzo.in npm run verify
```

**All npm scripts at a glance**

| Command | What it does |
| --- | --- |
| `npm run dev` | Backend + frontend together (dev orchestrator) |
| `npm run dev:backend` | Express API only, `--watch` reload |
| `npm run dev:frontend` | Vite dev server only, host `0.0.0.0:5173` |
| `npm run seed` | Seed DB if empty |
| `npm run seed -- --reset` | Wipe and re-seed demo catalog/orders |
| `npm run build` | Production storefront build → `frontend/dist` |
| `npm run start` | Production API; also serves `frontend/dist` if present |
| `npm run verify` | Auth + admin + Razorpay + catalog API checks |

**VS Code shortcuts you will actually use**

| Shortcut | Action |
| --- | --- |
| `Ctrl` + `` ` `` | Open/toggle integrated terminal |
| `Ctrl` + `Shift` + `P` | Command Palette (e.g. `Git: Pull`, `Git: Push`) |
| `Ctrl` + `Shift` + `G` | Source Control panel (stage / commit / sync) |
| `Ctrl` + `Shift` + `F` | Search across the whole repo |
| `Ctrl` + `P` | Jump to a file by name |
| `F5` | Start debugging (choose "Node.js" → `backend/src/index.js`) |

---

## 3. Connect VS Code to GitHub (one time)

The clone already points at `https://github.com/ajayvaidyaOP/greenzo.in.git`. Verify:

```bash
git remote -v
# origin  https://github.com/ajayvaidyaOP/greenzo.in.git (fetch)
# origin  https://github.com/ajayvaidyaOP/greenzo.in.git (push)
```

Choose **one** authentication method.

### 3.1 HTTPS + credential helper (easiest)

```bash
# Windows
git config --global credential.helper manager

# macOS
git config --global credential.helper osxkeychain

# Linux (cache for 1 hour)
git config --global credential.helper 'cache --timeout=3600'
```

On the first `git push`, VS Code opens a browser sign-in (or asks for a **personal access token** instead of a password). `git pull` once to confirm access:

```bash
git pull origin main
```

### 3.2 SSH keys (no password prompts, best for servers)

```bash
ssh-keygen -t ed25519 -C "ajay@greenzo.in"     # press Enter 3× to accept defaults
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy the public key and paste it at
# GitHub → Settings → SSH and GPG keys → New SSH key
cat ~/.ssh/id_ed25519.pub          # macOS / Linux / Git Bash
# Get-Content $env:USERPROFILE\.ssh\id_ed25519.pub   # Windows PowerShell

ssh -T git@github.com              # expect: "Hi ajayvaidyaOP! You've successfully authenticated"

# Switch the remote from HTTPS to SSH
git remote set-url origin git@github.com:ajayvaidyaOP/greenzo.in.git
git remote -v
```

### 3.3 GitHub CLI

```bash
gh auth login
# → GitHub.com → HTTPS → "Login with a web browser" → paste the one-time code

gh auth status
gh repo view --web          # opens the repo in the browser
```

---

## 4. Daily Git & GitHub workflow (every command)

### 4.1 The standard feature-branch loop

```bash
# 1. See where you are and what changed
git status
git branch --show-current

# 2. Always start from an up-to-date main
git switch main
git pull origin main

# 3. Create a branch for your change
git switch -c feature/festival-offer-banner

# 4. Work on the code … then review your own diff
git status
git diff                    # unstaged changes
git diff --staged           # staged changes

# 5. Stage and commit
git add .
git commit -m "feat(admin): add festival offer banner controls"

# 6. Push the branch to GitHub
git push -u origin feature/festival-offer-banner
```

**Create the pull request** (GitHub CLI):

```bash
gh pr create --base main --head feature/festival-offer-banner \
  --title "Admin: festival offer banner controls" \
  --body "Adds banner toggle + live offer ticker preview."
```

Or without the CLI: open <https://github.com/ajayvaidyaOP/greenzo.in>, click **Compare & pull request** → **Create pull request**.

**Review, check, merge:**

```bash
gh pr list                        # open PRs
gh pr view 7 --web                # open PR #7 in the browser
gh pr checks 7                    # CI status (if GitHub Actions is enabled)
gh pr merge 7 --merge             # merge PR #7 (use --squash for one commit)
gh pr close 7                     # close without merging
```

**Clean up and sync locally:**

```bash
git switch main
git pull origin main
git branch -d feature/festival-offer-banner          # delete local branch
git push origin --delete feature/festival-offer-banner  # delete remote branch (optional)
```

### 4.2 The same flow using only the VS Code UI

1. `Ctrl` + `Shift` + `G` → **Source Control** panel.
2. Hover a changed file → click **+** to stage it (or **+** next to *Changes* to stage all).
3. Type the commit message → click **✓ Commit** (or `Ctrl` + `Enter`).
4. Click **Sync Changes** / **Publish Branch** (that is a `git pull` + `git push`).
5. `...` menu → **Branch** → **Create Branch…** / **Checkout to…** / **Pull** / **Push**.

### 4.3 Useful fix-up commands

```bash
# See history as a graph
git log --oneline --graph --decorate -15

# Undo edits in a file (not yet staged)
git restore frontend/src/App.jsx

# Unstage a file (keep the edits)
git restore --staged frontend/src/App.jsx

# Park work in progress and get it back later
git stash
git stash list
git stash pop

# Fix the last commit message / add a forgotten file
git add forgotten-file
git commit --amend -m "feat(admin): festival offer banner controls"
git push --force-with-lease origin feature/festival-offer-banner   # after amend, branch only

# Undo the last commit but keep the changes staged
git reset --soft HEAD~1

# Throw away all local changes on main (dangerous)
git reset --hard origin/main

# Undo a commit that is already on main, safely
git revert <commit-sha>
git push origin main
```

**Commit message convention** (keeps history readable):

| Prefix | Use for |
| --- | --- |
| `feat:` | new feature / section |
| `fix:` | bug fix |
| `docs:` | README, docs, comments |
| `style:` | Tailwind/CSS-only changes |
| `perf:` | speed, image/video weight |
| `refactor:` | code reshuffle, no behaviour change |
| `chore:` | deps, config, deploy scripts |

---

## 5. Pre-deploy check (run before every deploy)

```bash
# 1. Make sure there are no half-finished changes
git status

# 2. Production build of the storefront
npm run build

# 3. Start the production server (serves API + built storefront on port 4000)
npm run start

# 4. In a second terminal — health + full flow test
curl -s http://127.0.0.1:4000/api/health
curl -s -o /dev/null -w "storefront: %{http_code}\n" http://127.0.0.1:4000/
npm run verify

# 5. Stop the server (Ctrl + C in its terminal) and push
git push origin main
```

If `npm run verify` prints **🎉 All Auth, Admin & Razorpay full-stack checks passed!** you are safe to deploy.

---

## 6. Environment variables

The backend reads **plain environment variables** (`backend/src/config.js`). There is **no dotenv loader**, so a bare `.env` file is ignored unless you start Node with `--env-file`.

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `4000` | API + storefront HTTP port |
| `HOST` | `0.0.0.0` | Bind address |
| `DB_PATH` | `backend/data/greenzo.sqlite` | SQLite database file (orders, products, users) |
| `UPLOADS_DIR` | `backend/uploads` | Admin-uploaded photos |
| `JWT_SECRET` | dev fallback string | Signs login tokens — **change in production** |
| `RAZORPAY_KEY_ID` | *(empty)* | `rzp_test_...` / `rzp_live_...` (Admin Studio value wins if set) |
| `RAZORPAY_KEY_SECRET` | *(empty)* | Razorpay secret key |

### 6.1 Local usage

```bash
# Option 1 — copy the template and let Node load it
cp .env.example .env
cd backend
node --no-warnings --env-file=../.env src/index.js

# Option 2 — export for the current shell session
export PORT=4000
export JWT_SECRET="a-long-random-string"
export RAZORPAY_KEY_ID="rzp_test_xxxxxxxx"
export RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxx"
npm run dev
```

```powershell
# Windows PowerShell equivalent
$env:JWT_SECRET = "a-long-random-string"
$env:RAZORPAY_KEY_ID = "rzp_test_xxxxxxxx"
npm run dev
```

> `.env` is git-ignored on purpose — **never commit real keys**. Razorpay keys can also be saved at runtime from **Admin Studio → Store Settings**, which stores them in the database and overrides the env values.

### 6.2 Generate a strong JWT secret

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## 7. Option A — Deploy on your own VPS (recommended, Nginx + PM2 + HTTPS)

This is the simplest production topology because the Express backend already serves `frontend/dist` on the same domain — so `/api` calls stay same-origin and there is no CORS or rewrite config to maintain.

Assumptions: Ubuntu 22.04/24.04 VPS (Hostinger, DigitalOcean, AWS Lightsail, Contabo…), domain `greenzo.in` pointed at it.

### 7.1 Log in and harden the firewall

```bash
ssh root@YOUR_SERVER_IP

apt update && apt upgrade -y
apt install -y nginx git curl ufw

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status
```

### 7.2 Install Node.js 22 + PM2

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt install -y nodejs

node -v          # must be v22.5.0+
npm -v
npm install -g pm2
pm2 -v
```

### 7.3 Clone the repo and build

```bash
mkdir -p /var/www
cd /var/www
git clone https://github.com/ajayvaidyaOP/greenzo.in.git
cd greenzo.in

npm install      # use `npm install`, NOT `npm ci` (package-lock.json is git-ignored)
npm run build    # creates frontend/dist
npm run seed     # first boot only: seed catalog, demo users, coupons
```

### 7.4 Change the seeded admin password before going live

There is no password-change screen yet, so rotate it once from the CLI (uses the project's own scrypt hasher):

```bash
cd /var/www/greenzo.in
node --no-warnings --input-type=module -e "const {getDb}=await import('./backend/src/db/database.js');const {hashPassword}=await import('./backend/src/utils/authCrypto.js');getDb().prepare('UPDATE users SET password_hash=? WHERE email=?').run(hashPassword(process.argv[1]), process.argv[2]);console.log('password updated')" "YOUR_NEW_STRONG_PASSWORD" "admin@greenzo.in"
```

> If you run the API with a custom `DB_PATH`, prefix the same command with `DB_PATH=/your/path/greenzo.sqlite` so you edit the live database.

### 7.5 PM2 process file (keeps the site running 24×7)

```bash
cd /var/www/greenzo.in
nano ecosystem.config.cjs
```

Paste this (replace the secret placeholders):

```js
module.exports = {
  apps: [
    {
      name: 'greenzo',
      cwd: '/var/www/greenzo.in',
      script: 'backend/src/index.js',
      node_args: '--no-warnings',
      instances: 1,
      autorestart: true,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        HOST: '0.0.0.0',
        DB_PATH: '/var/www/greenzo.in/backend/data/greenzo.sqlite',
        UPLOADS_DIR: '/var/www/greenzo.in/backend/uploads',
        JWT_SECRET: 'PASTE_THE_LONG_RANDOM_STRING_HERE',
        RAZORPAY_KEY_ID: '',
        RAZORPAY_KEY_SECRET: ''
      }
    }
  ]
};
```

Save (`Ctrl` + `O`, `Enter`, `Ctrl` + `X`) and start it:

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup            # then run the sudo command PM2 prints

pm2 status
pm2 logs greenzo --lines 50
curl -s http://127.0.0.1:4000/api/health
```

> Secrets live in this file instead of the repo. Keep it out of Git with a local-only ignore (your teammates and GitHub never see the keys):
>
> ```bash
> echo "ecosystem.config.cjs" >> .git/info/exclude
> ```

### 7.6 Nginx reverse proxy

```bash
nano /etc/nginx/sites-available/greenzo
```

```nginx
server {
    listen 80;
    server_name greenzo.in www.greenzo.in;

    # Admin photo uploads are sent as base64 JSON (12 MB limit in Express)
    client_max_body_size 20m;

    # Long-lived cache for images & hero videos built by Vite
    location /assets/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/greenzo /etc/nginx/sites-enabled/greenzo
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

### 7.7 Point the domain at the server

In your registrar's DNS panel (GoDaddy / Hostinger / Cloudflare):

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| `A` | `@` | `YOUR_SERVER_IP` | 300 |
| `A` | `www` | `YOUR_SERVER_IP` | 300 |

Verify propagation, then load `http://greenzo.in` in a browser:

```bash
dig +short greenzo.in
curl -s http://greenzo.in/api/health
```

### 7.8 Free HTTPS with Let's Encrypt

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d greenzo.in -d www.greenzo.in --agree-tos -m ajay@greenzo.in --redirect
certbot renew --dry-run
systemctl list-timers | grep certbot
```

### 7.9 Ship an update (the command block you will use 95% of the time)

```bash
ssh root@YOUR_SERVER_IP
cd /var/www/greenzo.in
git pull origin main
npm install
npm run build
pm2 restart greenzo
curl -s https://greenzo.in/api/health
```

Everything above can also be pushed from VS Code first:

```bash
git add .
git commit -m "feat: new hero reel + season offers"
git push origin main
```

---

## 8. Option B — Deploy on Render / Railway (auto-deploy from GitHub, no server)

Great when you do not want to manage a VPS. The backend serves the built storefront, so **one web service is enough**.

### 8.1 Render (dashboard steps + commands)

1. Sign in at <https://render.com> → **New +** → **Web Service**.
2. **Connect GitHub** → choose repository `ajayvaidyaOP/greenzo.in` → branch `main`.
3. Fill in:

| Field | Value |
| --- | --- |
| Runtime | `Node` |
| Build Command | `npm install && npm run build` |
| Start Command | `npm run start` |
| Health Check Path | `/api/health` |
| Instance Type | Starter or higher |

4. **Environment** tab → add:

```text
NODE_VERSION=22
NODE_ENV=production
JWT_SECRET=<paste the random hex from §6.2>
DB_PATH=/var/data/greenzo.sqlite
UPLOADS_DIR=/var/data/uploads
RAZORPAY_KEY_ID=rzp_live_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
```

5. **Disks** tab → **Add Disk** → Name `greenzo-data`, Mount Path `/var/data`, Size `1 GB`
   *(without a disk, the SQLite DB and admin photo uploads are wiped on every deploy/restart).*
6. **Create Web Service** → wait for the deploy → open the `https://<service>.onrender.com` URL.
7. **Settings → Custom Domain** → add `greenzo.in` / `www.greenzo.in`, then create the shown `CNAME`/`A` records at your registrar.

**Every push to `main` now auto-deploys.** Manual redeploy:

```bash
# Dashboard: Manual Deploy → Deploy latest commit
# or force a no-op commit from VS Code:
git commit --allow-empty -m "chore: trigger deploy"
git push origin main
```

### 8.2 Railway (dashboard steps + commands)

```bash
# CLI route (optional)
npm install -g @railway/cli
railway login
railway init
railway up
```

Dashboard route:

1. <https://railway.app> → **New Project** → **Deploy from GitHub repo** → `ajayvaidyaOP/greenzo.in`.
2. **Variables** → add `NODE_VERSION=22`, `JWT_SECRET`, `DB_PATH=/var/data/greenzo.sqlite`, `UPLOADS_DIR=/var/data/uploads`, Razorpay keys.
3. **Settings → Volumes** → mount a volume at `/var/data`.
4. **Settings → Networking → Generate Domain** → open it, then add your custom domain.
5. **Deployments → Redeploy** for a manual release (or just `git push origin main`).

---

## 9. Option C — Frontend on Netlify/Vercel + API on a VPS

Only do this if you specifically want the storefront on a CDN. The frontend calls `/api` and `/uploads` **relatively**, so the host must rewrite those paths to your API domain.

### 9.1 Netlify

```bash
npm install -g netlify-cli
netlify login
npm run build
netlify deploy --prod --dir=frontend/dist
```

In **Site settings → Build & deploy**:

| Field | Value |
| --- | --- |
| Base directory | *(leave empty — repo root)* |
| Build command | `npm install && npm run build` |
| Publish directory | `frontend/dist` |

Commit a `netlify.toml` at the repo root (replace the API domain):

```toml
[build]
  command = "npm install && npm run build"
  publish = "frontend/dist"

[[redirects]]
  from = "/api/*"
  to = "https://api.greenzo.in/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/uploads/*"
  to = "https://api.greenzo.in/uploads/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 9.2 Vercel

```bash
npm install -g vercel
vercel login
vercel            # first-time link (project name: greenzo)
vercel --prod     # production deploy
```

Commit a `vercel.json` at the repo root (replace the API domain):

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "https://api.greenzo.in/api/:path*" },
    { "source": "/uploads/:path*", "destination": "https://api.greenzo.in/uploads/:path*" }
  ]
}
```

> On the API server, remember to allow the new origin: the backend already uses `cors()` with default (all origins), so no extra config is required — but keep `RAZORPAY` keys and `JWT_SECRET` set there.

---

## 10. Post-deployment verification

Run these against the live domain (replace `https://greenzo.in`):

```bash
# 1. API health + product count
curl -s https://greenzo.in/api/health

# 2. Storefront HTML loads
curl -s -o /dev/null -w "storefront: %{http_code}  in %{time_total}s\n" https://greenzo.in/

# 3. Catalog payload (categories, plants, offers)
curl -s https://greenzo.in/api/catalog | head -c 300

# 4. Admin login returns a token
curl -s -X POST https://greenzo.in/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@greenzo.in","password":"YOUR_ADMIN_PASSWORD"}'

# 5. Automated full-stack suite against production
API_URL=https://greenzo.in npm run verify

# 6. Uploads are served (open after uploading one photo from Admin Studio)
curl -s -o /dev/null -w "uploads: %{http_code}\n" https://greenzo.in/uploads/
```

**Manual browser checklist**

| # | Check | Where |
| --- | --- | --- |
| 1 | Hero video reels play, no console errors | `/` |
| 2 | Category menu, ⌘K / Ctrl+K search, mobile drawer | `/` |
| 3 | Add to cart → cart drawer → coupon `GREENZO10` | `/` |
| 4 | Sandbox Razorpay checkout completes → order confirmation | `/` checkout |
| 5 | Sign up → profile autofill → "My Plant Orders" | `/` Sign In |
| 6 | Admin: upload photo, edit price/stock, create coupon | Admin Studio |
| 7 | Refresh a deep link (e.g. `/` with hash route) → no 404 | any page |
| 8 | HTTPS padlock, no mixed-content warnings | any page |

---

## 11. Rollback, logs & backups

### 11.1 Roll back the code

```bash
# Find the last good commit
git log --oneline -10

# A) Fast rollback on the server (no history rewrite on GitHub)
cd /var/www/greenzo.in
git fetch --all
git reset --hard <GOOD_COMMIT_SHA>
npm install
npm run build
pm2 restart greenzo
curl -s https://greenzo.in/api/health

# B) Safe rollback through Git history (preferred for the repo)
git revert <BAD_COMMIT_SHA>
git push origin main
# then on the server / Render / Railway:
git pull origin main && npm install && npm run build && pm2 restart greenzo
```

### 11.2 Logs

```bash
pm2 logs greenzo --lines 100      # live API logs
pm2 logs greenzo --err            # errors only
pm2 monit                         # CPU / memory
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

Render / Railway: **Logs** tab in the service dashboard.

### 11.3 Back up the database and uploads

```bash
# Create a timestamped backup (run on the VPS)
sudo mkdir -p /var/backups/greenzo
sudo tar -czf /var/backups/greenzo/greenzo-$(date +%F-%H%M).tar.gz \
  -C /var/www/greenzo.in backend/data backend/uploads
ls -lh /var/backups/greenzo

# Restore a backup
cd /var/www/greenzo.in
pm2 stop greenzo
sudo tar -xzf /var/backups/greenzo/greenzo-YYYY-MM-DD-HHMM.tar.gz -C /var/www/greenzo.in
pm2 start greenzo
```

Download a copy to your laptop (from your local machine):

```bash
scp root@YOUR_SERVER_IP:/var/backups/greenzo/greenzo-*.tar.gz ./
```

> Schedule a nightly backup with cron (`crontab -e`):
> `0 2 * * * tar -czf /var/backups/greenzo/greenzo-$(date +\%F).tar.gz -C /var/www/greenzo.in backend/data backend/uploads`

---

## 12. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ERR_UNKNOWN_BUILTIN_MODULE: node:sqlite` | Node older than 22.5 | Install Node 22 LTS (`node -v`), then `npm install` again |
| `Error: listen EADDRINUSE :::4000` | Port already used | `lsof -i :4000` then `kill -9 <PID>`, or run `PORT=4100 npm run start` |
| `npm error code EUSINGNOPACKAGELOCK` / `npm ci` fails | `package-lock.json` is git-ignored | Use `npm install` instead of `npm ci` |
| Storefront shows API errors on the live domain | `npm run build` was not run before `npm run start` | Run `npm run build`, restart with `pm2 restart greenzo` |
| Deep link refresh returns 404 | `frontend/dist` missing, so SPA fallback is not registered | Build the frontend; confirm `frontend/dist/index.html` exists |
| Admin photo uploads vanish after deploy | No persistent disk (Render/Railway/PaaS) | Mount a disk at `/var/data` and set `UPLOADS_DIR=/var/data/uploads` |
| Orders/products reset unexpectedly | SQLite file recreated (no persistent disk or wrong `DB_PATH`) | Set `DB_PATH` to the persistent volume path and restore the backup |
| Razorpay window shows the sandbox instead of real payments | Keys not saved / not `rzp_...` | Save `rzp_live_...` keys in **Admin Studio → Store Settings**, or set `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET` |
| Admin login works locally but not live | Seeded DB not created on the server | Run `npm run seed` once, then retry |
| Logged out after every deploy | `JWT_SECRET` missing or changing | Put a fixed `JWT_SECRET` in the PM2 env / host variables |
| `git push` rejected (`non-fast-forward`) | Remote has newer commits | `git pull --rebase origin main`, resolve, then `git push origin main` |
| Nginx shows **413 Request Entity Too Large** on upload | Base64 photo exceeds Nginx limit | Keep `client_max_body_size 20m;` in the server block, then `sudo systemctl reload nginx` |
| 502 Bad Gateway from Nginx | API process down | `pm2 status`, `pm2 logs greenzo`, `pm2 restart greenzo` |
| Site loads on `IP:4000` but not the domain | DNS or Nginx `server_name` mismatch | `dig +short greenzo.in`, fix the A record, `nginx -t && systemctl reload nginx` |
| Vite dev server unreachable from another device | Bind address | Already configured as `--host 0.0.0.0`; allow port `5173` in the local firewall |

---

## Further Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — data model, API design, performance notes
- [`docs/API_REFERENCE.md`](docs/API_REFERENCE.md) — every endpoint with payloads
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — short deployment summary (links back to this guide)
- [`.env.example`](.env.example) — copy to `.env` and fill in secrets
