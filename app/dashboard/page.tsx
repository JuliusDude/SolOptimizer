"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Sun,
  Zap,
  IndianRupee,
  Calendar,
  Leaf,
  MapPin,
  Trash2,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { SavedEstimateRecord } from "@/lib/solar/types";
import { fetchSavedEstimates, deleteSavedEstimate } from "@/lib/supabase/store";
import { formatINR, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const [estimates, setEstimates] = useState<SavedEstimateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadEstimates = async () => {
    setIsLoading(true);
    try {
      const data = await fetchSavedEstimates();
      setEstimates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEstimates();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this estimate?")) {
      await deleteSavedEstimate(id);
      setEstimates((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const latestEstimate = estimates.length > 0 ? estimates[0] : null;

  return (
    <main className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Rooftop Solar Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Manage, compare, and inspect your saved rooftop feasibility assessments.
            </p>
          </div>
          <Link
            href="/estimate"
            className="inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-slate-800 transition"
          >
            <Plus className="h-4 w-4 text-solar-400" />
            <span>+ Estimate New Solar</span>
          </Link>
        </div>

        {/* Latest Estimate Hero Summary */}
        {latestEstimate && (
          <div className="rounded-3xl border border-solar-200 bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-solar-800 bg-solar-100 px-2.5 py-1 rounded-full">
                  Latest Saved Assessment
                </span>
                <h2 className="mt-2 text-xl font-bold text-slate-900">
                  {latestEstimate.propertyName}
                </h2>
                <div className="mt-1 flex items-center space-x-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {latestEstimate.input.location.city}
                    {latestEstimate.input.location.state
                      ? `, ${latestEstimate.input.location.state}`
                      : ""}
                  </span>
                  <span>•</span>
                  <span>
                    Saved on {new Date(latestEstimate.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              <Link
                href={`/dashboard/estimates/${latestEstimate.id}`}
                className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 self-start sm:self-auto"
              >
                <span>View Full Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <div className="space-y-1">
                <span className="text-xs text-slate-500">System Capacity</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {latestEstimate.result.estimatedCapacityKW} kW
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500">Annual Gen</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {formatNumber(latestEstimate.result.annualGenerationKWh)} kWh
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500">Annual Savings</span>
                <div className="text-xl font-bold font-mono text-eco-700">
                  {formatINR(latestEstimate.result.annualSavingsINR)}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500">Payback</span>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {latestEstimate.result.paybackYears !== null
                    ? `${latestEstimate.result.paybackYears} yrs`
                    : "N/A"}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500">CO₂ Avoided</span>
                <div className="text-xl font-bold font-mono text-emerald-700">
                  {(latestEstimate.result.annualCO2AvoidedKg / 1000).toFixed(1)} T / yr
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Estimates List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            All Saved Estimates ({estimates.length})
          </h2>

          {estimates.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
              <div className="rounded-full bg-solar-50 p-3 text-solar-600">
                <Sun className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                No saved estimates yet
              </h3>
              <p className="mt-1 max-w-sm text-xs text-slate-500">
                Create your first rooftop solar estimate to understand your roof&apos;s generation potential,
                bill savings, and return on investment.
              </p>
              <Link
                href="/estimate"
                className="mt-5 inline-flex items-center space-x-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-slate-800"
              >
                <Plus className="h-4 w-4 text-solar-400" />
                <span>+ Estimate New Solar</span>
              </Link>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estimates.map((est) => (
              <div
                key={est.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-slate-300 transition"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-solar-700 transition">
                        {est.propertyName}
                      </h3>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {est.input.location.city}
                          {est.input.location.state ? `, ${est.input.location.state}` : ""}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(est.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition"
                      title="Delete estimate"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-xs">
                    <div>
                      <span className="text-slate-500 block">Capacity</span>
                      <strong className="font-mono text-slate-900">
                        {est.result.estimatedCapacityKW} kW
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Savings</span>
                      <strong className="font-mono text-eco-700">
                        {formatINR(est.result.annualSavingsINR)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Payback</span>
                      <strong className="font-mono text-slate-900">
                        {est.result.paybackYears !== null
                          ? `${est.result.paybackYears} yrs`
                          : "N/A"}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>
                    Created: {new Date(est.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <Link
                    href={`/dashboard/estimates/${est.id}`}
                    className="flex items-center space-x-1 font-semibold text-solar-700 hover:text-solar-800"
                  >
                    <span>View Analysis</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
