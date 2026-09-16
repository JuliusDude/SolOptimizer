"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Sun,
  Zap,
  TrendingUp,
  Leaf,
  ArrowRight,
  Code2,
  ChevronDown,
  ChevronUp,
  MapPin,
  Sliders,
  Sparkles,
} from "lucide-react";
import { calculateSolarEstimate } from "@/lib/solar/calculator";
import { SolarEstimatorInput } from "@/lib/solar/types";
import { formatINR, formatNumber } from "@/lib/utils";

interface CityPreset {
  name: string;
  state: string;
  psh: number;
  lat: number;
  lng: number;
  tariff: number;
}

const CITIES: CityPreset[] = [
  { name: "Belagavi", state: "Karnataka", psh: 5.4, lat: 15.8497, lng: 74.4977, tariff: 8.5 },
  { name: "Bengaluru", state: "Karnataka", psh: 5.3, lat: 12.9716, lng: 77.5946, tariff: 8.5 },
  { name: "Delhi", state: "Delhi", psh: 5.1, lat: 28.7041, lng: 77.1025, tariff: 7.8 },
  { name: "Mumbai", state: "Maharashtra", psh: 5.2, lat: 19.076, lng: 72.8777, tariff: 9.2 },
  { name: "Jaipur", state: "Rajasthan", psh: 5.6, lat: 26.9124, lng: 75.7873, tariff: 8.1 },
];

