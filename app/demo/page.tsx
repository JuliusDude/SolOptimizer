"use client";

import React, { useState } from "react";
import Hero14 from "@/components/ui/hero-14";
import HeroAsciiOne from "@/components/ui/hero-ascii-one";

export default function DemoPage() {
  const [view, setView] = useState<"hero14" | "ascii">("hero14");

  return (
    <div className="relative min-h-screen bg-slate-950">
      {/* Switcher Controls */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full border border-white/20 bg-black/80 px-4 py-2 backdrop-blur-md shadow-2xl">
        <span className="text-[11px] font-mono text-white/60">VIEW:</span>
        <button
          type="button"
          onClick={() => setView("hero14")}
          className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
            view === "hero14"
              ? "bg-amber-400 font-bold text-slate-950 shadow"
              : "text-white hover:bg-white/10"
          }`}
        >
          Hero 14 (Enhanced)
        </button>
        <button
          type="button"
          onClick={() => setView("ascii")}
          className={`rounded-full px-3 py-1 text-xs font-mono transition-all ${
            view === "ascii"
              ? "bg-amber-400 font-bold text-slate-950 shadow"
              : "text-white hover:bg-white/10"
          }`}
        >
          Raw Ascii One
        </button>
      </div>

      {view === "hero14" ? (
        <Hero14
          brandName="SolOptimizer"
          brandTagline="PS03 • SOLAR INTELLIGENCE"
          headingLine1="Know your roof."
          headingLine2="Know your savings."
          description="Precision rooftop solar assessment with interactive satellite polygon drawing, deterministic 25-year financial modeling, and 100% explainable calculations."
          badgeText="MNRE PS03 • Solar Decision Support"
          showAsciiBackground={true}
          showTelemetryHUD={true}
          showNav={true}
          primaryCtaHref="/estimate"
          demoHref="/estimate/results"
        />
      ) : (
        <HeroAsciiOne />
      )}
    </div>
  );
}
