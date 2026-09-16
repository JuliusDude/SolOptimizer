"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sun, Lock, Mail, User, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
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

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#070A11]">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <Sun className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Create an Account
          </h2>
          <p className="text-xs text-slate-400">
            Save and compare solar estimates across multiple properties.
          </p>
        </div>

        {errorMsg && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-500/10 p-3 text-xs text-red-400 border border-red-500/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase">
              Full Name
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm font-semibold text-white placeholder:text-slate-500 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
              <User className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
            </div>
          </div>

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
                minLength={6}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-white/10">
          Already have an account?{" "}
          <Link
            href="/auth/sign-in"
            className="font-semibold text-amber-400 hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}
