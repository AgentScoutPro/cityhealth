# COD3AI — City Health SEO Audit Dashboard

A premium B2B dark-mode SEO audit dashboard built for City Health Services. Features a FastAPI backend, React + Vite frontend with Recharts data visualizations, and a built-in PDF client report generator.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS v3 |
| Charts | Recharts (AreaChart with gradient fills) |
| Icons | Lucide-React |
| PDF Export | @react-pdf/renderer v4 |
| Backend | FastAPI + SQLite |
| Deployment | Vercel (static frontend + Python serverless) |

---

## Project Structure

```
.
├── frontend/                  # React + Vite application
│   ├── src/
│   │   ├── App.jsx            # Root layout, nav config, tab routing
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # Collapsible nav with Lucide icons + badges
│   │   │   ├── MetricCard.jsx       # KPI card with trend badge + icon slot
│   │   │   ├── IssueCard.jsx        # Expandable audit issue with fix panel
│   │   │   ├── ScoreRing.jsx        # Circular score indicator
│   │   │   ├── ClientReportPDF.jsx  # PDF document (COD3AI branding)
│   │   │   └── tabs/
│   │   │       ├── OverviewTab.jsx  # AreaChart, Snapshot table, PDF export
│   │   │       ├── TechnicalTab.jsx
│   │   │       ├── OnPageTab.jsx
│   │   │       ├── LocalSeoTab.jsx
│   │   │       ├── SchemaTab.jsx
│   │   │       ├── ContentTab.jsx
│   │   │       ├── MetaTab.jsx
│   │   │       └── ActionTab.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── api/
│   ├── index.py               # FastAPI app (audit CRUD endpoints)
│   ├── audit.db               # Pre-seeded SQLite database
│   └── requirements.txt
├── CLAUDE.md                  # UI design constraints for Claude Code
├── vercel.json                # Vercel deployment config
└── README.md
```

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at `http://localhost:5173`. API calls are proxied to `http://localhost:8000`.

### Backend

```bash
cd api
pip install -r requirements.txt
uvicorn index:app --reload --port 8000
```

### Build

```bash
cd frontend
npm run build   # outputs to frontend/dist/
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/audit` | Full audit data (issues, passing checks, score) |
| `PATCH` | `/api/issue/{id}` | Toggle issue resolved status |

The SQLite database (`api/audit.db`) is pre-seeded with City Health Services audit data and bundled with the deployment.

---

## Deployment (Vercel)

The `vercel.json` at the project root handles both the static frontend and the Python serverless function:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    { "source": "/api/:path*", "destination": "/api/index.py" },
    { "source": "/(.*)",       "destination": "/index.html" }
  ]
}
```

- The frontend build runs Vite from `frontend/`
- Static assets are served from `frontend/dist/`
- `api/index.py` is auto-detected by Vercel as a Python serverless function
- All non-asset, non-API paths fall through to `index.html` for client-side routing

### Live Site

`https://cityhealth-seo-audit.vercel.app`

---

## UI Design System

Defined in [`CLAUDE.md`](CLAUDE.md). Key constraints:

- **Theme:** Dark mode — Vercel-inspired true blacks and deep grays
- **Borders:** `1px border-neutral-800` with layered ambient shadows
- **Typography:** Inter / Geist, large bold numbers for SEO metrics
- **Positive trends:** Emerald / Mint green (`#34d399`)
- **Negative trends / errors:** Coral / Red (`#f87171`)
- **Icons:** Lucide-React only
- **Charts:** Recharts `AreaChart` with `linearGradient` opacity fills

---

## PDF Client Report

The **Download PDF** button on the Overview tab generates a branded client-facing report via `@react-pdf/renderer`:

- COD3AI agency header
- Overall health score card
- Baseline vs. Current snapshot comparison table with colored deltas
- Numbered key findings with amber accent bars
- Fixed confidential footer

---

## Branch

Active development is on the `ui-polish` branch.

---

*Built by [COD3AI.COM](https://cod3ai.com) — Digital Growth Agency*
