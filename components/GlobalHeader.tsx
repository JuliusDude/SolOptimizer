"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sun, Calculator, LayoutDashboard, ArrowRight } from "lucide-react";

export default function GlobalHeader() {
  const pathname = usePathname();
  
  if (pathname === "/") return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#070A11]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_12px_rgba(245,158,11,0.3)] group-hover:scale-105 transition">
            <Sun className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-white leading-none">
              Sol<span className="text-amber-400">Optimizer</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-amber-400/80 tracking-wider">
              PS03 • SOLAR INTELLIGENCE
            </span>
          </div>
        </Link>

        <nav className="flex items-center space-x-1 sm:space-x-3">
          <Link
            href="/estimate"
            className="inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
          >
            <Calculator className="h-4 w-4 text-amber-400" />
            <span className="hidden sm:inline">Estimator</span>
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-1.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white transition"
          >
            <LayoutDashboard className="h-4 w-4 text-slate-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/auth/sign-in"
            className="inline-flex items-center space-x-1.5 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white transition"
          >
            <span>Sign In</span>
          </Link>
          <Link
            href="/estimate"
            className="hidden md:inline-flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-[0_0_14px_rgba(245,158,11,0.25)] hover:brightness-110 transition active:scale-95"
          >
            <span>Estimate Now</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
