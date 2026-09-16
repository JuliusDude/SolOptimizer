"use client";

import React from "react";
import {
  MapPin,
  Home,
  Compass,
  Zap,
  IndianRupee,
  Sparkles,
  Edit2,
  CheckCircle2,
} from "lucide-react";
import { WizardState } from "@/lib/estimator/store";
import { formatINR } from "@/lib/utils";

interface StepReviewProps {
  state: WizardState;
  onGoToStep: (stepNumber: number) => void;
  onCalculate: () => void;
  onBack: () => void;
  isCalculating?: boolean;
}

export default function StepReview({
  state,
  onGoToStep,
  onCalculate,
  onBack,
  isCalculating = false,
}: StepReviewProps) {
  const { location, roof, electricity, system, customAssumptions } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Review your inputs before calculation
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Confirm your property specifications and economic assumptions. You can jump back to edit any section.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Property & Roof Area */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <MapPin className="h-4 w-4 text-solar-600" />
              <span>Property & Location</span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(1)}
              className="flex items-center space-x-1 text-xs font-semibold text-solar-700 hover:text-solar-800"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>City / Region:</span>
              <strong className="text-slate-900">
                {location.city}
                {location.state ? `, ${location.state}` : ""}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Country:</span>
              <strong className="text-slate-900">{location.country}</strong>
            </div>
            {location.latitude && location.longitude && (
              <div className="flex justify-between">
                <span>Coordinates:</span>
                <span className="font-mono text-slate-700">
                  {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 2. Roof Measurement */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Home className="h-4 w-4 text-solar-600" />
              <span>Roof Area</span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(2)}
              className="flex items-center space-x-1 text-xs font-semibold text-solar-700 hover:text-solar-800"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Total Measured Area:</span>
              <strong className="text-slate-900">
                {roof.areaSqFt.toLocaleString("en-IN")} sq ft ({roof.areaSqM} m²)
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Method:</span>
              <span className="capitalize font-medium text-slate-800">
                {roof.measurementMethod === "map_polygon"
                  ? "Satellite Polygon Drawing"
                  : "Manual Entry"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Usable Area (85%):</span>
              <strong className="text-eco-700">
                {Math.round(roof.areaSqFt * 0.85).toLocaleString("en-IN")} sq ft
              </strong>
            </div>
          </div>
        </div>

        {/* 3. Roof Orientation & Shading */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Compass className="h-4 w-4 text-solar-600" />
              <span>Roof Characteristics</span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(3)}
              className="flex items-center space-x-1 text-xs font-semibold text-solar-700 hover:text-solar-800"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Facing Direction:</span>
              <strong className="capitalize text-slate-900">
                {roof.orientation}
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Sunlight Shading:</span>
              <strong className="capitalize text-slate-900">
                {roof.shading} Shade
              </strong>
            </div>
          </div>
        </div>

        {/* 4. Electricity & Cost */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
              <Zap className="h-4 w-4 text-solar-600" />
              <span>Electricity & Economics</span>
            </div>
            <button
              type="button"
              onClick={() => onGoToStep(4)}
              className="flex items-center space-x-1 text-xs font-semibold text-solar-700 hover:text-solar-800"
            >
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </div>
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Average Monthly Bill:</span>
              <strong className="text-slate-900">
                {formatINR(electricity.monthlyBillINR)} / mo
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Grid Tariff:</span>
              <strong className="text-slate-900">
                ₹{electricity.tariffINRPerKWh.toFixed(2)} / kWh
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Cost Assumption:</span>
              <strong className="text-slate-900">
                ₹{system.costPerKW.toLocaleString("en-IN")} / kW
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA */}
      <div className="rounded-2xl border border-solar-300 bg-gradient-to-r from-amber-500/10 via-solar-500/20 to-emerald-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-solar-600" />
            <span>Ready for your comprehensive solar forecast?</span>
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            Our engine will compute capacity, 25-year financial projections, payback crossover, and CO₂ offsets.
          </p>
        </div>
        <button
          type="button"
          onClick={onCalculate}
          disabled={isCalculating}
          className="inline-flex items-center justify-center space-x-2 rounded-xl bg-slate-900 px-8 py-3.5 text-base font-bold text-white shadow-lg hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-solar-400 disabled:opacity-50 transition transform active:scale-95"
        >
          <span>{isCalculating ? "Calculating..." : "Calculate My Solar Potential"}</span>
          <span>→</span>
        </button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}
