# SolOptimizer Context & Living Architecture

## 1. System Overview
**SolOptimizer** is a transparent, homeowner-focused rooftop solar decision-support application built for the Ministry of New and Renewable Energy (PS03 — Software Foundational Renewable / Sustainable Energy). It enables homeowners to:
1. Locate their property (GPS or manual search).
2. Measure roof area (manual entry in sq ft/sq m or interactive Mapbox satellite polygon drawing).
3. Specify roof characteristics (compass orientation and shading level).
4. Input electricity bills (₹ INR/month) and optional consumption (kWh/month).
5. Review transparent, deterministic solar estimations: system capacity (kW), annual generation (kWh), system cost (₹), bill savings (₹/year), simple payback (years), 25-year financial projection, and CO₂ offset (kg/year).
6. Persist and review saved estimates in a personalized dashboard backed by Supabase.

---

## 2. Tech Stack & Integrations
- **Framework**: Next.js (App Router), React, TypeScript (Strict)
- **Styling & UI**: Tailwind CSS, Lucide icons, accessible primitives
- **Database & Auth**: Supabase (PostgreSQL with Row Level Security, Supabase Auth via SSR, with dual-mode localStorage demo fallback)
- **Mapping & Geodesy**: Mapbox GL JS, `@mapbox/mapbox-gl-draw`, `@turf/turf` (geodesic polygon area)
- **Data Visualization**: Recharts (25-year financial payback crossover chart & monthly generation curve)
- **Validation**: Zod
- **Testing**: Vitest (pure calculation engine unit tests)

---

## 3. Directory Map
```text
soloptimizer/
├── app/
│   ├── (marketing)/page.tsx           # High-converting landing page
│   ├── auth/                          # Sign-in & Sign-up pages
│   ├── dashboard/                     # User dashboard with saved estimates & metrics
│   │   └── estimates/[id]/page.tsx    # Saved estimate reproducible detail view
│   ├── estimate/                      # 6-step guided solar estimator wizard
│   │   └── results/page.tsx           # Results screen with KPIs, charts, methodology
│   ├── layout.tsx                     # Root app layout with navigation & providers
│   ├── globals.css                    # Tailwind tokens and styles
│   └── api/                           # Route handlers (if needed)
├── components/
│   ├── ui/                            # Buttons, inputs, dialogs, cards, badges
│   ├── estimator/                     # Step 1 through Step 6 components & wizard shell
│   ├── maps/                          # Mapbox polygon drawing component with area measurement
│   ├── charts/                        # Financial projection & generation charts
│   ├── results/                       # KPI summary cards & methodology panel
│   └── dashboard/                     # Estimate cards, latest estimate hero, empty states
├── data/
│   ├── solar-resource.json            # Regional solar irradiance dataset for Indian cities
│   └── assumptions.json               # Default engineering & financial assumptions
├── lib/
│   ├── solar/                         # Pure deterministic solar calculation engine
│   │   ├── types.ts                   # Domain models and contracts
│   │   ├── calculator.ts              # Core calculation functions & 25-year projection
│   │   └── assumptions.ts             # Default configuration loader
│   ├── estimator/                     # Wizard form state & Zod validation
│   └── supabase/                      # Browser, server, and demo-fallback clients
├── supabase/
│   └── migrations/                    # SQL migrations with RLS policies & indexes
├── tests/
│   └── unit/                          # Vitest unit test suite for calculation engine
├── CONTEXT.md                         # This living context document
├── TASKS.md                           # Operational task decomposition
├── RULES.md                           # Operational rules
└── PRD.md                             # Complete Product Requirements Document
```

---

## 4. Domain Glossary
- **Capacity (kW)**: Nominal solar PV system size in kilowatts = `Usable Roof Area (sq ft) ÷ Area Required Per kW`.
- **Peak Sun Hours (PSH)**: Equivalent hours per day at standard test irradiance of 1,000 W/m² for the property location.
- **System Performance Factor (PR)**: Derating factor (~0.78) representing inverter efficiency, wiring, dust, and temperature losses.
- **Orientation Factor**: Relative solar efficiency depending on azimuth (e.g. South: 1.0, South-East: 0.95, North: 0.60).
- **Shading Factor**: Derating factor reflecting daytime obstructions (Low: 1.0, Moderate: 0.80, High: 0.55).
- **Simple Payback**: Investment recovery period in years = `System Cost ÷ Annual Savings`.
- **CO₂ Avoided**: Grid offset in kilograms = `Annual Generation (kWh) × 0.82 kg CO₂/kWh`.
- **25-Year Projection**: Lifetime modeling with annual panel degradation (0.7%/yr) and electricity tariff escalation (3%/yr).

---

## 5. Active Integrations & Environment
- `NEXT_PUBLIC_SUPABASE_URL`: Connected to Supabase project `https://hzyqingihqjazzmwdbmj.supabase.co`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client key configured.
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: Mapbox access token configured for satellite imagery and drawing controls.
- Demo fallback: Enabled in `lib/supabase/store.ts` for offline/guest assessment.
