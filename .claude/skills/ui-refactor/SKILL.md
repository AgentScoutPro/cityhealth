---
name: ui-refactor
description: Overhauls clunky or boilerplate dashboard components into professional B2B SaaS interfaces.
---

When the user runs `/ui-refactor <file_path>`, execute these exact steps:

1. READ the file to look for uninspiring data layouts (e.g., standard table grids, basic bullet lists, or raw text blocks).
2. CONVERT raw data lists into clean, interactive Metric Cards.
3. INCLUDE:
   - A descriptive title (e.g., "Organic Traffic Baseline").
   - A primary hero metric (e.g., "45.2k").
   - A subtle trend badge (e.g., "+12.4% vs last month") with clean arrow icons.
4. REPLACE all standard HTML buttons or unstyled tabs with unified, interactive component logic that utilizes Vercel UI Design Guidelines (layered shadows, nested radii, clear focus states).
5. FORMAT any tables with explicit column widths, text truncation, and light grey hover states.

## Design Constraints (from CLAUDE.md)
- Theme: Dark mode, Vercel-inspired deep grays and true blacks.
- Borders: `1px border-neutral-800` with layered ambient container shadows.
- Typography: Inter or Geist. SEO metric numbers must be large and bold.
- Color Coding: Positive trends = Emerald/Mint green. Errors/negative = Coral/Red.
- Icons: Lucide-React only. No raw SVGs or mixed icon packs.
- Charts: Recharts or Tremor only.

## Post-Refactor
- Run `npm run build` (or `npm run dev` if build is not applicable) to verify no layout regressions.
- Report a brief summary of every component converted and any Lucide icons introduced.

## Hard Limits
- DO NOT modify API fetching logic, database schemas, or environment variables.
- Styling changes only — no business logic alterations.
