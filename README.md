<div align="center">

# ⚡ PingFlow

**Lightweight, open-source Uptime & SSL Monitor**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fpingflow)

_A beautiful, dark-themed status page and uptime monitor — zero database, instant deploy._

![PingFlow Status Page Preview](https://placehold.co/900x480/111111/22c55e?text=PingFlow+Status+Page&font=roboto)

</div>

---

## ✨ Features

| Feature | Serverless (Vercel) | Self-Hosted (Docker) |
|---|:---:|:---:|
| Real-time uptime monitoring | ✅ | ✅ |
| SSL certificate expiry tracking | ✅ | ✅ |
| Response-time sparkline graphs | ✅ | ✅ |
| Live green/yellow/red dot indicators | ✅ | ✅ |
| Auto-polls every 30 seconds | ✅ | ✅ |
| **Zero external database** | ✅ | ✅ |
| Config via a single JSON file | ✅ | ✅ |
| Dark-themed Vercel-style UI | ✅ | ✅ |
| One-click deploy | ✅ | — |
| Persistent history across restarts | — | ✅ (via volume) |

---

## 🚀 Live Demo (Vercel) — Zero Database, Zero Config

PingFlow reads its monitor list from `pingflow.config.json`, which lives **inside the repo**. No database setup is required — just fork and deploy.

### Steps

1. **Fork this repository** on GitHub (click the _Fork_ button, top-right).

2. **Click the button below** to deploy your fork to Vercel:

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fpingflow)

   > Replace `YOUR_USERNAME` with your GitHub username after forking.

3. Vercel will build and deploy in ~60 seconds. Your status page is live! 🎉

4. **To add your own sites**, edit `pingflow.config.json` in your forked repo and push — Vercel auto-redeploys.

### Editing `pingflow.config.json`

```json
{
  "monitors": [
    {
      "id": "my-app",
      "name": "My App",
      "url": "https://myapp.com",
      "expectedStatus": 200
    },
    {
      "id": "my-api",
      "name": "My API",
      "url": "https://api.myapp.com/health",
      "expectedStatus": 200
    }
  ]
}
```

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (no spaces) |
| `name` | `string` | Display name shown on the status page |
| `url` | `string` | Full URL to monitor (http or https) |
| `expectedStatus` | `number` | Expected HTTP status code (usually `200`) |

---

## 🐳 Self-Hosted (Docker) — Run on Your Own Machine

This section is written for people who have **never used Docker before**. Follow every step in order.

### Step 1 — Install Docker Desktop

Docker Desktop is a free app that lets you run containers on your computer.

1. Go to **[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)**
2. Click **"Download Docker Desktop"** for your operating system (Windows / Mac / Linux).
3. Run the installer and follow the prompts (keep all defaults).
4. Once installed, **open Docker Desktop** from your Start Menu / Applications folder.
5. Wait until you see the green **"Engine running"** status in the bottom-left corner of the Docker Desktop window.

   > ✅ Docker is ready when the whale icon in your system tray is steady (not animating).

### Step 2 — Install Git (if you don't have it)

Git lets you download ("clone") the PingFlow code.

1. Go to **[https://git-scm.com/downloads](https://git-scm.com/downloads)**
2. Download and install Git for your OS (keep all defaults).
3. Verify it worked: open a terminal and run:
   ```bash
   git --version
   # Should print something like: git version 2.x.x
   ```

### Step 3 — Clone the Repository

Open a **terminal** (PowerShell on Windows, Terminal on Mac/Linux) and run:

```bash
git clone https://github.com/YOUR_USERNAME/pingflow.git
cd pingflow
```

> Replace `YOUR_USERNAME` with the GitHub username where the repo lives.

You should now be inside the `pingflow` folder.

### Step 4 — (Optional) Edit Your Monitors

Open `pingflow.config.json` in any text editor (Notepad works fine) and add your own URLs:

```json
{
  "monitors": [
    {
      "id": "my-site",
      "name": "My Website",
      "url": "https://example.com",
      "expectedStatus": 200
    }
  ]
}
```

Save the file when done.

### Step 5 — Start PingFlow

In your terminal (make sure you're still inside the `pingflow` folder), run:

```bash
docker compose up -d
```

That's it. Docker will:
1. Download the Node.js base image (~50 MB, one time only)
2. Install dependencies and build the app (~2 minutes first time)
3. Start the server in the background

### Step 6 — Open Your Status Page

Open your browser and go to:

```
http://localhost:3000
```

You should see the PingFlow dark-themed status dashboard with all your monitors! 🎉

---

### 🛑 Stopping PingFlow

```bash
docker compose down
```

### 🔄 Updating Your Monitors (No Rebuild Needed)

Because `pingflow.config.json` is **bind-mounted** into the container, you can edit it and just restart — no rebuild required:

```bash
# 1. Edit pingflow.config.json (add/remove monitors)
# 2. Restart the container to pick up changes:
docker compose restart
```

### 🏗️ Rebuilding After a Code Update

If you pull new changes from GitHub:

```bash
git pull
docker compose up -d --build
```

---

## 🏗️ Local Development (Without Docker)

If you're a developer and want to run the app locally:

### Prerequisites

- [Node.js 20+](https://nodejs.org)
- npm 9+

### Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The dev server hot-reloads on every file save. Edit `pingflow.config.json` and refresh to see changes instantly.

---

## 🗂️ Project Structure

```
pingflow/
├── app/
│   ├── api/status/route.ts   # GET /api/status — pings all monitors
│   ├── layout.tsx            # Root layout (dark theme, metadata)
│   └── page.tsx              # Status page (polls API every 30s)
├── components/
│   ├── HeaderBanner.tsx      # Overall status hero banner
│   ├── MonitorCard.tsx       # Per-monitor card
│   └── ui/
│       ├── StatusDot.tsx     # Animated dot indicator
│       ├── StatusBadge.tsx   # Pill badge (Operational / Degraded / Down)
│       ├── ResponseBars.tsx  # Sparkline bar chart
│       └── SslBadge.tsx      # SSL expiry badge
├── lib/
│   └── ping.ts               # Core ping logic (fetch + TLS cert check)
├── types/
│   └── index.ts              # Shared TypeScript types
├── pingflow.config.json      # ← Edit this to add your monitors
├── Dockerfile                # Multi-stage production Docker image
└── docker-compose.yml        # One-command self-hosting
```

---

## 🔧 How It Works

```
Browser  →  GET /       →  Next.js renders status page
             ↓ (every 30s)
Browser  →  GET /api/status
             ↓
         reads pingflow.config.json
             ↓
         Promise.all([ping(google), ping(github), ping(vercel)])
             ↓
         returns JSON { overall, monitors[], checkedAt }
             ↓
Browser updates UI (dots, bars, badges)
```

- **No database.** History lives in the browser's React state — 30 data points per monitor (last 15 minutes at the default 30s interval).
- **SSL checks** use Node.js's built-in TLS stack — no third-party certs needed.
- **Timeouts** are enforced at 10 seconds via `AbortController` — a hung monitor never blocks the others.

---

## 📄 License

MIT © PingFlow contributors. Use it, fork it, ship it.
