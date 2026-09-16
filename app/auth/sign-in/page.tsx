"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      if (!supabase) {
        // Demo fallback
        router.push("/dashboard");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoGuest = () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#070A11]">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Sun className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Sign in to SolOptimizer
          </h2>
          <p className="text-xs text-slate-400">
            Access your cloud-synced solar assessments and 25-year forecasts.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">
              Email Address
            </label>
            <div className="relative mt-1">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Mail className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-500 py-2.5 text-sm font-bold text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:bg-amber-400 disabled:opacity-50 transition active:scale-95"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative border-t border-white/10 pt-4 text-center">
          <span className="bg-[#070A11] px-2 text-xs text-slate-500">or</span>
          <button
            type="button"
            onClick={handleDemoGuest}
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 py-2 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition"
          >
            Continue as Guest / Offline Demo Mode →
          </button>
        </div>

        <div className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-amber-400 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}
