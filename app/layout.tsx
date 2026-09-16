import type { Metadata } from "next";
import Link from "next/link";
import GlobalHeader from "@/components/GlobalHeader";
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
    <html lang="en" className="dark">
      <body className="flex min-h-screen flex-col bg-[#070A11] text-slate-100 antialiased selection:bg-amber-400 selection:text-slate-950">
        <GlobalHeader />

        {/* Main Application Area */}
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
