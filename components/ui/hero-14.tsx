"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Github,
  Figma,
  Framer,
  Slack,
  Twitch,
  Sun,
  Zap,
  MapPin,
  Database,
  ShieldCheck,
} from "lucide-react";
import { motion, type Variants } from "motion/react";

export interface NavLink {
  label: string;
  href: string;
  hasDropdown?: boolean;
}

export interface PartnerLogo {
  name: string;
  mark?:
    | "github"
    | "figma"
    | "framer"
    | "slack"
    | "twitch"
    | "sun"
    | "zap"
    | "map"
    | "database"
    | "shield";
}

export interface Hero14Props {
  brandName?: string;
  brandTagline?: string;
  navLinks?: NavLink[];
  badgeText?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  onPrimaryCtaClick?: () => void;
  demoLabel?: string;
  demoHref?: string;
  onDemoClick?: () => void;
  partnerEyebrow?: string;
  partners?: PartnerLogo[];
  backgroundImage?: string;
  showAsciiBackground?: boolean;
  showTelemetryHUD?: boolean;
  showNav?: boolean;
  telemetryLat?: string;
  telemetryLong?: string;
  systemStatus?: string;
}

const navLinksDefault: NavLink[] = [
  { label: "Estimator", href: "/estimate" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Methodology", href: "#methodology" },
  { label: "Documentation", href: "#features" },
];

const partnerLogosDefault: PartnerLogo[] = [
  { name: "MNRE Benchmarks", mark: "sun" },
  { name: "Mapbox Geodesy", mark: "map" },
  { name: "NASA Irradiance", mark: "zap" },
  { name: "Supabase RLS", mark: "database" },
  { name: "Turf.js Geodesic", mark: "shield" },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const riseVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.25, duration: 1.1 },
  },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.25, duration: 1.1 },
  },
};

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.08, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", bounce: 0.1, duration: 1.5 },
  },
};

function PartnerMark({ mark }: { mark?: PartnerLogo["mark"] }) {
  switch (mark) {
    case "github":
      return <Github className="size-4 text-white/80" />;
    case "figma":
      return <Figma className="size-4 text-white/80" />;
    case "framer":
      return <Framer className="size-4 text-white/80" />;
    case "slack":
      return <Slack className="size-4 text-white/80" />;
    case "twitch":
      return <Twitch className="size-4 text-white/80" />;
    case "sun":
      return <Sun className="size-4 text-amber-400" />;
    case "zap":
      return <Zap className="size-4 text-solar-400" />;
    case "map":
      return <MapPin className="size-4 text-emerald-400" />;
    case "database":
      return <Database className="size-4 text-emerald-400" />;
    case "shield":
      return <ShieldCheck className="size-4 text-blue-400" />;
    default:
      return <Sun className="size-4 text-amber-400" />;
  }
}

