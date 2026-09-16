# SolOptimizer — Product Requirements Document

**Product:** SolOptimizer  
**Problem Statement:** PS03 — Software Foundational Renewable / Sustainable Energy  
**Host Ministry & Division:** Ministry of New and Renewable Energy  
**Document Status:** Hackathon MVP PRD  
**Target:** Functional, deployed web application with explainable solar estimation logic

---

## 1. Product Overview

### 1.1 Product vision

SolOptimizer is a homeowner-focused rooftop solar decision-support application. It helps users understand whether their roof is suitable for solar, estimate an appropriate system size, forecast annual electricity generation and savings, calculate approximate payback, and quantify CO₂ avoided.

The product should feel like a guided solar assessment rather than a generic calculator.

### 1.2 Core value proposition

> **Know your roof. Know your savings. Make solar decisions with confidence.**

SolOptimizer converts a small set of understandable homeowner inputs into a transparent solar estimate and preserves the estimate in the user's dashboard for future comparison.

### 1.3 What the product is not

SolOptimizer is an estimation and decision-support tool. It is **not**:

- a certified solar site survey;
- an engineering design or structural assessment;
- a binding installer quotation;
- a guaranteed electricity-bill forecast;
- a substitute for professional solar feasibility assessment.

This disclaimer must be visible on results and saved-estimate views.

---

## 2. Problem

Homeowners often do not know:

- whether their roof has enough usable area for solar;
- how orientation and shading affect generation;
- what a typical system might cost;
- how much electricity the system could produce;
- how much their electricity bill could decrease;
- how long the investment could take to recover; or
- what environmental benefit the installation could provide.

This uncertainty slows rooftop solar adoption even where solar could be financially attractive.

---

## 3. Goals and Success Criteria

### 3.1 MVP goals

1. Deliver an end-to-end user journey from landing page to saved solar estimate.
2. Accept the inputs required by the problem statement: roof area, orientation, shading, location, tariff, and system cost per kW.
3. Add homeowner-friendly electricity inputs, especially monthly electricity bill and optional consumption.
4. Provide a map-based roof drawing flow for estimating roof area.
5. Generate understandable outputs: estimated capacity, annual generation, system cost, annual savings, payback period, and CO₂ offset.
6. Make assumptions and formulas visible.
7. Persist estimates so users can revisit them from a dashboard.
8. Deploy a functional application with live interactive state transitions.
9. Keep the calculation engine deterministic, testable, and independent from the UI.

### 3.2 Hackathon success criteria

A judge should be able to:

1. Open the deployed URL.
2. Create/sign into an account.
3. Create a new estimate.
4. Use location or manually enter a location.
5. Enter or draw a roof area.
6. Select orientation and shading.
7. Enter electricity and cost assumptions.
8. Run the estimate.
9. Inspect the methodology and assumptions.
10. Save the estimate.
11. Open the saved estimate again from the dashboard.

---

## 4. Target User

### Primary user

A homeowner or property owner exploring rooftop solar for a residence.

### Secondary future users

- small commercial property owners;
- landlords;
- farm or farmhouse owners;
- solar installers seeking a lead qualification tool;
- policy/program administrators.

The MVP is optimized for homeowners.

---

# 5. User Journey

```text
Landing Page
    |
    v
Sign In / Sign Up
    |
    v
Dashboard
    |
    v
Estimate New Solar
    |
    +--> 1. Property & Location
    |
    +--> 2. Roof Measurement
    |
    +--> 3. Roof Characteristics
    |
    +--> 4. Electricity & Tariff
    |
    +--> 5. System & Assumptions
    |
    +--> 6. Review
    |
    v
Solar Results
    |
    v
Save Estimate
    |
    v
Dashboard / Saved Estimate
```

---

# 6. Functional Requirements

## 6.1 Screen 1 — Landing Page

### Purpose

Explain the product quickly and drive the user into the estimator.

