# SEO Dashboard Frontend Refactor Instructions

## Design Guidelines & Component Tokens
- Theme: Minimalist B2B SaaS. Dark mode preferred (Vercel-inspired deep grays and true blacks).
- Borders: Crisp `1px border-neutral-800` paired with layered, ambient container shadows.
- Typography: Strict sans-serif hierarchy (Inter or Geist). Keep SEO metric numbers large and bold.
- Color Coding: Positive SEO trends = Emerald/Mint green. Negative trends/errors = Coral/Red.

## Allowed Packages & Libraries
- Icons: Lucide-React (No generic raw SVGs or mixed icon packs).
- Charts: Recharts or Tremor (Clean, color-blind friendly palettes with simple tooltip triggers).

## Developer Rules
- DO NOT touch API fetching logic, database schemas, or environment variables.
- Modulate the styling purely via UI/Component layers.
- Automatically run `npm run build` or `npm run dev` to verify layouts don't break.

## Charting & Graphic Standards
- Charts: Use Tremor or Shadcn area/bar charts with smooth gridlines and subtle animated tooltips.
- Visuals: Use area charts with gradient opacity fills under performance curves.
- Layouts: Force a strict grid containing high-density KPIs at the top and visual data trends beneath them.
