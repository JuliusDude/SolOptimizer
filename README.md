# SolOptimizer — Transparent Rooftop Solar Decision Support

**Problem Statement:** PS03 — Software Foundational Renewable / Sustainable Energy  
**Host Ministry & Division:** Ministry of New and Renewable Energy (MNRE)  
**Target:** Functional, deployed web application with explainable solar estimation logic  

> **"Know your roof. Know your savings. Make solar decisions with confidence."**

---

## 1. Overview

SolOptimizer is an open, homeowner-centric rooftop solar decision-support application. It eliminates consumer uncertainty by converting everyday homeowner inputs (location, roof area, monthly electricity bill) into a transparent, deterministic solar estimate:
- **System Capacity (kW)**
- **Annual Generation (kWh/year)**
- **System Turnkey Cost (₹ INR)**
- **Annual Bill Savings (₹ INR/year)**
- **Simple Payback Period (Years)**
- **25-Year Compound Financial Projection** (including panel degradation & tariff inflation)
- **CO₂ Emissions Avoided (kg/year & tonnes/year)**

Unlike generic solar calculators that provide unexplained numbers, SolOptimizer follows the core principle:  
**Input → Assumption → Formula → Result** — displaying all intermediate variables, irradiance factors, and derating ratios.

---

## 2. Key Features

1. **Guided 6-Step Estimator Wizard:**
   - **Step 1 (Property & Location):** HTML5 Geolocation, Indian city presets (Belagavi, Bengaluru, Mumbai, Delhi, etc.), and regional Peak Sun Hours (PSH) lookup.
   - **Step 2 (Roof Measurement):** Manual area input (sq ft / m² toggle) or **interactive satellite polygon drawing** on Mapbox satellite imagery using geodesic Turf.js area computation.
   - **Step 3 (Roof Characteristics):** 8-compass cardinal orientation (South 100%, SE/SW 95%, East/West 85%, etc.) and daytime shading factors (Low 100%, Moderate 80%, High 55%).
   - **Step 4 (Electricity & Tariff):** Monthly bill in ₹ INR, optional consumption in kWh, and standard or custom tariffs.
   - **Step 5 (System & Assumptions):** Capital cost per kW (benchmark ₹55,000/kW) plus collapsible advanced engineering parameters (usable factor, area/kW, PR factor, degradation rate, CO₂ factor).
   - **Step 6 (Review & Calculate):** Comprehensive summary with inline section edit links before calculation.

2. **Results & Visualization:**
   - **Hero Capacity Banner:** Estimated system size in kW and rooftop demand coverage percentage.
   - **5 Primary Metric KPI Cards:** Generation, bill savings, payback period, carbon offset, and usable area.
   - **25-Year Financial Projection Chart (Recharts):** Visualizes cumulative bill savings surpassing turnkey capital expenditure (payback crossover).
   - **12-Month Generation Chart:** Seasonal solar harvest distribution curves across India.
   - **Transparent Methodology Accordion:** Full mathematical derivation and reference values.
   - **Official Decision-Support Disclaimer Banner.**

3. **Dashboard & Saved Estimates:**
   - Persistent estimate history backed by **Supabase PostgreSQL** with Row Level Security (RLS) and seamless local-storage fallback for offline/guest assessment.
   - Latest estimate highlight summary.
   - Individual estimate analysis detail view (`/dashboard/estimates/[id]`).

4. **Modern UI/UX:**
   - **Dark Theme Redesign:** Fully immersive dark mode for reduced eye strain and a modern aesthetic.
   - **Watermelon UI Integration:** Leverages sleek, accessible components from the Watermelon UI library.
   - **Refined Interface:** Cleaned up the design by removing legacy pills in favor of a cleaner, more streamlined layout.

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Styling** | Tailwind CSS + Watermelon UI + Lucide Icons (Dark Theme Native) |
| **Maps & Geodesy** | Mapbox GL JS + `@mapbox/mapbox-gl-draw` + Turf.js |
| **Charts** | Recharts (Area, Line, Bar, Composed) |
| **Validation** | Zod |
| **Database & Auth** | Supabase (PostgreSQL with RLS, Auth SSR) |
| **Unit Testing** | Vitest |

---

## 4. Getting Started

### Prerequisites
- Node.js v18+ (tested on Node v22)
- npm or pnpm

### Installation
```bash
git clone https://github.com/JuliusDude/SolOptimizer.git
cd SolOptimizer
npm install
```

### Environment Variables
Create a `.env.local` file in the root directory (see `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-key
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-public-token
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Unit Tests
```bash
npm test
```

### Production Build
```bash
npm run build
npm start
```

---

## 5. Database Schema & RLS

Supabase migrations are located in `supabase/migrations/20260916000000_init_solar_schema.sql`.

Key tables:
- `profiles`: User profiles linked to `auth.users(id)`
- `properties`: Property address, coordinates, and metadata
- `solar_estimates`: Saved calculations, input payloads, assumption snapshots, and GeoJSON geometries
- `solar_resource_data`: Regional peak sun hours reference datasets
- `assumption_sets`: Versioned financial and engineering assumptions

All tables enforce Row Level Security:
```sql
create policy "Users can view their own solar estimates"
  on public.solar_estimates for select
  to authenticated
  using ((select auth.uid()) = user_id);
```

---

## 6. Calculation Methodology

1. **Usable Roof Area:**
   $$\text{Usable Area (sq ft)} = \text{Roof Area} \times \text{Usable Factor (0.85)}$$

2. **System Capacity:**
   $$\text{Capacity (kW)} = \frac{\text{Usable Roof Area (sq ft)}}{80\text{ sq ft/kW}}$$

3. **Annual Generation:**
   $$\text{Generation (kWh)} = \text{Capacity} \times \text{PSH} \times 365 \times \text{PR (0.78)} \times \text{Orientation Factor} \times \text{Shading Factor}$$

4. **Annual Savings:**
   $$\text{Savings (₹)} = \text{Generation (kWh)} \times \text{Tariff (₹/kWh)}$$

5. **Simple Payback:**
   $$\text{Payback (Years)} = \frac{\text{System Cost (₹)}}{\text{Annual Savings (₹)}}$$

6. **CO₂ Offset:**
   $$\text{CO}_2\text{ Offset (kg)} = \text{Generation (kWh)} \times 0.82\text{ kg CO}_2\text{/kWh}$$

---

## 7. License

Built for the Ministry of New and Renewable Energy Hackathon (PS03). MIT License.