### Content

- SolOptimizer brand/name.
- Headline: **Know your roof. Know your savings.**
- Supporting copy explaining solar potential, generation, cost, savings, payback, and CO₂ impact.
- Primary CTA: **Estimate My Solar Potential**.
- Secondary CTA: **Sign In**.
- Short explanation of transparent methodology.
- Estimate disclaimer.

### Behavior

- Unauthenticated user clicking Estimate → authentication flow.
- Authenticated user clicking Estimate → new estimate flow.

---

## 6.2 Screen 2 — Authentication

### Supported MVP methods

- Email/password sign-up.
- Email/password sign-in.
- Google OAuth may be enabled if implementation time permits.

### Requirements

- Session persistence.
- Logout.
- Basic validation.
- Protected dashboard and estimate routes.

---

## 6.3 Screen 3 — Dashboard

### Purpose

Provide a persistent home for saved estimates and make creating a new estimate the primary action.

### Components

#### Header

- SolOptimizer logo/name.
- Dashboard navigation.
- Profile/menu.

#### Primary CTA

**+ Estimate New Solar**

#### Latest / Summary section

For users with at least one estimate:

- Estimated capacity.
- Annual generation.
- Annual savings.
- Payback period.
- CO₂ avoided.

The UI must distinguish whether metrics represent the latest estimate or an aggregate across properties. The MVP should use **Latest Estimate** to avoid misleading aggregation.

#### Saved estimates

Each saved estimate card should show:

- Property name.
- City/location.
- Estimated capacity.
- Annual savings.
- Payback period.
- Last updated/created date.
- View action.

#### Empty state

For first-time users:

> No saved estimates yet. Create your first solar estimate to understand your roof's potential.

---

# 7. Estimator Wizard

The estimator should be a guided multi-step flow with visible progress.

Suggested progress labels:

**Property → Roof → Energy → System → Review**

The wizard must support Back/Next navigation and preserve entered values when moving between steps.

---

## 7.1 Step 1 — Property & Location

### Primary question

> **Where is the property you're evaluating?**

### Input options

#### A. Current location

Button:

**Use My Current Location**

On permission, capture coordinates and resolve location data where possible.

#### B. Manual search

Allow entry by:

- City;
- PIN/ZIP code;
- locality/search query.

### Stored data

```ts
location: {
  latitude?: number;
  longitude?: number;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  source: "current_location" | "manual" | "map";
}
```

### System behavior

Location is used to select a solar-resource/irradiance assumption from the application dataset.

The UI should show the selected location and, when available, the solar-resource value used by the engine.

---

## 7.2 Step 2 — Roof Measurement

### Primary question

> **How would you like to estimate your roof area?**

### Method A — Manual area

Inputs:

- Roof area.
- Unit: sq ft / sq m.

### Method B — Draw on map

The user can:

1. Open a map centered on the selected property.
2. Draw a polygon around the roof.
3. Edit/remove the polygon.
4. See calculated roof area.
5. Confirm the area.

### Required output from map mode

```ts
roofGeometry?: GeoJSON.Polygon;
roofAreaSqM: number;
roofAreaSqFt: number;
measurementMethod: "manual" | "map_polygon";
```

### Map UX requirements

- Satellite-style basemap where available.
- Polygon drawing.
- Edit and delete controls.
- Live area display.
- Clear **Use This Area** confirmation.
- Map attribution.
- Mobile-friendly controls.

### MVP limitation

The map drawing feature measures the user-drawn polygon. It does not automatically detect roof boundaries from imagery.

---

## 7.3 Step 3 — Roof Characteristics

### Orientation

Question:

> **Which direction does the roof primarily face?**

Options:

- North
- North-East
- East
- South-East
- South
- South-West
- West
- North-West

### Shading

Question:

> **How much shade does your roof receive during sunlight hours?**

Options:

- Low — little or no obstruction.
- Moderate — some partial shading from trees/buildings.
- High — significant daytime shading.

