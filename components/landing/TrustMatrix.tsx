"use client";

import React from "react";
import { ShieldCheck, Eye, Lock, Award } from "lucide-react";

interface Pillar {
  title: string;
  badge: string;
  description: string;
  icon: React.ReactNode;
}

const PILLARS: Pillar[] = [
  {
    title: "100% Explainable Math",
    badge: "ZERO BLACK BOXES",
    description:
      "Every single calculation step is inspectable. We reveal the exact peak sun hours, orientation factors, shading penalties, and equipment degradation numbers.",
    icon: <Eye className="size-5 text-amber-400" />,
  },
  {
    title: "Privacy First Architecture",
    badge: "NO SPAM CALLS",
    description:
      "Run complete estimates anonymously without entering phone numbers, email addresses, or having your details sold to aggressive solar installer sales teams.",
    icon: <Lock className="size-5 text-emerald-400" />,
  },
  {
    title: "Dual-Mode Cloud Sync",
    badge: "SUPABASE RLS",
    description:
      "Test instantly in guest mode with browser storage, or sign in to synchronize multi-property estimates across devices backed by Postgres Row-Level Security.",
    icon: <ShieldCheck className="size-5 text-blue-400" />,
  },
  {
    title: "Government Standards",
    badge: "MNRE PS03",
    description:
      "Calibrated against Ministry of New and Renewable Energy benchmarks and Central Electricity Authority baseline carbon emissions (0.82 kg CO₂/kWh).",
    icon: <Award className="size-5 text-amber-400" />,
  },
];

export default function TrustMatrix() {
  return (
    <section className="relative z-20 py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {PILLARS.map((pillar) => (
          <div
            key={pillar.title}
            className="rounded-xl border border-white/[0.08] bg-[#0F172A]/40 hover:bg-[#0F172A]/70 p-6 space-y-3 transition-colors duration-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10">
                {pillar.icon}
              </div>
            </div>
            <h3 className="text-sm font-bold text-white pt-1">
              {pillar.title}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              {pillar.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