export default function Hero14({
  brandName = "SolOptimizer",
  brandTagline = "PS03 • SOLAR INTELLIGENCE",
  navLinks = navLinksDefault,
  badgeText = "MNRE PS03 • Deterministic Decision Support",
  headingLine1 = "Know your roof.",
  headingLine2 = "Know your savings.",
  description = "Precision rooftop solar assessment with interactive satellite polygon drawing, deterministic 25-year financial modeling, and 100% explainable calculations.",
  primaryCtaLabel = "Estimate My Solar Potential",
  primaryCtaHref = "/estimate",
  onPrimaryCtaClick,
  demoLabel = "Explore Live Demo",
  demoHref = "#",
  onDemoClick,
  partnerEyebrow = "Verified calculation models and open geospatial frameworks",
  partners = partnerLogosDefault,
  backgroundImage = "https://assets.watermelon.sh/hero-14-bg.avif",
  showAsciiBackground = true,
  showTelemetryHUD = true,
  showNav = true,
  telemetryLat = "LAT: 15.8497° N",
  telemetryLong = "LONG: 74.4977° E",
  systemStatus = "SYSTEM.ACTIVE // PSH: 5.4",
}: Hero14Props) {
  useEffect(() => {
    if (!showAsciiBackground) return;

    const embedScript = document.createElement("script");
    embedScript.type = "text/javascript";
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    const style = document.createElement("style");
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      [data-us-project] canvas {
        clip-path: inset(0 0 8% 0) !important;
      }
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    const hideBranding = () => {
      const selectors = [
        "[data-us-project]",
        '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',
        ".unicorn-studio-container",
        'canvas[aria-label*="Unicorn"]',
      ];
      selectors.forEach((selector) => {
        const containers = document.querySelectorAll(selector);
        containers.forEach((container) => {
          const allElements = container.querySelectorAll("*");
          allElements.forEach((el) => {
            const text = (el.textContent || "").toLowerCase();
            const title = (el.getAttribute("title") || "").toLowerCase();
            const href = (el.getAttribute("href") || "").toLowerCase();
            if (
              text.includes("made with") ||
              text.includes("unicorn") ||
              title.includes("made with") ||
              title.includes("unicorn") ||
              href.includes("unicorn.studio")
            ) {
              const htmlEl = el as HTMLElement;
              htmlEl.style.display = "none";
              htmlEl.style.visibility = "hidden";
              htmlEl.style.opacity = "0";
              htmlEl.style.pointerEvents = "none";
              htmlEl.style.position = "absolute";
              htmlEl.style.left = "-9999px";
              htmlEl.style.top = "-9999px";
              try {
                el.remove();
              } catch (e) {}
            }
          });
        });
      });
    };

    hideBranding();
    const interval = setInterval(hideBranding, 80);
    const timeouts = [
      setTimeout(hideBranding, 500),
      setTimeout(hideBranding, 1200),
      setTimeout(hideBranding, 2500),
      setTimeout(hideBranding, 6000),
    ];

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
      try {
        if (embedScript.parentNode) embedScript.parentNode.removeChild(embedScript);
        if (style.parentNode) style.parentNode.removeChild(style);
      } catch (e) {}
    };
  }, [showAsciiBackground]);

  return (
    <section className="relative isolate flex min-h-screen w-full flex-col overflow-hidden bg-slate-950 text-white antialiased">
      {/* Background layer */}
      {showAsciiBackground ? (
        <>
          {/* UnicornStudio ASCII canvas */}
          <div className="absolute inset-0 w-full h-full hidden lg:block opacity-65">
            <div
              data-us-project="OMzqyUv6M3kSnv0JeAtC"
              style={{ width: "100%", height: "100%", minHeight: "100vh" }}
            />
          </div>
          {/* Mobile stars canvas fallback */}
          <div className="absolute inset-0 w-full h-full lg:hidden stars-bg opacity-30" />
          {/* Dark radial glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950 pointer-events-none" />
        </>
      ) : (
        <motion.img
          variants={imageVariants}
          src={backgroundImage}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-35"
        />
      )}

      {/* Technical corner HUD frames from ascii.md */}
      {showTelemetryHUD && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-l-2 border-amber-500/30 z-20 pointer-events-none" />
          <div className="absolute top-0 right-0 w-8 h-8 lg:w-12 lg:h-12 border-t-2 border-r-2 border-amber-500/30 z-20 pointer-events-none" />
          <div
            className="absolute left-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-l-2 border-amber-500/30 z-20 pointer-events-none"
            style={{ bottom: "5vh" }}
          />
          <div
            className="absolute right-0 w-8 h-8 lg:w-12 lg:h-12 border-b-2 border-r-2 border-amber-500/30 z-20 pointer-events-none"
            style={{ bottom: "5vh" }}
          />
        </>
      )}

      <motion.div
        className="relative z-10 flex min-h-screen w-full flex-col justify-between shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Navigation Bar */}
        {showNav && (
          <motion.nav
            variants={riseVariants}
            className="relative z-20 mx-auto flex min-h-16 w-full max-w-[80rem] items-center justify-between border-b border-white/[0.08] px-5 py-3 sm:px-8 lg:px-12 backdrop-blur-md bg-slate-950/50"
          >
            <Link
              href="/"
              className="group/brand inline-flex items-center gap-2.5 text-md font-bold text-white transition-opacity hover:opacity-90"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-solar-400 text-slate-950 shadow-md transition-transform duration-200 group-hover/brand:scale-105">
                <Sun className="size-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-extrabold tracking-tight leading-none">
                  {brandName}
                </span>
                <span className="text-[9px] font-mono font-semibold tracking-wider text-amber-400/90 uppercase">
                  {brandTagline}
                </span>
              </div>
            </Link>

            {/* Nav links */}
            <div className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="group/nav inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-white/75 transition-colors duration-200 hover:text-white"
                >
                  {link.label}
                  {link.hasDropdown ? (
                    <ChevronDown className="size-3 stroke-[2.4] opacity-70 transition-transform duration-200 group-hover/nav:translate-y-0.5" />
                  ) : null}
                </a>
              ))}
            </div>

            {/* Telemetry / action button */}
            <div className="flex items-center gap-4">
              {showTelemetryHUD && (
                <div className="hidden xl:flex items-center gap-2.5 text-[10px] font-mono text-white/50 border-r border-white/10 pr-4">
                  <span>{telemetryLat}</span>
                  <div className="w-1 h-1 bg-amber-400/60 rounded-full animate-ping" />
                  <span>{telemetryLong}</span>
                </div>
              )}

              {onDemoClick ? (
                <button
                  type="button"
                  onClick={onDemoClick}
                  className="group/demo inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-4 text-xs font-mono text-white backdrop-blur-md transition-all duration-200 active:scale-95"
                >
                  <span>{demoLabel}</span>
                  <ArrowRight className="size-3 text-amber-400 transition-transform duration-200 group-hover/demo:translate-x-0.5" />
                </button>
              ) : (
                <Link
                  href={demoHref}
                  className="group/demo inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 px-4 text-xs font-mono text-white backdrop-blur-md transition-all duration-200 active:scale-95"
                >
                  <span>{demoLabel}</span>
                  <ArrowRight className="size-3 text-amber-400 transition-transform duration-200 group-hover/demo:translate-x-0.5" />
                </Link>
              )}
            </div>
          </motion.nav>
        )}

        {/* Hero Content Center */}
        <div className="relative z-10 mx-auto flex w-full max-w-[76rem] flex-1 flex-col items-center justify-center px-5 pt-12 pb-14 text-center sm:px-8 sm:pt-16 lg:px-12">
          {/* Heading */}
          <motion.h1
            variants={riseVariants}
            className="max-w-4xl text-[clamp(2.5rem,5.5vw,4.8rem)] leading-[1.04] font-black tracking-tight text-white"
          >
            <span className="block font-sans">{headingLine1}</span>
            <span className="mt-1 block font-serif text-[1.12em] font-light italic bg-gradient-to-r from-amber-300 via-solar-300 to-emerald-400 bg-clip-text text-transparent">
              {headingLine2}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={riseVariants}
            className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base font-sans font-normal opacity-90"
          >
            {description}
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={riseVariants}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5"
          >
            {onPrimaryCtaClick ? (
              <button
                type="button"
                onClick={onPrimaryCtaClick}
                className="group/cta inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-solar-500 hover:from-amber-400 hover:to-solar-400 px-7 text-sm font-bold text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-95"
              >
                <Sun className="size-4 text-slate-950" />
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
              </button>
            ) : (
              <Link
                href={primaryCtaHref}
                className="group/cta inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-solar-500 hover:from-amber-400 hover:to-solar-400 px-7 text-sm font-bold text-slate-950 shadow-[0_4px_20px_rgba(245,158,11,0.35)] transition-all duration-200 active:scale-95"
              >
                <Sun className="size-4 text-slate-950" />
                <span>{primaryCtaLabel}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/cta:translate-x-1" />
              </Link>
            )}

            {onDemoClick ? (
              <button
                type="button"
                onClick={onDemoClick}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 active:scale-95"
              >
                <span>{demoLabel}</span>
              </button>
            ) : (
              <Link
                href={demoHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 px-6 text-sm font-medium text-white backdrop-blur-sm transition-all duration-200 active:scale-95"
              >
                <span>{demoLabel}</span>
              </Link>
            )}
          </motion.div>

          {/* Technical Telemetry Strip */}
          {showTelemetryHUD && (
            <motion.div
              variants={riseVariants}
              className="mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-xl border border-white/10 bg-[#070A11]/60 px-5 py-2 text-[10px] font-mono text-white/50 backdrop-blur-md shadow-inner"
            >
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-amber-400/90 font-medium">{systemStatus}</span>
              </div>
              <span className="hidden sm:inline text-white/20">•</span>
              <div className="flex items-center gap-2">
                <span>{telemetryLat}</span>
                <span className="text-white/30">/</span>
                <span>{telemetryLong}</span>
              </div>
              <span className="hidden md:inline text-white/20">•</span>
              <span className="hidden md:inline">ALGORITHM: DETERMINISTIC v1.0.0</span>
              <span className="hidden lg:inline text-white/20">•</span>
              <span className="hidden lg:inline">FRAME: ∞</span>
            </motion.div>
          )}

          {/* Social Proof & Frameworks */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-10 w-full max-w-4xl"
          >
            <motion.p
              variants={riseVariants}
              className="text-xs font-mono uppercase tracking-widest text-white/40"
            >
              {partnerEyebrow}
            </motion.p>
            <div className="mx-auto mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {partners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  variants={logoVariants}
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-mono"
                >
                  <PartnerMark mark={partner.mark} />
                  <span>{partner.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Ambient bottom dissolve into page content */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070A11] via-[#070A11]/80 to-transparent z-10" />
      </motion.div>

      {/* Global CSS for dither & stars background effects */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .stars-bg {
              background-image: 
                radial-gradient(1px 1px at 20% 30%, white, transparent),
                radial-gradient(1px 1px at 60% 70%, white, transparent),
                radial-gradient(1px 1px at 50% 50%, white, transparent),
                radial-gradient(1px 1px at 80% 10%, white, transparent),
                radial-gradient(1px 1px at 90% 60%, white, transparent),
                radial-gradient(1px 1px at 33% 80%, white, transparent),
                radial-gradient(1px 1px at 15% 60%, white, transparent),
                radial-gradient(1px 1px at 70% 40%, white, transparent);
              background-size: 200% 200%, 180% 180%, 250% 250%, 220% 220%, 190% 190%, 240% 240%, 210% 210%, 230% 230%;
              background-position: 0% 0%, 40% 40%, 60% 60%, 20% 20%, 80% 80%, 30% 30%, 70% 70%, 50% 50%;
            }
          `,
        }}
      />
    </section>
  );
}
