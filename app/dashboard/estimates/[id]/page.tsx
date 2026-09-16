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
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-600">
          <RefreshCw className="h-5 w-5 animate-spin text-solar-500" />
          <span>Loading saved estimate...</span>
        </div>
      </div>
    );
  }

  if (!estimate) {
    return (
      <main className="min-h-screen bg-slate-50 py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-900">Estimate not found</h2>
        <p className="mt-2 text-sm text-slate-500">
          The requested estimate record could not be located.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center space-x-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Dashboard</span>
        </Link>
      </main>
    );
  }

  const { input, result, assumptions } = estimate;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Dashboard</span>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {estimate.propertyName}
              </h1>
              <p className="text-xs text-slate-500">
                Saved on {new Date(estimate.createdAt).toLocaleString("en-IN")} • Model v{assumptions.modelVersion || "1.0.0"}
              </p>
            </div>
          </div>
        </div>

        {/* Hero Result Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 rounded-full bg-solar-500/20 px-3 py-1 text-xs font-semibold text-solar-300 border border-solar-500/30">
                <Sun className="h-3.5 w-3.5 text-solar-400" />
                <span>Historical Estimate Snapshot</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                System Size:{" "}
                <span className="text-solar-400 font-mono">
                  {result.estimatedCapacityKW} kW
                </span>
              </h2>
              <p className="text-sm text-slate-300">
                Location: {input.location.city}, {input.location.state} • Roof:{" "}
                {input.roof.areaSqFt.toLocaleString("en-IN")} sq ft ({input.roof.orientation},{" "}
                {input.roof.shading} shade)
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-md border border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Turnkey Investment
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
                {formatINR(result.systemCostINR)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                @ ₹{input.system.costPerKW.toLocaleString("en-IN")} / kW
              </span>
            </div>
          </div>
        </div>

        {/* 5 Primary Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500 block">Generation</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-2">
              {formatNumber(result.annualGenerationKWh)}
            </div>
            <span className="text-xs text-slate-500">kWh / year</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500 block">Savings</span>
            <div className="text-xl font-bold font-mono text-eco-700 mt-2">
              {formatINR(result.annualSavingsINR)}
            </div>
            <span className="text-xs text-slate-500">/ year</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500 block">Payback</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-2">
              {result.paybackYears !== null ? `${result.paybackYears} yrs` : "N/A"}
            </div>
            <span className="text-xs text-slate-500">Simple break-even</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <span className="text-xs font-bold uppercase text-slate-500 block">CO₂ Offset</span>
            <div className="text-xl font-bold font-mono text-emerald-700 mt-2">
              {(result.annualCO2AvoidedKg / 1000).toFixed(1)} T
            </div>
            <span className="text-xs text-slate-500">tonnes / yr</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-xs font-bold uppercase text-slate-500 block">Usable Roof</span>
            <div className="text-xl font-bold font-mono text-slate-900 mt-2">
              {result.usableRoofAreaSqFt}
            </div>
            <span className="text-xs text-slate-500">sq ft</span>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6">
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
