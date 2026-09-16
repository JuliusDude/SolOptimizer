"use client";

import React, { useState } from "react";
import { Sliders, ChevronDown, ChevronUp, Settings2, Info } from "lucide-react";
import { SolarAssumptions, SystemAssumptionsInput } from "@/lib/solar/types";
import { formatINR } from "@/lib/utils";

interface StepSystemAssumptionsProps {
  system: SystemAssumptionsInput;
  assumptions: Partial<SolarAssumptions>;
  onChangeSystem: (system: SystemAssumptionsInput) => void;
  onChangeAssumptions: (assumptions: Partial<SolarAssumptions>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepSystemAssumptions({
  system,
  assumptions,
  onChangeSystem,
  onChangeAssumptions,
  onNext,
  onBack,
}: StepSystemAssumptionsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Installation Cost & System Assumptions
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Configure capital expenditure per kilowatt and inspect our transparent engineering assumptions.
        </p>
      </div>

      {/* 1. System Cost per kW */}
      <div className="rounded-xl border border-white/10 bg-[#070A11] p-6 shadow-sm space-y-4">
        <label className="block text-sm font-semibold text-slate-200">
          Estimated System Cost per kW (Turnkey EPC)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              onChangeSystem({
                isCustomCost: false,
                costPerKW: 55000,
              })
            }
            className={`flex flex-col rounded-xl border p-4 text-left transition ${
              !system.isCustomCost
                ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50"
                : "border-white/10 bg-[#070A11] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                SolOptimizer Standard Cost
              </span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg">
                ₹55,000 / kW
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Benchmark turnkey cost including high-efficiency tier-1 panels, on-grid inverter, mounting structure & commissioning.
            </p>
          </button>

          <button
            type="button"
            onClick={() =>
              onChangeSystem({
                ...system,
                isCustomCost: true,
              })
            }
            className={`flex flex-col rounded-xl border p-4 text-left transition ${
              system.isCustomCost
                ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50"
                : "border-white/10 bg-[#070A11] hover:border-white/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-white">
                Custom Installer Quote
              </span>
              <span className="text-xs font-medium text-slate-400">
                Specify exact rate
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Use a quotation received from your local EPC contractor or installer.
            </p>
          </button>
        </div>

        {system.isCustomCost && (
          <div className="pt-2">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Custom Cost per kW (₹ INR / kW)
            </label>
            <div className="relative max-w-xs">
              <input
                type="number"
                min="10000"
                step="1000"
                value={system.costPerKW || ""}
                onChange={(e) =>
                  onChangeSystem({
                    ...system,
                    costPerKW: Number(e.target.value),
                  })
                }
                placeholder="e.g. 50000"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm font-mono font-bold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <span className="absolute right-3 top-2 font-mono text-xs font-medium text-slate-400">
                ₹ / kW
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Advanced Engineering Assumptions (Collapsible) */}
      <div className="rounded-xl border border-white/10 bg-[#070A11] overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex w-full items-center justify-between bg-white/5 px-6 py-4 text-left text-sm font-semibold text-slate-200 hover:bg-white/10 transition"
        >
          <div className="flex items-center space-x-2">
            <Settings2 className="h-4 w-4 text-amber-500" />
            <span>Advanced Model Assumptions</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <span>{showAdvanced ? "Hide Details" : "View / Customize"}</span>
            {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </button>

        {showAdvanced && (
          <div className="p-6 space-y-5 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Usable Roof Factor */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Usable Roof Area Factor
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {((assumptions.usableRoofFactor ?? 0.85) * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  value={assumptions.usableRoofFactor ?? 0.85}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      usableRoofFactor: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Accounts for roof edge setbacks, chimneys, pathways, and shadow spacing.
                </p>
              </div>

              {/* Area per kW */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Area Required Per kW
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {assumptions.areaPerKWsqFt ?? 80} sq ft/kW
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="120"
                  step="5"
                  value={assumptions.areaPerKWsqFt ?? 80}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      areaPerKWsqFt: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Modern 550W+ Mono PERC modules require ~80 sq ft per 1 kW of installed capacity.
                </p>
              </div>

              {/* System Performance Factor (PR) */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Performance Ratio (PR)
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {assumptions.systemPerformanceFactor ?? 0.78}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.65"
                  max="0.88"
                  step="0.01"
                  value={assumptions.systemPerformanceFactor ?? 0.78}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      systemPerformanceFactor: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Accounts for thermal coefficient losses, inverter clipping, cabling loss, and soiling.
                </p>
              </div>

              {/* Annual Degradation */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Annual Panel Degradation
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {((assumptions.annualDegradationRate ?? 0.007) * 100).toFixed(1)}% / yr
                  </span>
                </div>
                <input
                  type="range"
                  min="0.003"
                  max="0.015"
                  step="0.001"
                  value={assumptions.annualDegradationRate ?? 0.007}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      annualDegradationRate: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Standard tier-1 solar panel warranty degradation rate over 25 years.
                </p>
              </div>

              {/* Tariff Escalation */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Grid Tariff Annual Escalation
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {((assumptions.tariffEscalationRate ?? 0.03) * 100).toFixed(0)}% / yr
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.08"
                  step="0.01"
                  value={assumptions.tariffEscalationRate ?? 0.03}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      tariffEscalationRate: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Historical average utility rate inflation rate in India.
                </p>
              </div>

              {/* Grid CO2 factor */}
              <div className="rounded-lg border border-white/10 p-3.5 bg-white/5/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200">
                    Grid Carbon Intensity Factor
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-300">
                    {assumptions.co2KgPerKWh ?? 0.82} kg/kWh
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.02"
                  value={assumptions.co2KgPerKWh ?? 0.82}
                  onChange={(e) =>
                    onChangeAssumptions({
                      ...assumptions,
                      co2KgPerKWh: Number(e.target.value),
                    })
                  }
                  className="w-full mt-2 accent-solar-500"
                />
                <p className="mt-1 text-[11px] text-slate-400">
                  Central Electricity Authority (CEA) baseline carbon emission intensity for the Indian national grid.
                </p>
              </div>
            </div>
          </div>
        )}
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
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 text-slate-950 transition"
        >
          Next: Review Inputs →
        </button>
      </div>
    </div>
  );
}
