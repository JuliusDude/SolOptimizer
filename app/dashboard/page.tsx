"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Search,
  Command,
  Sun,
  Zap,
  Leaf,
  MapPin,
  Trash2,
  ArrowUpRight,
  Plus,
  ArrowRight,
  Clock3,
  Database
} from "lucide-react";
import { SavedEstimateRecord } from "@/lib/solar/types";
import { fetchSavedEstimates, deleteSavedEstimate } from "@/lib/supabase/store";
import { formatINR, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const [estimates, setEstimates] = useState<SavedEstimateRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    function focusSearch(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", focusSearch);
    return () => window.removeEventListener("keydown", focusSearch);
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this estimate?")) {
      await deleteSavedEstimate(id);
      setEstimates((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const normalizedQuery = query.trim().toLowerCase();
  const visibleEstimates = estimates.filter((est) =>
    [est.propertyName, est.input.location.city, est.input.location.state]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );

  const latestEstimate = estimates.length > 0 ? estimates[0] : null;

  return (
    <main className="min-h-screen bg-[#070A11] py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-screen-xl">
        {/* Top Header / Search */}
        <div className="flex flex-col gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <h1 className="text-2xl font-medium tracking-tight text-white sm:text-3xl">
              Solar Intelligence Dashboard
            </h1>
            <p className="flex items-center gap-1.5 font-mono text-sm text-slate-400 sm:text-base">
              <CalendarDays aria-hidden="true" className="h-5 w-5 text-amber-500" strokeWidth={1.5} />
              {new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="relative w-full sm:max-w-md">
            <label htmlFor="dashboard-search" className="sr-only">
              Search estimates
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              strokeWidth={1.5}
            />
            <input
              id="dashboard-search"
              ref={searchInputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search properties or locations..."
              className="h-11 w-full rounded-lg border border-white/10 bg-white/5 pl-11 pr-4 font-mono text-slate-200 placeholder:text-slate-400 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50 sm:pr-14"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:block">
              <kbd className="pointer-events-none flex items-center gap-1 rounded bg-[#070A11] border border-white/10 px-2 py-1 font-mono text-xs text-slate-400">
                <Command aria-hidden="true" className="h-3 w-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Recent Estimate */}
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
            <Clock3 aria-hidden="true" className="h-5 w-5 text-amber-500" strokeWidth={1.6} />
            Latest Feasibility Run
          </h2>
          
          <div className="mt-4">
            {latestEstimate ? (
              <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-8">
                <div className="absolute right-0 top-0 h-[300px] w-[300px] -translate-y-1/2 translate-x-1/3 bg-amber-500/10 blur-[100px]" />
                
                <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                  <div>
                    <div className="inline-flex rounded border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
                      Recent Assessment
                    </div>
                    <h3 className="mt-3 text-2xl font-bold text-white">
                      {latestEstimate.propertyName}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 font-mono text-xs text-slate-400">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>
                        {latestEstimate.input.location.city}
                        {latestEstimate.input.location.state ? `, ${latestEstimate.input.location.state}` : ""}
                      </span>
                      <span>•</span>
                      <span>{new Date(latestEstimate.createdAt).toLocaleDateString("en-IN")}</span>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/estimates/${latestEstimate.id}`}
                    className="group inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition"
                  >
                    <span>Inspect Details</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-5">
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Capacity</span>
                    <div className="font-mono text-xl text-white">
                      {latestEstimate.result.estimatedCapacityKW} <span className="text-sm text-slate-400">kW</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Gen / Yr</span>
                    <div className="font-mono text-xl text-white">
                      {formatNumber(latestEstimate.result.annualGenerationKWh)} <span className="text-sm text-slate-400">kWh</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Savings / Yr</span>
                    <div className="font-mono text-xl text-emerald-400">
                      {formatINR(latestEstimate.result.annualSavingsINR)}
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">Payback</span>
                    <div className="font-mono text-xl text-white">
                      {latestEstimate.result.paybackYears !== null ? latestEstimate.result.paybackYears : "N/A"} <span className="text-sm text-slate-400">yrs</span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">CO₂ offset</span>
                    <div className="font-mono text-xl text-emerald-500">
                      {(latestEstimate.result.annualCO2AvoidedKg / 1000).toFixed(1)} <span className="text-sm text-slate-400">t</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5 rounded-xl border border-white/5 bg-white/[0.02] py-12 sm:py-16">
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/5 border border-white/10">
                  <Clock3 aria-hidden="true" className="h-6 w-6 text-slate-400" strokeWidth={1.5} />
                </span>
                <p className="font-mono text-sm text-slate-400">
                  Your recent works will appear here
                </p>
                <Link
                  href="/estimate"
                  className="mt-2 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-slate-950 hover:bg-amber-400 transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Start First Estimate</span>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* All Estimates Grid */}
        <section className="mt-12 space-y-6 pb-8">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Database aria-hidden="true" className="h-5 w-5 text-amber-500" strokeWidth={1.6} />
              Saved Workspaces ({estimates.length})
            </h2>
            <Link
              href="/estimate"
              className="inline-flex items-center gap-1.5 rounded bg-white/5 px-3 py-1.5 font-mono text-xs text-slate-300 hover:bg-white/10 hover:text-white transition"
            >
              <Plus className="h-3 w-3" />
              <span>New</span>
            </Link>
          </div>

          {visibleEstimates.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {visibleEstimates.map((est) => (
                <Link
                  key={est.id}
                  href={`/dashboard/estimates/${est.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:bg-white/[0.04] hover:border-white/20"
                >
                  <div className="flex items-start justify-between">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#070A11] border border-white/5 shadow-sm">
                      <Sun aria-hidden="true" className="h-5 w-5 text-amber-500" strokeWidth={1.6} />
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(est.id, e)}
                        className="text-slate-400 hover:text-red-400 transition opacity-0 group-hover:opacity-100 p-1"
                        title="Delete workspace"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="h-5 w-5 text-slate-400 transition-colors group-hover:text-amber-500"
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h3 className="text-lg font-medium text-white">{est.propertyName}</h3>
                    <div className="font-mono text-xs text-slate-400">
                      <ul className="space-y-2">
                        <li className="flex gap-2">
                          <span aria-hidden="true" className="text-amber-500">·</span>
                          <span>{est.result.estimatedCapacityKW} kW System Capacity</span>
                        </li>
                        <li className="flex gap-2">
                          <span aria-hidden="true" className="text-amber-500">·</span>
                          <span>{formatINR(est.result.annualSavingsINR)} Est. Savings</span>
                        </li>
                        <li className="flex gap-2">
                          <span aria-hidden="true" className="text-amber-500">·</span>
                          <span>{est.input.location.city}{est.input.location.state ? `, ${est.input.location.state}` : ""}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-mono text-xs text-slate-400">
                      {new Date(est.createdAt).toLocaleDateString("en-IN")}
                    </span>
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                      {est.id.slice(0, 8)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            estimates.length > 0 && (
              <p className="flex min-h-[200px] items-center justify-center rounded-xl bg-white/[0.02] border border-white/5 text-center text-sm font-mono text-slate-400">
                No workspaces match your search.
              </p>
            )
          )}
        </section>
      </div>
    </main>
  );
}
