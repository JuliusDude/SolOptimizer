# SolOptimizer Task Decomposition & Status

Status Legend:
- `[ ]` Pending
- `[-]` In Progress
- `[x]` Completed

---

## Phase 1: Foundation & Project Scaffolding
- [x] 1.1 Set up environment variables (`.env.local` & `.env.example`) with Supabase and Mapbox keys
- [x] 1.2 Establish repository rules documentation (`CONTEXT.md`, `TASKS.md`, `.gitignore`)
- [x] 1.3 Initialize `package.json`, Next.js 14/15, TypeScript, Tailwind CSS, Lucide icons, and core dependencies
- [x] 1.4 Write Postgres schema migration `supabase/migrations/20260916000000_init_solar_schema.sql` with RLS & indexes
- [x] 1.5 Implement Supabase client & dual-mode storage helper (`lib/supabase/client.ts`, `server.ts`, `store.ts`)

---

## Phase 2: Core Solar Calculation Engine & Datasets
- [x] 2.1 Define domain contracts & TypeScript interfaces (`lib/solar/types.ts`)
- [x] 2.2 Create regional solar resource dataset (`data/solar-resource.json`) & assumptions (`data/assumptions.json`)
- [x] 2.3 Implement pure deterministic calculation engine & 25-year projections (`lib/solar/calculator.ts`)
- [x] 2.4 Build and verify Vitest unit test suite covering demo cases, boundary values, zero savings, and degradation (`tests/unit/calculator.test.ts`)

---

## Phase 3: Estimator Wizard (6 Steps)
- [x] 3.1 Implement wizard state management & Zod validation schema (`lib/estimator/store.ts`)
- [x] 3.2 Build Wizard shell with progress indicators and navigation (`components/estimator/WizardShell.tsx`)
- [x] 3.3 Step 1: Property & Location (GPS geolocation + Indian city search + solar resource lookup)
- [x] 3.4 Step 2: Roof Measurement (manual sq ft/sq m toggle + interactive Mapbox satellite polygon drawer with Turf.js)
- [x] 3.5 Step 3: Roof Characteristics (8-cardinal compass orientation + shading levels)
- [x] 3.6 Step 4: Electricity & Tariff (monthly bill ₹ INR, optional kWh consumption, SolOptimizer vs custom tariff)
- [x] 3.7 Step 5: System & Assumptions (cost per kW + collapsible advanced assumptions)
- [x] 3.8 Step 6: Review Summary with inline section editing -> Calculate CTA

---

## Phase 4: Results & Persistence
- [x] 4.1 Results hero system size & 5 primary KPI metric cards
- [x] 4.2 25-year financial projection chart (Recharts cumulative savings & payback crossover)
- [x] 4.3 Generation profile visualization (Recharts monthly curve)
- [x] 4.4 Transparent methodology panel ("What did we assume? -> What did we calculate? -> How did it affect my result?")
- [x] 4.5 Save estimate flow into Supabase PostgreSQL / store
- [x] 4.6 Dashboard page (`/dashboard`): latest estimate summary, saved estimates grid, and empty state
- [x] 4.7 Saved estimate reproducible detail view (`/dashboard/estimates/[id]`)

---

## Phase 5: Landing Page, Authentication & Final Polish
- [x] 5.1 Landing page (`/`) with value proposition, one-click demo calculation, and disclaimers
- [x] 5.2 Sign-in and Sign-up pages (`/auth/sign-in`, `/auth/sign-up`) with demo guest login support
- [x] 5.3 Global navigation bar and footer with disclaimer
- [x] 5.4 End-to-end verification and production build check (`npm run build`)
- [x] 5.5 Update `README.md` and push all commits to git remote
