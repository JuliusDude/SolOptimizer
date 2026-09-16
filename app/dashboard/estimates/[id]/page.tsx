"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sun,
  Zap,
  IndianRupee,
  Calendar,
  Leaf,
  MapPin,
  RefreshCw,
  Home,
  Sliders,
} from "lucide-react";
import { SavedEstimateRecord } from "@/lib/solar/types";
import { fetchSavedEstimateById } from "@/lib/supabase/store";
import { formatINR, formatNumber } from "@/lib/utils";
import FinancialProjectionChart from "@/components/charts/FinancialProjectionChart";
import MonthlyGenerationChart from "@/components/charts/MonthlyGenerationChart";
import MethodologyPanel from "@/components/results/MethodologyPanel";
import DisclaimerBanner from "@/components/results/DisclaimerBanner";

export default function SavedEstimateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [estimate, setEstimate] = useState<SavedEstimateRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const rec = await fetchSavedEstimateById(id);
      setEstimate(rec);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#070A11]">
        <div className="flex items-center space-x-2 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
          <span>Loading saved estimate...</span>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <main className="min-h-screen bg-[#070A11] py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-white">Estimate not found</h2>
        <p className="mt-2 text-sm text-slate-400">
          The requested estimate record could not be located.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </main>
    );
  }

  const { input, result, assumptions } = estimate;

  return (
    <main className="min-h-screen bg-[#070A11] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm hover:bg-white/10 transition"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">
                {estimate.propertyName}
              </h1>
              <p className="text-xs text-slate-400">
                Saved on {new Date(estimate.createdAt).toLocaleString("en-IN")} • Model v{assumptions.modelVersion || "1.0.0"}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Result Section */}
        <div className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/10 p-8 shadow-xl">
          <div className="absolute right-0 top-0 h-[400px] w-[400px] -translate-y-1/2 translate-x-1/3 bg-amber-500/10 blur-[120px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-500 border border-amber-500/20 uppercase tracking-wider">
                <Sun className="h-3.5 w-3.5" />
                <span>Historical Estimate Snapshot</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                System Size:{" "}
                <span className="text-amber-500 font-mono">
                  {result.estimatedCapacityKW} kW
                </span>
              </h2>
              <p className="text-sm text-slate-400">
                Location: {input.location.city}, {input.location.state} • Roof:{" "}
                {input.roof.areaSqFt.toLocaleString("en-IN")} sq ft ({input.roof.orientation},{" "}
                {input.roof.shading} shade)
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center rounded-xl bg-[#070A11] p-5 border border-white/5 shadow-inner">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Turnkey Investment
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-1">
                {formatINR(result.systemCostINR)}
              </span>
              <span className="text-[11px] text-slate-500 mt-1">
                @ ₹{input.system.costPerKW.toLocaleString("en-IN")} / kW
              </span>
            </div>
          </div>
        </div>

        {/* 5 Primary Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 shadow-sm hover:border-white/20 transition-colors">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Generation</span>
            <div className="text-xl font-bold font-mono text-white mt-2">
              {formatNumber(result.annualGenerationKWh)}
            </div>
            <span className="text-xs text-slate-500">kWh / year</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 shadow-sm hover:border-white/20 transition-colors">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Savings</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-2">
              {formatINR(result.annualSavingsINR)}
            </div>
            <span className="text-xs text-slate-500">/ year</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 shadow-sm hover:border-white/20 transition-colors">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Payback</span>
            <div className="text-xl font-bold font-mono text-white mt-2">
              {result.paybackYears !== null ? `${result.paybackYears} yrs` : "N/A"}
            </div>
            <span className="text-xs text-slate-500">Simple break-even</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 shadow-sm hover:border-white/20 transition-colors">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">CO₂ Offset</span>
            <div className="text-xl font-bold font-mono text-emerald-500 mt-2">
              {(result.annualCO2AvoidedKg / 1000).toFixed(1)} T
            </div>
            <span className="text-xs text-slate-500">tonnes / yr</span>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5 shadow-sm hover:border-white/20 transition-colors col-span-2 sm:col-span-1">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block">Usable Roof</span>
            <div className="text-xl font-bold font-mono text-white mt-2">
              {result.usableRoofAreaSqFt}
            </div>
            <span className="text-xs text-slate-500">sq ft</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
          {/* Note: Ensure the Chart components themselves are adapted to dark theme via Tailwind config or props if needed */}
          <FinancialProjectionChart
            projection={result.twentyFiveYearProjection}
            systemCostINR={result.systemCostINR}
            paybackYears={result.paybackYears}
          />
          <MonthlyGenerationChart
            monthlyGenerationKWh={result.monthlyGenerationKWh}
            annualGenerationKWh={result.annualGenerationKWh}
          />
        </div>

        {/* Transparent Methodology */}
        <MethodologyPanel result={result} />

        {/* Official Disclaimer */}
        <DisclaimerBanner />
      </div>
    </main>
  );
}