export default function LiveFormulaSandbox() {
  const router = useRouter();
  const [areaSqFt, setAreaSqFt] = useState<number>(1200);
  const [selectedCity, setSelectedCity] = useState<CityPreset>(CITIES[0]);
  const [monthlyBill, setMonthlyBill] = useState<number>(3500);
  const [showFormulaDetails, setShowFormulaDetails] = useState<boolean>(false);

  // Compute live estimate using pure deterministic calculation engine
  const calculation = useMemo(() => {
    const input: SolarEstimatorInput = {
      location: {
        city: selectedCity.name,
        state: selectedCity.state,
        country: "India",
        latitude: selectedCity.lat,
        longitude: selectedCity.lng,
      },
      roof: {
        areaSqFt,
        areaSqM: Math.round((areaSqFt * 0.092903) * 100) / 100,
        measurementMethod: "manual",
        orientation: "south",
        shading: "low",
      },
      electricity: {
        monthlyBillINR: monthlyBill,
        tariffINRPerKWh: selectedCity.tariff,
        isCustomTariff: false,
      },
      system: {
        costPerKW: 55000,
        isCustomCost: false,
      },
    };

    const result = calculateSolarEstimate(input, { peakSunHoursPerDay: selectedCity.psh });
    return { input, result };
  }, [areaSqFt, selectedCity, monthlyBill]);

  const { input, result } = calculation;

  const handleLaunchDeepAnalysis = () => {
    sessionStorage.setItem(
      "soloptimizer_active_calculation",
      JSON.stringify({
        input,
        result,
        assumptions: result.assumptionsUsed,
      })
    );
    router.push("/estimate/results");
  };

  return (
    <section className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Deterministic Math, in Real Time.
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Test your roof dimensions and regional irradiance below. Every metric is computed
          live using MNRE-standard equations without guesswork or proprietary black boxes.
        </p>
      </div>

      {/* Main Sandbox Container */}
      <div className="rounded-2xl border border-white/10 bg-[#0F172A]/70 backdrop-blur-xl shadow-2xl p-6 sm:p-8 lg:p-10 space-y-8">
        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Control 1: Roof Area Slider */}
          <div className="space-y-3 bg-[#070A11]/60 border border-white/[0.08] p-5 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Roof Area
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {formatNumber(areaSqFt)} sq ft
              </span>
            </div>
            <input
              type="range"
              min={400}
              max={3500}
              step={50}
              value={areaSqFt}
              onChange={(e) => setAreaSqFt(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>400 sq ft</span>
              <span>{(areaSqFt * 0.0929).toFixed(0)} m²</span>
              <span>3,500 sq ft</span>
            </div>
          </div>

          {/* Control 2: Regional Irradiance / City */}
          <div className="space-y-3 bg-[#070A11]/60 border border-white/[0.08] p-5 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Location & Irradiance
              </label>
              <span className="text-xs font-mono text-emerald-400 font-semibold">
                {selectedCity.psh} PSH
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {CITIES.map((city) => (
                <button
                  key={city.name}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-2 py-1.5 text-xs font-mono rounded-lg border transition-all ${
                    selectedCity.name === city.name
                      ? "bg-amber-400 text-slate-950 font-bold border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                      : "border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-slate-500 flex items-center gap-1 pt-0.5">
              <MapPin className="size-3 text-amber-400" />
              <span>{selectedCity.lat.toFixed(2)}° N, {selectedCity.lng.toFixed(2)}° E</span>
            </p>
          </div>

          {/* Control 3: Monthly Electricity Bill */}
          <div className="space-y-3 bg-[#070A11]/60 border border-white/[0.08] p-5 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                Monthly Electric Bill
              </label>
              <span className="text-sm font-bold text-amber-400 font-mono">
                {formatINR(monthlyBill)}
              </span>
            </div>
            <input
              type="range"
              min={1000}
              max={15000}
              step={250}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>₹1,000/mo</span>
              <span>Tariff: ₹{selectedCity.tariff}/kWh</span>
              <span>₹15,000/mo</span>
            </div>
          </div>
        </div>

        {/* Real-time KPI Result Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: System Size */}
          <div className="bg-[#070A11]/80 border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden group hover:border-amber-400/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">CAPACITY</span>
              <Sun className="size-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {result.estimatedCapacityKW}{" "}
              <span className="text-xs font-normal text-slate-400">kW</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {formatNumber(result.usableRoofAreaSqFt)} sq ft usable panel area
            </p>
          </div>

          {/* KPI 2: Annual Generation */}
          <div className="bg-[#070A11]/80 border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden group hover:border-amber-400/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">ANNUAL GENERATION</span>
              <Zap className="size-4 text-solar-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatNumber(result.annualGenerationKWh)}{" "}
              <span className="text-xs font-normal text-slate-400">kWh</span>
            </div>
            <p className="text-[11px] text-slate-400">
              ~{formatNumber(Math.round(result.annualGenerationKWh / 12))} kWh / month average
            </p>
          </div>

          {/* KPI 3: 25-Year Net Benefit */}
          <div className="bg-[#070A11]/80 border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden group hover:border-emerald-400/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">25-YR BENEFIT</span>
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              {formatINR(result.twentyFiveYearProjection[24]?.cumulativeSavingsINR ?? 0)}
            </div>
            <p className="text-[11px] text-slate-400">
              Payback in ~{result.paybackYears ? `${result.paybackYears.toFixed(1)} years` : "N/A"}
            </p>
          </div>

          {/* KPI 4: Carbon Offset */}
          <div className="bg-[#070A11]/80 border border-white/10 p-5 rounded-xl space-y-1 relative overflow-hidden group hover:border-emerald-400/40 transition">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">CO₂ ABATEMENT</span>
              <Leaf className="size-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {formatNumber(Math.round(result.annualCO2AvoidedKg / 1000), 1)}{" "}
              <span className="text-xs font-normal text-slate-400">T/yr</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {formatNumber(result.annualCO2AvoidedKg)} kg clean grid displacement
            </p>
          </div>
        </div>

        {/* Math Inspection Accordion */}
        <div className="border border-white/10 rounded-xl bg-[#070A11]/40 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="w-full px-5 py-3.5 flex items-center justify-between text-left text-xs font-mono text-slate-300 hover:text-white hover:bg-white/5 transition"
          >
            <div className="flex items-center gap-2">
              <Code2 className="size-4 text-amber-400" />
              <span className="font-bold">INSPECT DETERMINISTIC FORMULAS FOR THIS RUN</span>
            </div>
            {showFormulaDetails ? (
              <ChevronUp className="size-4 text-slate-400" />
            ) : (
              <ChevronDown className="size-4 text-slate-400" />
            )}
          </button>

          {showFormulaDetails && (
            <div className="p-5 border-t border-white/10 space-y-3 text-xs font-mono text-slate-400 bg-black/40">
              <div className="space-y-1">
                <span className="text-slate-200 font-semibold">1. Usable Panel Area:</span>
                <p className="text-slate-400 pl-3">
                  {areaSqFt} sq ft × 0.80 (20% set-back factor) ={" "}
                  <span className="text-amber-300">{result.usableRoofAreaSqFt} sq ft</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-semibold">2. System Capacity:</span>
                <p className="text-slate-400 pl-3">
                  {result.usableRoofAreaSqFt} sq ft ÷ 100 sq ft/kW ={" "}
                  <span className="text-amber-300">{result.estimatedCapacityKW} kW</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-semibold">3. Annual Output:</span>
                <p className="text-slate-400 pl-3">
                  {result.estimatedCapacityKW} kW × {selectedCity.psh} PSH × 365 days × 0.78 (PR) ={" "}
                  <span className="text-amber-300">{formatNumber(result.annualGenerationKWh)} kWh</span>
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-slate-200 font-semibold">4. Lifetime Financial ROI:</span>
                <p className="text-slate-400 pl-3">
                  System Cost: {formatINR(result.systemCostINR)} | 25-Year Compound Savings:{" "}
                  <span className="text-emerald-400 font-bold">{formatINR(result.twentyFiveYearProjection[24]?.cumulativeSavingsINR ?? 0)}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Direct Action Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-400">
            Want to draw your exact roof boundaries on satellite imagery instead of entering a rough area?
          </p>
          <button
            type="button"
            onClick={handleLaunchDeepAnalysis}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 px-6 py-3 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)] transition active:scale-95 whitespace-nowrap"
          >
            <span>Run Full 25-Year Deep Analysis</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
