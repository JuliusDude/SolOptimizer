"use client";

import React from "react";
import { Compass, SunMedium, CloudSun, CloudFog } from "lucide-react";
import { RoofDetails, RoofOrientation, ShadingLevel } from "@/lib/solar/types";
import { DEFAULT_SOLAR_ASSUMPTIONS } from "@/lib/solar/assumptions";

interface StepRoofCharacteristicsProps {
  roof: RoofDetails;
  onChange: (roof: RoofDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const ORIENTATIONS: Array<{
  id: RoofOrientation;
  label: string;
  badge: string;
  factor: number;
  description: string;
}> = [
  {
    id: "south",
    label: "South",
    badge: "Optimum 100%",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.south,
    description: "Maximum solar irradiance throughout the day in the Northern Hemisphere.",
  },
  {
    id: "southEast",
    label: "South-East",
    badge: "95% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.southEast,
    description: "Excellent morning to mid-day sun exposure.",
  },
  {
    id: "southWest",
    label: "South-West",
    badge: "95% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.southWest,
    description: "Excellent mid-day to afternoon sun exposure.",
  },
  {
    id: "east",
    label: "East",
    badge: "85% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.east,
    description: "Strong morning sunlight with afternoon shade.",
  },
  {
    id: "west",
    label: "West",
    badge: "85% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.west,
    description: "Strong afternoon sunlight with morning shade.",
  },
  {
    id: "northEast",
    label: "North-East",
    badge: "70% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.northEast,
    description: "Moderate morning sunlight, lower overall output.",
  },
  {
    id: "northWest",
    label: "North-West",
    badge: "70% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.northWest,
    description: "Moderate late sunlight, lower overall output.",
  },
  {
    id: "north",
    label: "North",
    badge: "60% Efficiency",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.orientationFactors.north,
    description: "Lowest solar harvest; steeper angle tilt required.",
  },
];

const SHADING_LEVELS: Array<{
  id: ShadingLevel;
  title: string;
  factor: number;
  icon: React.ReactNode;
  description: string;
}> = [
  {
    id: "low",
    title: "Low / No Obstruction",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.shadingFactors.low,
    icon: <SunMedium className="h-6 w-6 text-amber-500" />,
    description: "Clear sky exposure with no major trees or taller nearby structures.",
  },
  {
    id: "moderate",
    title: "Moderate Shade",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.shadingFactors.moderate,
    icon: <CloudSun className="h-6 w-6 text-orange-500" />,
    description: "Partial shading during early mornings or late afternoons from trees or adjacent walls.",
  },
  {
    id: "high",
    title: "High Shade",
    factor: DEFAULT_SOLAR_ASSUMPTIONS.shadingFactors.high,
    icon: <CloudFog className="h-6 w-6 text-slate-400" />,
    description: "Significant shading during peak daytime sunlight hours from large buildings or dense canopy.",
  },
];

export default function StepRoofCharacteristics({
  roof,
  onChange,
  onNext,
  onBack,
}: StepRoofCharacteristicsProps) {
  const selectedOrientation = ORIENTATIONS.find((o) => o.id === roof.orientation);
  const selectedShading = SHADING_LEVELS.find((s) => s.id === roof.shading);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">
          Which direction does your roof face and how much shade does it get?
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Orientation and shading directly scale your system&apos;s expected daily electricity output.
        </p>
      </div>

      {/* 1. Orientation Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
            <Compass className="h-4 w-4 text-amber-500" />
            <span>Roof Facing Direction (Azimuth)</span>
          </label>
          <span className="text-xs text-slate-400">
            Current Factor: <strong>{selectedOrientation?.factor.toFixed(2)}x</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ORIENTATIONS.map((orient) => {
            const isSelected = roof.orientation === orient.id;
            return (
              <button
                key={orient.id}
                type="button"
                onClick={() => onChange({ ...roof, orientation: orient.id })}
                className={`relative flex flex-col items-start rounded-xl border p-3.5 text-left transition ${
                  isSelected
                    ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50 shadow-sm"
                    : "border-white/10 bg-[#070A11] hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {orient.label}
                  </span>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                      orient.factor >= 0.95
                        ? "bg-emerald-500/10 text-emerald-400"
                        : orient.factor >= 0.8
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {orient.badge}
                  </span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-xs text-slate-400">
                  {orient.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Shading Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
            <SunMedium className="h-4 w-4 text-amber-500" />
            <span>Sunlight Obstruction & Shading</span>
          </label>
          <span className="text-xs text-slate-400">
            Current Factor: <strong>{selectedShading?.factor.toFixed(2)}x</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SHADING_LEVELS.map((shade) => {
            const isSelected = roof.shading === shade.id;
            return (
              <button
                key={shade.id}
                type="button"
                onClick={() => onChange({ ...roof, shading: shade.id })}
                className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${
                  isSelected
                    ? "border-amber-500/50 bg-amber-500/10 ring-2 ring-amber-500/50 shadow-sm"
                    : "border-white/10 bg-[#070A11] hover:border-white/10 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="rounded-lg bg-[#070A11] p-2 shadow-sm border border-white/5">
                    {shade.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {shade.title}
                    </h4>
                    <span className="text-xs font-semibold text-slate-400">
                      {(shade.factor * 100).toFixed(0)}% output
                    </span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400">
                  {shade.description}
                </p>
              </button>
            );
          })}
        </div>
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
          Next: Electricity & Tariff →
        </button>
      </div>
    </div>
  );
}
