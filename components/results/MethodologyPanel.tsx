"use client";

import React, { useState } from "react";
import {
  FileText,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Calculator,
  CheckCircle,
} from "lucide-react";
import { SolarAssumptions, SolarEstimateResult } from "@/lib/solar/types";

interface MethodologyPanelProps {
  result: SolarEstimateResult;
}

export default function MethodologyPanel({ result }: MethodologyPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const { assumptionsUsed, explanation } = result;

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-slate-50/80 px-6 py-4 text-left hover:bg-slate-100 transition"
      >
        <div className="flex items-center space-x-2.5">
          <Calculator className="h-5 w-5 text-solar-600" />
          <h3 className="text-base font-bold text-slate-900">
            Transparent Methodology & Assumptions
          </h3>
          <span className="rounded-full bg-solar-100 px-2.5 py-0.5 text-xs font-semibold text-solar-800">
            Explainable Solar Logic
          </span>
        </div>
        <div className="flex items-center space-x-1 text-xs font-semibold text-slate-500">
          <span>{isOpen ? "Collapse" : "Expand Details"}</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 space-y-6 text-sm">
          <div className="rounded-lg bg-amber-50/50 border border-amber-200/60 p-4 text-xs text-amber-900">
            <strong>Key Product Principle:</strong> SolOptimizer never asks you to trust an unexplained number.
            Every output follows a deterministic path:
            <span className="font-mono font-semibold ml-1">
              Input → Assumption → Formula → Result
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Usable Roof Area */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                1. Usable Roof Area
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {explanation.usableAreaFormula}
              </p>
              <p className="text-xs text-slate-600">
                Accounts for edge setbacks, maintenance access corridors, and parapet shadows.
              </p>
            </div>

            {/* 2. System Capacity */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                2. System Capacity (kW)
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {explanation.capacityFormula}
              </p>
              <p className="text-xs text-slate-600">
                Based on modern high-efficiency mono-crystalline modules requiring ~80 sq ft per 1 kW.
              </p>
            </div>

            {/* 3. Annual Generation */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                3. Annual Generation (kWh/year)
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200 overflow-x-auto">
                {explanation.generationFormula}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] text-slate-500">
                <div>• PSH: {assumptionsUsed.peakSunHoursPerDay} hrs/day</div>
                <div>• PR Factor: {assumptionsUsed.systemPerformanceFactor}</div>
                <div>• Days: 365</div>
                <div>• Degradation: {(assumptionsUsed.annualDegradationRate * 100).toFixed(1)}%/yr</div>
              </div>
            </div>

            {/* 4. Bill Savings */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                4. Annual Bill-Value Savings
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {explanation.savingsFormula}
              </p>
              <p className="text-xs text-slate-600">
                Calculates direct utility offset value before net metering distribution fees.
              </p>
            </div>

            {/* 5. Simple Payback */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                5. Simple Payback Period
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {explanation.paybackFormula}
              </p>
              <p className="text-xs text-slate-600">
                Number of years needed for annual cumulative electricity savings to match capital installation cost.
              </p>
            </div>

            {/* 6. CO2 Offset */}
            <div className="rounded-xl border border-slate-200 p-4 space-y-2 bg-slate-50/30 md:col-span-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                6. Avoided CO₂ Emissions
              </span>
              <p className="font-mono text-xs font-semibold text-slate-900 bg-white p-2 rounded border border-slate-200">
                {explanation.co2Formula}
              </p>
              <p className="text-xs text-slate-600">
                Benchmark India Central Electricity Authority grid displacement factor of 0.82 kg CO₂/kWh.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
            <span>Model Version: {assumptionsUsed.modelVersion || "1.0.0"}</span>
            <span>Deterministic pure TypeScript calculation engine</span>
          </div>
        </div>
      )}
    </div>
  );
}