### Future-ready data fields

The data model may reserve fields for multiple roof planes and obstructions, but the MVP should use a single dominant orientation and shading value.

---

## 7.4 Step 4 — Electricity & Tariff

### Monthly electricity bill

Primary homeowner-friendly input:

- Average monthly electricity bill in INR.

### Optional consumption

- Average monthly consumption in kWh.

### Tariff

Two modes:

- **Use SolOptimizer estimate**.
- **Enter my tariff**.

Custom tariff:

- INR/kWh.

### Behavior

If both bill and consumption are provided, calculate an informational effective energy rate. Do not imply it exactly reproduces utility tariff slabs, fixed charges, taxes, or net-metering rules.

---

## 7.5 Step 5 — System & Assumptions

### Primary user input

System cost per kW.

Default mode:

- Use SolOptimizer estimate.

Optional:

- Custom cost per kW.

### Advanced assumptions

Expose, but collapse by default:

- panel/module efficiency;
- usable roof factor;
- area-per-kW assumption;
- system/performance loss factor;
- orientation factor table;
- shading factor table;
- annual panel degradation;
- CO₂ emissions factor;
- electricity tariff escalation assumption.

Each assumption must have a short explanation.

---

## 7.6 Step 6 — Review

Show all user-entered values before calculation.

Sections:

### Property

- Location.
- Roof area.
- Measurement method.
- Map geometry indicator, when applicable.

### Roof

- Orientation.
- Shading.

### Electricity

- Monthly bill.
- Monthly consumption, if provided.
- Tariff mode/value.

### System

- Cost per kW.
- Key model assumptions.

Each section has an Edit action.

Primary CTA:

**Calculate My Solar Potential**

---

# 8. Calculation Engine

The calculation engine must be implemented as a pure TypeScript module independent of React UI components.

## 8.1 Input contract

```ts
export interface SolarEstimatorInput {
  location: {
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };

  roof: {
    areaSqFt: number;
    orientation:
      | "north"
      | "northEast"
      | "east"
      | "southEast"
      | "south"
      | "southWest"
      | "west"
      | "northWest";
    shading: "low" | "moderate" | "high";
  };

  electricity: {
    monthlyBillINR: number;
    monthlyConsumptionKWh?: number;
    tariffINRPerKWh: number;
  };

  system: {
    costPerKW: number;
  };
}
```

## 8.2 Assumption contract

```ts
export interface SolarAssumptions {
  peakSunHoursPerDay: number;
  panelEfficiency: number;
  usableRoofFactor: number;
  areaPerKWsqFt: number;
  systemPerformanceFactor: number;
  orientationFactors: Record<string, number>;
  shadingFactors: Record<string, number>;
  annualDegradationRate: number;
  co2KgPerKWh: number;
  tariffEscalationRate: number;
}
```

## 8.3 Result contract

```ts
export interface SolarEstimateResult {
  usableRoofAreaSqFt: number;
  estimatedCapacityKW: number;
  annualGenerationKWh: number;
  systemCostINR: number;
  annualSavingsINR: number;
  paybackYears: number;
  annualCO2AvoidedKg: number;
  twentyFiveYearProjection: Array<{
    year: number;
    generationKWh: number;
    savingsINR: number;
    cumulativeSavingsINR: number;
  }>;
  assumptionsUsed: SolarAssumptions;
}
```

---

# 9. Calculation Methodology

The exact assumptions must be configurable rather than hardcoded throughout the UI.

## 9.1 Usable roof area

```text
Usable roof area
= Roof area × usable roof factor
```

Example assumption:

```text
usable roof factor = 0.85
```

This is a model assumption intended to account for spacing, access, and practical non-panel areas.

## 9.2 Estimated system capacity

For MVP:

```text
Estimated capacity (kW)
= Usable roof area (sq ft) ÷ area required per kW (sq ft/kW)
```

