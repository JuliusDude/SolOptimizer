"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { calculateSolarEstimate } from "@/lib/solar/calculator";
import { SolarEstimatorInput } from "@/lib/solar/types";
import Hero14 from "@/components/ui/hero-14";
import LiveFormulaSandbox from "@/components/landing/LiveFormulaSandbox";
import EngineeringPipeline from "@/components/landing/EngineeringPipeline";
import TrustMatrix from "@/components/landing/TrustMatrix";
import { Navigation5 } from "@/components/landing/Navigation5";

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
        orientation: "south",
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
    <main className="min-h-screen bg-[#070A11] text-white selection:bg-amber-400 selection:text-slate-950 overflow-hidden">
      
      {/* 0. Top Navigation */}
      <Navigation5 />

      {/* 1. Hero Section (UnicornStudio 3D ASCII + Editorial Typography) */}
      <Hero14
        showNav={false}
        showAsciiBackground={true}
        showTelemetryHUD={true}
        badgeText="Problem Statement PS03 • Sustainable Energy"
        headingLine1="Know your roof."
        headingLine2="Know your savings."
        description="SolOptimizer guides homeowners to discover rooftop solar feasibility, calculate precise system capacity, forecast 25-year compounding returns, and offset CO₂ emissions with 100% explainable calculations."
        primaryCtaLabel="Estimate My Solar Potential"
        primaryCtaHref="/estimate"
        demoLabel="Run Instant Demo (Belagavi 1,200 sq ft)"
        onDemoClick={handleLaunchDemo}
        partnerEyebrow="Engineered with verified benchmarks & open geospatial frameworks"
        partners={[
          { name: "MNRE Benchmarks", mark: "sun" },
          { name: "Mapbox Geodesy", mark: "map" },
          { name: "NASA Irradiance", mark: "zap" },
          { name: "Supabase RLS", mark: "database" },
          { name: "Turf.js Satellite", mark: "shield" },
        ]}
      />

      {/* 2. Interactive Live Formula & Irradiance Sandbox */}
      <div className="relative">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full" />
        <LiveFormulaSandbox />
      </div>

      {/* 3. 3-Phase Solar Intelligence Architecture */}
      <div className="relative border-t border-white/[0.06]">
        <div className="pointer-events-none absolute top-1/2 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full" />
        <EngineeringPipeline />
      </div>

      {/* 4. Transparency & Trust Tenets */}
      <div className="relative border-t border-white/[0.06]">
        <TrustMatrix />
      </div>

      {/* 5. Final High-Converting Terminal CTA */}
      <section className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="relative rounded-3xl border border-amber-400/20 bg-gradient-to-b from-[#0F172A]/90 via-[#0B0F19] to-[#070A11] p-10 sm:p-14 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
          {/* Subtle amber ambient glow behind card */}
          <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-amber-500/15 blur-[80px] rounded-full" />

          <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Discover Your Home's Clean Energy Potential?
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Draw your exact rooftop boundaries on satellite imagery, compute system capacity,
              and view a 25-year financial breakdown in under 3 minutes.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/estimate"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 px-8 py-4 text-sm font-bold text-slate-950 shadow-[0_0_24px_rgba(245,158,11,0.35)] transition active:scale-95"
              >
                <Sun className="size-4 text-slate-950" />
                <span>Start Guided Assessment</span>
                <ArrowRight className="size-4" />
              </Link>

              <button
                type="button"
                onClick={handleLaunchDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-7 py-4 text-sm font-medium text-white backdrop-blur-sm transition active:scale-95"
              >
                <span>Run Instant Demo (Belagavi)</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-emerald-400" />
                <span>No phone number required</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-400" />
                <span>Instant calculations</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
