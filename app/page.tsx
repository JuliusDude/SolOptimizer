"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sun,
  Zap,
  IndianRupee,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Leaf,
  Layers,
} from "lucide-react";
import { calculateSolarEstimate } from "@/lib/solar/calculator";
import { SolarEstimatorInput } from "@/lib/solar/types";
import { formatINR } from "@/lib/utils";

export default function LandingPage() {
  const router = useRouter();

  const handleLaunchDemo = () => {
    const demoInput: SolarEstimatorInput = {
      location: {
        city: "Belagavi",
        state: "Karnataka",
        country: "India",
        latitude: 15.8497,
        longitude: 74.4977,
      },
      roof: {
        areaSqFt: 1200,
        areaSqM: 111.48,
        measurementMethod: "manual",
        orientation: "southEast",
        shading: "low",
      },
      electricity: {
        monthlyBillINR: 3500,
        monthlyConsumptionKWh: 450,
        tariffINRPerKWh: 8.5,
        isCustomTariff: false,
      },
      system: {
        costPerKW: 55000,
        isCustomCost: false,
      },
    };

    const res = calculateSolarEstimate(demoInput, { peakSunHoursPerDay: 5.4 });

    sessionStorage.setItem(
      "soloptimizer_active_calculation",
      JSON.stringify({
        input: demoInput,
        result: res,
        assumptions: res.assumptionsUsed,
      })
    );

    router.push("/estimate/results");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-slate-50 to-slate-50 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 rounded-full border border-solar-300 bg-white/80 px-4 py-1.5 text-xs font-semibold text-solar-800 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-solar-600" />
            <span>Problem Statement PS03 • Sustainable Energy</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-950 max-w-3xl mx-auto leading-tight sm:leading-tight">
            Know your roof. <br />
            <span className="bg-gradient-to-r from-solar-600 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              Know your savings.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            SolOptimizer guides homeowners to discover rooftop solar feasibility, calculate
            precise system capacity, forecast 25-year financial savings, and offset CO₂ emissions
            with 100% explainable, transparent calculations.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/estimate"
              className="inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-7 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition transform active:scale-95"
            >
              <Sun className="h-4 w-4 text-solar-400" />
              <span>Estimate My Solar Potential</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center space-x-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 transition"
            >
              <Sparkles className="h-4 w-4 text-solar-500" />
              <span>Run Instant Demo (Belagavi 1,200 sq ft)</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-xs font-medium text-slate-500">
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-eco-600" />
              <span>No Black-Box Estimations</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-eco-600" />
              <span>Satellite Roof Area Polygon Drawing</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <CheckCircle2 className="h-4 w-4 text-eco-600" />
              <span>25-Year Compound Financial Model</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Section */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Why Homeowners Love SolOptimizer
            </h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              Empowering consumers to evaluate rooftop investments before speaking with solar sales contractors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-3 bg-slate-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Interactive Roof Polygon
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Draw your roof directly on high-resolution Mapbox satellite imagery. We calculate real surface
                area in sq ft and sq m using geodesic Turf.js algorithms.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-3 bg-slate-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-solar-100 text-solar-800">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Deterministic & Explainable
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every calculation reveals its exact math: peak sun hours, orientation factors, shading
                penalties, and system degradation rates. No hidden guesswork.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-slate-200 p-6 space-y-3 bg-slate-50/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-eco-100 text-eco-800">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                25-Year Financial Projection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See exactly when your rooftop solar crosses into net positive returns, modeling panel degradation
                and utility tariff inflation over a quarter century.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guided Steps Overview */}
      <section className="py-16 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Guided 6-Step Solar Assessment
            </h2>
            <p className="text-sm text-slate-500">
              Simple for homeowners, powered by rigorous renewable energy engineering.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { num: "01", title: "Location", desc: "Regional irradiance lookup" },
              { num: "02", title: "Roof Area", desc: "Map polygon or manual input" },
              { num: "03", title: "Orientation", desc: "Compass azimuth & shade" },
              { num: "04", title: "Electricity", desc: "Monthly bill & tariff" },
              { num: "05", title: "System Cost", desc: "EPC quote benchmarks" },
              { num: "06", title: "Review", desc: "Instant transparent results" },
            ].map((st) => (
              <div
                key={st.num}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-1"
              >
                <span className="text-xs font-mono font-bold text-solar-600">
                  {st.num}
                </span>
                <h4 className="text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="text-[11px] text-slate-500">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              href="/estimate"
              className="inline-flex items-center space-x-2 rounded-xl bg-solar-500 px-8 py-3.5 text-sm font-bold text-slate-950 shadow-md hover:bg-solar-400 transition"
            >
              <span>Start Your Free Solar Estimate</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