The area-per-kW assumption should be configurable in the assumptions dataset.

## 9.3 Annual generation

Primary explainable model:

```text
Annual generation
= Capacity × Peak Sun Hours × 365
  × System Performance Factor
  × Orientation Factor
  × Shading Factor
```

The problem statement describes irradiance × area × efficiency × orientation factor. SolOptimizer may implement an equivalent capacity-based formulation for a more homeowner-friendly model, provided the UI clearly explains the factors used.

If the team chooses an area-efficiency formulation, the formula may instead be expressed as:

```text
Annual generation
= Solar resource × usable area × panel efficiency
  × orientation factor × shading factor × system performance factor
```

The production implementation must choose one primary formula and document it consistently.

## 9.4 System cost

```text
System cost
= Estimated capacity (kW) × cost per kW
```

## 9.5 Annual savings

Baseline MVP formulation:

```text
Annual savings
= Estimated annual generation × tariff
```

This should be labeled **estimated bill-value savings** rather than guaranteed bill reduction, especially where export compensation, net metering, fixed charges, or consumption constraints could materially change the result.

A more advanced future model can split generation into self-consumed and exported energy.

## 9.6 Simple payback

```text
Simple payback (years)
= System cost ÷ annual savings
```

The 25-year projection should use annual degradation and tariff escalation assumptions, making clear that the payback figure is a simple model estimate.

## 9.7 CO₂ avoided

```text
Annual CO₂ avoided
= Annual generation × CO₂ factor
```

The CO₂ factor must be shown as an assumption and tied to the selected dataset/version.

---

# 10. Results Screen

## 10.1 Hero result

Example structure:

> **Your estimated solar potential**
>
> **5.4 kW**
>
> Estimated system size

## 10.2 Primary metrics

- Annual generation — kWh/year.
- Annual bill-value savings — INR/year.
- Estimated system cost — INR.
- Simple payback — years.
- CO₂ avoided — kg or tonnes/year.

## 10.3 Financial visualization

Show:

- initial investment;
- annual/cumulative savings;
- estimated payback point;
- 10/15/25-year view.

## 10.4 Generation visualization

Monthly or annual generation chart using the model outputs.

## 10.5 Methodology section

Must display:

- formula used;
- user inputs;
- derived values;
- assumption values;
- source/dataset version where applicable.

## 10.6 Disclaimer

Prominent text:

> **Estimate only.** Results are based on the inputs and assumptions shown and are not a certified solar audit, engineering design, or installer quotation.

## 10.7 Actions

- **Save Estimate**
- **Edit Inputs**
- **Back to Dashboard**

---

# 11. Saved Estimate Detail

A saved estimate must be reproducible from stored inputs and assumptions.

Display:

1. Property/location.
2. Roof area and measurement method.
3. Roof geometry availability.
4. Orientation and shading.
5. Electricity assumptions.
6. System assumptions.
7. Results.
8. Financial projection.
9. CO₂ impact.
10. Methodology.
11. Created/updated date.
12. Estimator/model version.

The stored estimate should include the assumption snapshot used at calculation time so later assumption changes do not silently rewrite historical estimates.

---

# 12. Data Model

Recommended MVP entities:

## profiles

```text
id
user_id
full_name
created_at
updated_at
```

## properties

```text
id
user_id
name
city
state
country
postal_code
latitude
longitude
created_at
updated_at
```

## solar_estimates

```text
id
user_id
property_id
status
input_payload_json
assumptions_json
result_payload_json
roof_geometry_geojson
model_version
created_at
updated_at
```

A JSON payload is acceptable for the MVP because the calculation model is evolving. Frequently queried fields can be promoted to first-class columns later.

## solar_resource_data

```text
id
location_key
city
state
country
latitude
longitude
peak_sun_hours
source
source_version
updated_at
```

## assumption_sets

```text
id
name
version
payload_json
active
created_at
```

---

