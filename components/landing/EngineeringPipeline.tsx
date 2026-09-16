"use client";

import React from "react";
import {
  Map,
  SunMedium,
  LineChart,
  ShieldCheck,
  Compass,
  Zap,
  TrendingUp,
} from "lucide-react";

interface PipelineStage {
  step: string;
  title: string;
  tag: string;
  description: string;
  details: string[];
  icon: React.ReactNode;
}

const STAGES: PipelineStage[] = [
  {
    step: "PHASE 01",
    title: "Satellite Geodesic Area",
    tag: "GEOSPATIAL PRECISION",
    description:
      "Map your rooftop on high-resolution satellite imagery. We calculate real surface area with geodesic polygon algorithms, accounting for pitch, orientation, and shading.",
    details: [
      "Turf.js geodesic polygon area calculation",
      "Compass azimuth orientation factor (South = 1.0)",
      "Obstruction shading derating (Low: 1.0, High: 0.55)",
    ],
    icon: <Map className="size-6 text-amber-400" />,
  },
  {
    step: "PHASE 02",
    title: "Irradiance & Derating Engine",
    tag: "NASA / MNRE BENCHMARKS",
    description:
      "Cross-references your geographic coordinates with validated regional solar resource data, adjusting for seasonal weather and electrical conversion losses.",
    details: [
      "Peak Sun Hours (PSH) regional irradiance tables",
      "System Performance Ratio (PR ~0.78 for thermal & wiring loss)",
      "Seasonal 12-month generation distribution curve",
    ],
    icon: <SunMedium className="size-6 text-solar-400" />,
  },
  {
    step: "PHASE 03",
    title: "25-Year Compound Financials",
    tag: "ACTUARIAL MODELING",
    description:
      "Projects your quarter-century investment return, factoring in utility tariff inflation, equipment degradation, payback crossover, and verified clean energy carbon credits.",
    details: [
      "0.7%/year PV module physical degradation",
      "3.0%/year grid electricity tariff escalation",
      "0.82 kg CO₂ avoided per generated kWh",
    ],
    icon: <LineChart className="size-6 text-emerald-400" />,
  },
];

export default function EngineeringPipeline() {
  return (
    <section className="relative z-20 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          The 3-Phase Solar Intelligence Pipeline
        </h2>
        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          From satellite imagery to 25-year financial compounding, discover how SolOptimizer
          computes clean energy decisions with complete mathematical transparency.
        </p>
      </div>

      {/* 3-Column Pipeline Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
        {STAGES.map((stage, idx) => (
          <div
            key={stage.step}
            className="group relative rounded-2xl border border-white/10 bg-[#0F172A]/50 hover:bg-[#0F172A]/80 p-7 space-y-5 backdrop-blur-xl transition-all duration-300 hover:border-amber-400/30 flex flex-col justify-between"
          >
            {/* Top Indicator */}
            <div>
              <span className="text-[11px] font-mono font-bold tracking-widest text-amber-400">
                {stage.step}
              </span>
            </div>

            {/* Icon + Title */}
            <div className="space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner group-hover:scale-105 transition-transform duration-200">
                {stage.icon}
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {stage.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans opacity-90">
                {stage.description}
              </p>
            </div>

            {/* Sub-bullet verification points */}
            <div className="pt-4 border-t border-white/[0.06] space-y-2">
              {stage.details.map((point, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-slate-400">
                  <div className="size-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
