"use client";

import React, { useState } from "react";
import { Edit3, Map, CheckCircle2, Ruler } from "lucide-react";
import { PropertyLocation, RoofDetails } from "@/lib/solar/types";
import RoofMapDrawer from "../maps/RoofMapDrawer";

interface StepRoofMeasurementProps {
  location: PropertyLocation;
  roof: RoofDetails;
  onChange: (roof: RoofDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepRoofMeasurement({
  location,
  roof,
  onChange,
  onNext,
  onBack,
}: StepRoofMeasurementProps) {
  const [activeTab, setActiveTab] = useState<"manual" | "map">(
    roof.measurementMethod === "map_polygon" ? "map" : "manual"
  );
  const [unit, setUnit] = useState<"sqft" | "sqm">("sqft");

  const handleManualAreaChange = (val: number) => {
    if (unit === "sqft") {
      onChange({
        ...roof,
        areaSqFt: val,
        areaSqM: Math.round((val / 10.7639) * 10) / 10,
        measurementMethod: "manual",
      });
    } else {
      onChange({
        ...roof,
        areaSqM: val,
        areaSqFt: Math.round(val * 10.7639),
        measurementMethod: "manual",
      });
    }
  };

  const handleMapAreaConfirmed = (
    areaSqFt: number,
    areaSqM: number,
    geometry: any
  ) => {
    onChange({
      ...roof,
      areaSqFt,
      areaSqM,
      roofGeometry: geometry,
      measurementMethod: "map_polygon",
    });
  };

  const isValidArea = roof.areaSqFt > 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          How would you like to estimate your roof area?
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          We use total roof area to calculate the maximum solar PV capacity your roof can support.
        </p>
      </div>

      {/* Measurement Mode Tabs */}
      <div className="flex border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab("manual")}
          className={`flex items-center space-x-2 border-b-2 py-3 px-4 text-sm font-semibold transition ${
            activeTab === "manual"
              ? "border-amber-500/50 text-white"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>Manual Area Input</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("map")}
          className={`flex items-center space-x-2 border-b-2 py-3 px-4 text-sm font-semibold transition ${
            activeTab === "map"
              ? "border-amber-500/50 text-white"
              : "border-transparent text-slate-400 hover:text-slate-300"
          }`}
        >
          <Map className="h-4 w-4" />
          <span>Draw on Satellite Map</span>
        </button>
      </div>

      {/* Tab 1: Manual Input */}
      {activeTab === "manual" && (
        <div className="space-y-4 rounded-xl border border-white/10 bg-[#070A11] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-300">
              Total Roof Area
            </label>
            {/* Unit toggle */}
            <div className="inline-flex rounded-lg border border-white/10 bg-white/10 p-0.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnit("sqft")}
                className={`rounded-md px-3 py-1 transition ${
                  unit === "sqft"
                    ? "bg-[#070A11] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Square Feet (sq ft)
              </button>
              <button
                type="button"
                onClick={() => setUnit("sqm")}
                className={`rounded-md px-3 py-1 transition ${
                  unit === "sqm"
                    ? "bg-[#070A11] text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Square Meters (m²)
              </button>
            </div>
          </div>

          <div className="relative">
            <input
              type="number"
              min="1"
              value={unit === "sqft" ? roof.areaSqFt || "" : roof.areaSqM || ""}
              onChange={(e) => handleManualAreaChange(Number(e.target.value))}
              placeholder={unit === "sqft" ? "e.g. 1200" : "e.g. 111"}
              className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-2xl font-mono font-bold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="absolute right-4 top-3.5 font-mono text-sm font-semibold text-slate-400">
              {unit === "sqft" ? "sq ft" : "m²"}
            </span>
          </div>

          {/* Quick preset buttons for typical roofs */}
          <div>
            <span className="text-xs font-medium text-slate-400">Typical Home Sizes:</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {[600, 900, 1200, 1500, 2000, 2500].map((presetSqFt) => (
                <button
                  key={presetSqFt}
                  type="button"
                  onClick={() => {
                    setUnit("sqft");
                    handleManualAreaChange(presetSqFt);
                  }}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                    roof.areaSqFt === presetSqFt
                      ? "border-amber-500/50 bg-amber-500/5 text-amber-500 font-bold"
                      : "border-white/10 bg-[#070A11] text-slate-400 hover:bg-white/5"
                  }`}
                >
                  {presetSqFt} sq ft
                </button>
              ))}
            </div>
          </div>

          {roof.areaSqFt > 0 && (
            <div className="mt-4 flex items-center space-x-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>
                Configured: <strong>{roof.areaSqFt.toLocaleString("en-IN")} sq ft</strong> (approx.{" "}
                {roof.areaSqM.toLocaleString("en-IN")} m²).
              </span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Map Satellite Polygon Drawer */}
      {activeTab === "map" && (
        <div className="space-y-3">
          <RoofMapDrawer
            initialLat={location.latitude || 15.8497}
            initialLng={location.longitude || 74.4977}
            onAreaConfirmed={handleMapAreaConfirmed}
            currentAreaSqFt={roof.areaSqFt}
          />
          {roof.measurementMethod === "map_polygon" && roof.areaSqFt > 0 && (
            <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 p-3 text-xs text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              <span>
                Map Polygon Applied: <strong>{roof.areaSqFt.toLocaleString("en-IN")} sq ft</strong> (
                {roof.areaSqM.toLocaleString("en-IN")} m²).
              </span>
            </div>
          )}
        </div>
      )}

      {/* Usable Area Explanation */}
      <div className="flex items-start space-x-3 rounded-lg border border-white/10 bg-white/5 p-3.5 text-xs text-slate-400">
        <Ruler className="h-4 w-4 flex-shrink-0 text-slate-400 mt-0.5" />
        <span>
          <strong>Usable Area Note:</strong> In our calculation engine, 85% of your measured roof is
          treated as usable surface. The remaining 15% accounts for perimeter setbacks, maintenance pathways,
          and vents.
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
          disabled={!isValidArea}
          className="rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-medium text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 active:scale-95 text-slate-950 disabled:opacity-40 transition"
        >
          Next: Roof Characteristics →
        </button>
      </div>
    </div>
  );
}
