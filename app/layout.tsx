import type { Metadata } from "next";
import Link from "next/link";
import { Sun, Shield, LayoutDashboard, Calculator, ArrowRight } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SolOptimizer — Transparent Rooftop Solar Decision Support",
  description:
    "Know your roof. Know your savings. Make solar decisions with confidence. Decision support system for residential rooftop solar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900 antialiased selection:bg-solar-500 selection:text-white">
        {/* Global Navigation Header */}
        <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-solar-500 to-amber-400 text-slate-950 shadow-sm group-hover:scale-105 transition">
                <Sun className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 leading-none">
                  Sol<span className="text-solar-600">Optimizer</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  PS03 • Renewable Energy
                </span>
              </div>
            </Link>

            <nav className="flex items-center space-x-1 sm:space-x-3">
              <Link
                href="/estimate"
                className="inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <Calculator className="h-4 w-4 text-solar-600" />
                <span className="hidden sm:inline">Estimator</span>
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <LayoutDashboard className="h-4 w-4 text-slate-500" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              <Link
                href="/auth/sign-in"
                className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <span>Sign In</span>
              </Link>
              <Link
                href="/estimate"
                className="hidden md:inline-flex items-center space-x-1 rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white shadow hover:bg-slate-800 transition"
              >
                <span>Estimate Now</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Application Area */}
        <div className="flex-1">{children}</div>

        {/* Global Footer */}
        <footer className="border-t border-slate-200 bg-white py-8 text-slate-500 text-xs">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-solar-500" />
                <span className="font-semibold text-slate-700">
                  SolOptimizer Rooftop Solar Decision Support
                </span>
                <span>• Problem Statement PS03</span>
              </div>
              <div className="text-slate-400">
                Ministry of New and Renewable Energy (MNRE) Focus
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-slate-400 text-[11px] leading-relaxed">
              SolOptimizer is an estimation and decision-support tool. It is not a certified solar site survey,
              an engineering design, a binding installer quotation, or a guaranteed electricity-bill forecast.
              Built with transparent, explainable solar estimation logic.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
