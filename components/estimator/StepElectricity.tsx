"use client";

import React from "react";
import { Zap, IndianRupee, Info } from "lucide-react";
import { ElectricityDetails } from "@/lib/solar/types";
import { formatINR } from "@/lib/utils";

interface StepElectricityProps {
  electricity: ElectricityDetails;
  onChange: (electricity: ElectricityDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepElectricity({
  electricity,
  onChange,
  onNext,
  onBack,
}: StepElectricityProps) {
  const effectiveRate =
    electricity.monthlyConsumptionKWh && electricity.monthlyConsumptionKWh > 0
      ? Math.round((electricity.monthlyBillINR / electricity.monthlyConsumptionKWh) * 100) / 100
      : null;

  const isValid = electricity.monthlyBillINR >= 0 && electricity.tariffINRPerKWh > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          How much do you pay for electricity?
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Your utility tariff and monthly bill calculate how much solar power can save you each year.
        </p>
      </div>

      {/* 1. Monthly Bill */}
      <div className="rounded-xl border border-white/10 bg-[#070A11] p-6 shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-slate-200">
          Average Monthly Electricity Bill (₹ INR) <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="number"
            min="0"
            step="100"
            value={electricity.monthlyBillINR || ""}
            onChange={(e) =>
              onChange({
                ...electricity,
                monthlyBillINR: Number(e.target.value),
              })
            }
            placeholder="e.g. 3500"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-2xl font-mono font-bold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <span className="absolute right-4 top-3.5 font-mono text-sm font-semibold text-slate-400">
            ₹ / month
          </span>
        </div>

        {/* Quick buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {[1500, 2500, 3500, 5000, 8000, 12000].map((val) => (
            <button
              key={val}
              type="button"
              onClick={() => onChange({ ...electricity, monthlyBillINR: val })}
              className={`rounded-md border px-3 py-1 text-xs font-medium transition ${
                electricity.monthlyBillINR === val
                  ? "border-amber-500/50 bg-amber-500/5 text-amber-500 font-bold"
                  : "border-white/10 bg-[#070A11] text-slate-400 hover:bg-white/5"
              }`}
            >
              {formatINR(val)}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Optional Consumption */}
      <div className="rounded-xl border border-white/10 bg-[#070A11] p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-semibold text-slate-200">
            Monthly Consumption (Optional)
          </label>
          <span className="text-xs text-slate-400">Found on utility electricity bill</span>
        </div>
        <div className="relative">
          <input
            type="number"
            min="0"
            value={electricity.monthlyConsumptionKWh || ""}
            onChange={(e) =>
              onChange({
                ...electricity,
                monthlyConsumptionKWh: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            placeholder="e.g. 450"
            className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-mono font-bold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <span className="absolute right-4 top-2.5 font-mono text-sm font-medium text-slate-400">
            kWh / units
          </span>
        </div>

        {effectiveRate !== null && (
          <p className="text-xs text-emerald-400 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20">
            Your informational effective electricity rate: <strong>₹{effectiveRate} / kWh</strong>
          </p>
        )}
      </div>

      {/* 3. Tariff Mode */}
      <div className="rounded-xl border border-white/10 bg-[#070A11] p-6 shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-slate-200">
          Grid Electricity Tariff
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onChange({
                ...electricity,
                isCustomTariff: false,
                tariffINRPerKWh: 8.0,
              })
            }
            className={`flex flex-col rounded-xl border p-4 text-left transition ${
              !electricity.isCustomTariff
                ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50"
                : "border-white/10 bg-[#070A11] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                SolOptimizer Standard Tariff
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                ₹8.00 / kWh
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Benchmark average residential tariff across tier-1 and tier-2 Indian discoms.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              onChange({
                ...electricity,
                isCustomTariff: true,
              })
            }
            className={`flex flex-col rounded-xl border p-4 text-left transition ${
              electricity.isCustomTariff
                ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50"
                : "border-white/10 bg-[#070A11] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                Enter Custom Tariff
              </span>
              <span className="text-xs font-medium text-slate-400">
                Specify exact rate
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Use the exact rate per unit from your state electricity distribution company.
            </p>
          </button>
        </div>

        {electricity.isCustomTariff && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Custom Tariff (₹ INR / kWh)
            </label>
            <div className="relative max-w-xs">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={electricity.tariffINRPerKWh || ""}
                onChange={(e) =>
                  onChange({
                    ...electricity,
                    tariffINRPerKWh: Number(e.target.value),
                  })
                }
                placeholder="e.g. 8.5"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-mono font-bold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute right-3 top-2 font-mono text-xs font-medium text-slate-400">
                ₹ / kWh
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tariff Informational Note */}
      <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-3.5 text-xs text-slate-400">
        <Info className="h-4 w-4 flex-shrink-0 text-slate-400 mt-0.5" />
        <span>
          <strong>Informational Energy Rate:</strong> Savings calculations evaluate the bill value of
          the generated power. Actual utility billing may include fixed charges, tiered slab rates,
          and net metering fees.
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-white/10 bg-[#070A11] px-5 py-2.5 text-sm font-medium text-slate-300 shadow-sm hover:bg-white/5 transition"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 text-slate-950 disabled:opacity-40 transition"
        >
          Next: System & Assumptions →
        </button>
      </div>
    </div>
  );
}