# 13. API / Application Services

The application should separate UI orchestration from domain logic.

### Recommended boundaries

```text
UI
 ↓
Server Actions / Route Handlers
 ↓
Solar Domain Service
 ↓
Repository / Supabase
```

### Core domain functions

```ts
calculateSolarEstimate(input, assumptions)
calculateRoofArea(geometry)
getSolarResource(location)
calculateTwentyFiveYearProjection(inputs, assumptions)
```

The calculation engine should not import React, database clients, or browser-only APIs.

---

# 14. Tech Stack

## 14.1 Frontend / Full-stack framework

### Next.js + React + TypeScript

Use **Next.js App Router** with TypeScript.

Why:

- Full-stack React application suitable for a hackathon.
- Server and client components can coexist.
- Route handlers/server actions can handle application operations.
- Simple deployment to Vercel.
- Strong developer ecosystem.

Next.js describes itself as a React framework for building full-stack web applications, and its App Router is the newer routing model. [Next.js Documentation](https://nextjs.org/docs)

## 14.2 Styling

### Tailwind CSS

Use Tailwind CSS for fast, consistent responsive styling.

Add **shadcn/ui** components for accessible primitives and a cohesive application design system.

Tailwind provides a documented Next.js integration path and utility-based styling suitable for this UI-heavy workflow. [Tailwind CSS Documentation](https://tailwindcss.com/docs/installation/framework-guides)

## 14.3 Authentication + Database

### Supabase

Use:

- Supabase Auth for sign-up/sign-in/session management.
- Supabase Postgres for application data.
- Row Level Security (RLS) so users can access only their own estimates.
- Supabase Storage only if future versions need uploads such as roof images or reports.

Supabase Auth supports common authentication methods and integrates with Postgres/RLS; Supabase provides a full Postgres database as the core database service. [Supabase Auth](https://supabase.com/docs/guides/auth) [Supabase Database](https://supabase.com/docs/guides/database/overview)

## 14.4 Mapping

### Mapbox GL JS + mapbox-gl-draw + Turf.js

Use Mapbox for interactive maps and satellite-style visualization.

Use `@mapbox/mapbox-gl-draw` for editable polygon drawing and `@turf/turf` for client-side geospatial area calculations.

Mapbox documents this exact pattern: Mapbox GL JS + mapbox-gl-draw for drawing and Turf.js for area calculation. [Mapbox drawing example](https://docs.mapbox.com/mapbox-gl-js/example/mapbox-gl-draw/)

For future 3D work, the architecture should keep the stored roof geometry as GeoJSON so it can later feed more advanced geospatial/3D processing.

## 14.5 Charts

### Recharts

Use Recharts for:

- cumulative savings;
- generation by month/year;
- payback visualization;
- scenario comparisons.

The chart layer should receive calculation-engine outputs rather than implement financial logic itself.

## 14.6 Validation

### Zod

Use Zod schemas to validate:

- estimator form inputs;
- API/server action payloads;
- stored JSON payloads where appropriate.

This provides a single typed validation contract at application boundaries.

## 14.7 Testing

### Vitest

Unit-test the calculation engine extensively.

Critical cases:

- minimum/maximum roof areas;
- each orientation;
- each shading level;
- custom/default tariffs;
- zero/low electricity usage;
- extremely high roof area;
- invalid values;
- payback when savings are zero;
- annual degradation calculation.

### Playwright

Use Playwright for one end-to-end happy path:

```text
Landing
→ Sign up
→ Dashboard
→ New Estimate
→ Fill form
→ Calculate
→ Save
→ Re-open saved estimate
```

## 14.8 Code quality

- ESLint.
- Prettier.
- TypeScript strict mode.
- Conventional-ish commit messages recommended.
- Environment variables via `.env.local` in development.

## 14.9 Deployment

### Vercel

Deploy the Next.js application on Vercel.

Environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
```

Server-only secrets must never be exposed through `NEXT_PUBLIC_*` variables.

The live URL must be functional without local setup.

---

# 15. Suggested Repository Structure

```text
soloptimizer/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx
│   ├── auth/
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── estimates/[id]/
│   ├── estimate/
│   │   ├── property/
│   │   ├── roof/
│   │   ├── characteristics/
│   │   ├── energy/
│   │   ├── system/
│   │   ├── review/
│   │   └── results/
│   └── api/
│       └── ...
│
├── components/
│   ├── ui/
│   ├── dashboard/
│   ├── estimator/
│   ├── maps/
│   └── charts/
│
├── lib/
│   ├── solar/
│   │   ├── calculator.ts
│   │   ├── assumptions.ts
│   │   ├── projections.ts
│   │   └── types.ts
│   ├── geo/
│   │   └── roof-area.ts
│   ├── supabase/
│   └── validation/
│
├── data/
│   ├── solar-resource.json
│   └── assumptions.json
│
├── tests/
│   ├── unit/
│   └── e2e/
│
├── public/
├── README.md
├── PRD.md
└── package.json
```

---

# 16. UI / UX Principles

## 16.1 Progressive disclosure

Ask homeowners only for information they can realistically know. Keep engineering assumptions in an Advanced section.

## 16.2 Explainability first

Every major result must be traceable to:

```text
Input → Assumption → Formula → Result
```

## 16.3 No black-box outputs

Do not display a result without showing the primary factors behind it.

## 16.4 Mobile-first

The estimator must work comfortably on mobile because homeowners may use it from the property itself.

## 16.5 Visual hierarchy

Results should emphasize:

1. System capacity.
2. Annual generation.
3. Annual savings.
4. Payback.
5. CO₂ avoided.

## 16.6 Error prevention

- Units displayed alongside numerical fields.
- Sensible ranges and validation.
- Human-readable validation messages.
- Review screen before calculation.

---

# 17. Edge Cases

The application must explicitly handle:

### Roof area

- Missing area.
- Zero/negative area.
- Unreasonably large area.
- Polygon not closed or invalid.

### Location

- Location unavailable.
- User denies browser location permission.
- Search returns ambiguous location.
- No matching solar-resource dataset.

### Electricity

- Zero monthly bill.
- Missing tariff.
- Zero or missing consumption.
- Consumption inconsistent with bill.

### Financials

- Annual savings = 0.
- Payback cannot be calculated.
- Extremely high system cost.

In such cases, the UI should say **Payback not meaningful under these assumptions** instead of showing Infinity or an invalid number.

### Map

- User starts but does not finish drawing.
- User draws a self-intersecting polygon.
- User deletes polygon.
- Map service unavailable.

### Authentication

- Session expired.
- User attempts to access another user's estimate.
- Save operation fails.

---

# 18. Security & Privacy

### Requirements

- Never expose service-role Supabase credentials in the browser.
- Enable RLS for user-owned tables.
- Users may read/update/delete only their own estimates and properties.
- Sanitize/validate all client-submitted values on the server boundary.
- Do not store precise location unless needed for the estimate and the user has provided/authorized it.
- Do not collect unnecessary personal data.

### Location privacy

The application should explain that location is used to identify the property and select a solar-resource estimate. Manual location entry must remain available.

---

# 19. Solar Resource Data Strategy

## MVP

Use a versioned JSON/CSV dataset containing reasonable regional solar-resource values.

Example structure:

```json
{
  "Belagavi, Karnataka": {
    "peakSunHoursPerDay": 5.4,
    "source": "simulated_regional_dataset",
    "version": "1.0"
  }
}
```

The exact values and source methodology must be documented in the repository.

## Future

Introduce a pluggable solar-resource provider interface:

```ts
interface SolarResourceProvider {
  getResource(location: Location): Promise<SolarResource>;
}
```

Possible implementations:

- bundled regional dataset;
- public solar-resource API;
- government/open geospatial source;
- commercial solar-resource service.

The calculation engine should not care which provider supplies the resource value.

---

# 20. MVP vs Future Roadmap

## Hackathon MVP

### Must have

- Landing page.
- Authentication.
- Dashboard.
- New Estimate wizard.
- Current/manual location.
- Manual roof area.
- Draw roof polygon on map.
- Orientation.
- Shading.
- Monthly electricity bill.
- Tariff.
- System cost/kW.
- Calculation engine.
- Annual generation.
- Annual savings.
- System cost.
- Payback.
- CO₂ offset.
- 25-year projection.
- Visible methodology.
- Save/reopen estimates.
- Responsive design.
- Live deployment.

## Future v2

- Multiple roof planes.
- Satellite-assisted roof boundary detection.
- Automated building/roof detection.
- Better tariff/net-metering model.
- Subsidy/incentive modeling.
- Self-consumption vs export modeling.
- Installer comparison.
- Report PDF generation.

## Future v3

- 3D roof reconstruction.
- Roof-plane orientation/inclination detection.
- Panel-level placement optimization.
- Detailed shade simulation.
- Weather/irradiance time-series modeling.
- Financial financing/loan scenarios.
- Installer workflow / B2B dashboard.

---

# 21. Demo Scenario

Recommended seeded/demo input for presentation:

```json
{
  "location": {
    "city": "Belagavi",
    "state": "Karnataka",
    "country": "India"
  },
  "roof": {
    "areaSqFt": 1200,
    "orientation": "southEast",
    "shading": "low"
  },
  "electricity": {
    "monthlyBillINR": 3500,
    "monthlyConsumptionKWh": 450,
    "tariffINRPerKWh": 8.5
  },
  "system": {
    "costPerKW": 55000
  }
}
```

The demo should show that changing one input, such as shading or roof area, produces a different result in real time or upon recalculation.

---

# 22. Acceptance Criteria

## Landing

- [ ] Product proposition is understandable without technical knowledge.
- [ ] Primary CTA enters the product journey.
- [ ] Estimate disclaimer is visible.

## Authentication

- [ ] User can sign up.
- [ ] User can sign in.
- [ ] Authenticated routes are protected.

## Dashboard

- [ ] New user sees an empty state.
- [ ] User can create a new estimate.
- [ ] Saved estimates appear after saving.
- [ ] User can reopen a saved estimate.

## Estimator

- [ ] Location can be entered manually.
- [ ] Location can be obtained from browser location permission.
- [ ] Roof area can be entered manually.
- [ ] Roof area can be estimated by drawing on map.
- [ ] Orientation can be selected.
- [ ] Shading can be selected.
- [ ] Electricity bill can be entered.
- [ ] Tariff can be default or custom.
- [ ] Cost/kW can be default or custom.
- [ ] Review screen shows all inputs.

## Calculation

- [ ] Capacity is calculated deterministically.
- [ ] Annual generation is calculated deterministically.
- [ ] System cost is calculated deterministically.
- [ ] Annual savings are calculated deterministically.
- [ ] Payback is calculated deterministically.
- [ ] CO₂ offset is calculated deterministically.
- [ ] 25-year projection is generated.
- [ ] Assumptions are attached to the result.

## Results

- [ ] Primary metrics are visible.
- [ ] Financial chart renders.
- [ ] Generation chart renders.
- [ ] Methodology is visible.
- [ ] Disclaimer is visible.
- [ ] User can save the estimate.

## Security

- [ ] User cannot access another user's saved estimate.
- [ ] No server credential is sent to the browser.
- [ ] All user inputs are validated at the server boundary.

## Deployment

- [ ] Production URL works without local setup.
- [ ] Environment variables are configured.
- [ ] README contains setup/deployment instructions.
- [ ] GitHub repository is public and contains source code and commit history.

---

# 23. Non-Functional Requirements

### Performance

- Main dashboard and form interactions should feel immediate.
- Calculation engine should execute locally/in-process and require no heavyweight external computation.
- Map should load progressively without blocking the entire form.

### Reliability

- Core calculation must work even if optional external data is unavailable, using the bundled solar-resource dataset.
- A failed map load must not prevent manual roof-area estimation.

### Accessibility

- Keyboard navigable forms.
- Visible focus states.
- Semantic labels.
- Sufficient contrast.
- Accessible error messages.
- Touch targets suitable for mobile.

### Observability

For the hackathon, use lightweight application logging for:

- estimate calculation failures;
- save failures;
- map/location failures;
- unexpected validation errors.

Do not log sensitive user data unnecessarily.

---

# 24. Product Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Solar-resource values are oversimplified | Medium | Version data, show source/assumption, label estimates |
| Tariff does not represent actual billing | High | Call it estimated effective rate/bill value; support custom tariff |
| Roof drawing is inaccurate | Medium | Show polygon, measured area, and disclaimer |
| Users interpret payback as guaranteed | High | Explain assumptions and show simple-payback methodology |
| External map provider fails | Medium | Preserve manual area-entry path |
| Overly complex estimator | Medium | Progressive disclosure and guided wizard |
| Calculation logic becomes mixed into UI | High | Keep a pure domain calculation package |

---

# 25. Recommended Implementation Order

## Phase 1 — Foundation

1. Next.js project.
2. TypeScript strict mode.
3. Tailwind + shadcn/ui.
4. Supabase project.
5. Auth and protected routes.
6. Database schema and RLS.

## Phase 2 — Core Domain

1. Solar resource dataset.
2. Assumption set.
3. Input/output types.
4. Calculation engine.
5. Unit tests.
6. 25-year projection.

## Phase 3 — Estimator UI

1. Wizard shell.
2. Property/location.
3. Manual roof area.
4. Map polygon drawing.
5. Orientation/shading.
6. Electricity/tariff.
7. System assumptions.
8. Review.

## Phase 4 — Results & Persistence

1. Results dashboard.
2. Charts.
3. Methodology panel.
4. Save estimate.
5. Saved estimate detail.
6. Dashboard history.

## Phase 5 — Hardening

1. Edge cases.
2. RLS verification.
3. Responsive/mobile QA.
4. Playwright happy path.
5. Production environment configuration.
6. Deployment.
7. README.

---

# 26. Definition of Done

SolOptimizer is MVP-complete when a new user can independently complete the full journey:

```text
Discover SolOptimizer
        ↓
Create account
        ↓
Create estimate
        ↓
Identify property
        ↓
Measure/enter roof area
        ↓
Describe roof
        ↓
Enter electricity information
        ↓
Review assumptions
        ↓
Calculate
        ↓
Understand generation + cost + savings + payback + CO₂
        ↓
Inspect methodology
        ↓
Save estimate
        ↓
Find it again on dashboard
```

The result must be an actual interactive software application, not a static mockup.

---

# 27. Technical Decision Summary

| Area | Decision |
|---|---|
| Framework | Next.js + React + TypeScript |
| Routing | Next.js App Router |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Auth | Supabase Auth |
| Database | Supabase Postgres |
| Authorization | Supabase RLS |
| Maps | Mapbox GL JS |
| Map drawing | mapbox-gl-draw |
| Geospatial calculations | Turf.js |
| Charts | Recharts |
| Validation | Zod |
| Unit tests | Vitest |
| E2E | Playwright |
| Deployment | Vercel |
| Solar data MVP | Versioned regional JSON/CSV |
| Domain engine | Pure TypeScript module |

---

# 28. Key Product Principle

> **SolOptimizer should never make the user trust an unexplained number.**

Every major result should answer:

**What did we assume? → What did we calculate? → How did it affect my result?**

That principle is central to both the product experience and the hackathon evaluation criteria.
