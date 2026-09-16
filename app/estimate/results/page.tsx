"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sun,
  Zap,
  IndianRupee,
  Calendar,
  Leaf,
  Bookmark,
  ArrowLeft,
  CheckCircle,
  LayoutDashboard,
  Share2,
  RefreshCw,
} from "lucide-react";
import {
  SolarAssumptions,
  SolarEstimateResult,
  SolarEstimatorInput,
} from "@/lib/solar/types";
import { calculateSolarEstimate } from "@/lib/solar/calculator";
import { persistSolarEstimate } from "@/lib/supabase/store";
import { formatINR, formatNumber } from "@/lib/utils";
import FinancialProjectionChart from "@/components/charts/FinancialProjectionChart";
import MonthlyGenerationChart from "@/components/charts/MonthlyGenerationChart";
import MethodologyPanel from "@/components/results/MethodologyPanel";
import DisclaimerBanner from "@/components/results/DisclaimerBanner";

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    input: SolarEstimatorInput;
    result: SolarEstimateResult;
    assumptions: SolarAssumptions;
  } | null>(null);

  const [propertyName, setPropertyName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("soloptimizer_active_calculation");
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        setPropertyName(`${parsed.input.location.city} Rooftop`);
        return;
      }
    } catch (err) {
      console.error("Failed to read calculation from session", err);
    }

    // Default demo fallback (Belagavi scenario)
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
    setData({
      input: demoInput,
      result: res,
      assumptions: res.assumptionsUsed,
    });
    setPropertyName("Belagavi Home Rooftop");
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center space-x-2 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
          <span>Generating your solar potential...</span>
        </div>
      </div>
    );
  }

  const { input, result, assumptions } = data;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await persistSolarEstimate({
        propertyName: propertyName.trim() || `${input.location.city} Solar`,
        input,
        assumptions,
        result,
      });
      setSavedSuccess(true);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#070A11] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => router.push("/estimate")}
              className="inline-flex items-center space-x-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs font-medium text-slate-300 shadow-sm hover:bg-[#070A11]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Edit Inputs</span>
            </button>
            <span className="text-xs text-slate-400">
              Property: <strong>{input.location.city}, {input.location.state}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center space-x-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2 text-xs font-semibold text-slate-300 shadow-sm hover:bg-[#070A11]"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || savedSuccess}
              className={`inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-xs font-bold shadow transition ${
                savedSuccess
                  ? "bg-emerald-500 text-white"
                  : "bg-amber-500 text-white hover:bg-amber-400"
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  <span>Estimate Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="h-4 w-4 text-amber-400" />
                  <span>{isSaving ? "Saving..." : "Save to Dashboard"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Hero Result Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950 p-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 rounded-lg bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 border border-amber-500/20">
                <Sun className="h-3.5 w-3.5 text-amber-400" />
                <span>Estimated Solar Feasibility Assessment</span>
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Your Roof Potential:{" "}
                <span className="text-amber-400 font-mono">
                  {result.estimatedCapacityKW} kW
                </span>
              </h1>
              <p className="text-sm text-slate-300 max-w-xl">
                Based on your {input.roof.areaSqFt.toLocaleString("en-IN")} sq ft roof in{" "}
                {input.location.city}, this system can cover up to{" "}
                <strong className="text-white">
                  {Math.min(100, Math.round((result.annualGenerationKWh / ((input.electricity.monthlyConsumptionKWh || 450) * 12)) * 100))}%
                </strong>{" "}
                of your annual electricity needs.
              </p>
            </div>

            <div className="flex flex-col items-start md:items-end justify-center rounded-2xl bg-white/[0.02]/10 p-5 backdrop-blur-md border border-white/10">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Turnkey Investment
              </span>
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white mt-0.5">
                {formatINR(result.systemCostINR)}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                @ ₹{input.system.costPerKW.toLocaleString("en-IN")} / kW (all-inclusive)
              </span>
            </div>
          </div>
        </div>

        {/* 5 Primary Metrics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* 1. Annual Generation */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Generation</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-white">
                {formatNumber(result.annualGenerationKWh)}
              </div>
              <span className="text-xs font-medium text-slate-400">kWh / year</span>
            </div>
          </div>

          {/* 2. Annual Savings */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Bill Savings</span>
              <IndianRupee className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {formatINR(result.annualSavingsINR)}
              </div>
              <span className="text-xs font-medium text-slate-400">estimated / year</span>
            </div>
          </div>

          {/* 3. Simple Payback */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Payback</span>
              <Calendar className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-white">
                {result.paybackYears !== null ? `${result.paybackYears} yrs` : "N/A"}
              </div>
              <span className="text-xs font-medium text-slate-400">Simple break-even</span>
            </div>
          </div>

          {/* 4. CO2 Avoided */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">CO₂ Offset</span>
              <Leaf className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-emerald-700">
                {(result.annualCO2AvoidedKg / 1000).toFixed(1)} T
              </div>
              <span className="text-xs font-medium text-slate-400">
                tonnes CO₂ / year
              </span>
            </div>
          </div>

          {/* 5. Usable Area */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 shadow-sm flex flex-col justify-between col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Usable Roof</span>
              <Sun className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold font-mono text-white">
                {result.usableRoofAreaSqFt}
              </div>
              <span className="text-xs font-medium text-slate-400">
                sq ft (85% usable)
              </span>
            </div>
          </div>
        </div>

        {/* Visualizations */}
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
