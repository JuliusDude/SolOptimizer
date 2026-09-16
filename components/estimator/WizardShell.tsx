"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Home,
  Sun,
  Zap,
  Sliders,
  CheckCircle,
} from "lucide-react";
import {
  WizardState,
  INITIAL_WIZARD_STATE,
  toSolarEstimatorInput,
} from "@/lib/estimator/store";
import { calculateSolarEstimate } from "@/lib/solar/calculator";
import StepProperty from "./StepProperty";
import StepRoofMeasurement from "./StepRoofMeasurement";
import StepRoofCharacteristics from "./StepRoofCharacteristics";
import StepElectricity from "./StepElectricity";
import StepSystemAssumptions from "./StepSystemAssumptions";
import StepReview from "./StepReview";

const STEPS = [
  { id: 1, label: "Property", icon: MapPin },
  { id: 2, label: "Roof Area", icon: Home },
  { id: 3, label: "Orientation", icon: Sun },
  { id: 4, label: "Electricity", icon: Zap },
  { id: 5, label: "System", icon: Sliders },
  { id: 6, label: "Review", icon: CheckCircle },
];

export default function WizardShell() {
  const router = useRouter();
  const [state, setState] = useState<WizardState>(INITIAL_WIZARD_STATE);
  const [isCalculating, setIsCalculating] = useState(false);

  // Read draft from sessionStorage if present
  useEffect(() => {
    try {
      const savedDraft = sessionStorage.getItem("soloptimizer_wizard_draft");
      if (savedDraft) {
        setState(JSON.parse(savedDraft));
      }
    } catch (e) {
      console.error("Draft read error", e);
    }
  }, []);

  // Save draft on changes
  useEffect(() => {
    try {
      sessionStorage.setItem("soloptimizer_wizard_draft", JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [state]);

  const handleNext = () => {
    setState((prev) => ({ ...prev, step: Math.min(prev.step + 1, 6) }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));
  };

  const handleGoToStep = (stepNumber: number) => {
    setState((prev) => ({ ...prev, step: stepNumber }));
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    const input = toSolarEstimatorInput(state);

    let resolvedAssumptions = { ...state.customAssumptions };
    try {
      const { fetchSolarResourceForLocation } = await import("@/lib/solar/api");
      const liveData = await fetchSolarResourceForLocation(
        input.location.city,
        input.location.state,
        input.location.latitude,
        input.location.longitude
      );
      if (liveData?.peakSunHours) {
        resolvedAssumptions.peakSunHoursPerDay = liveData.peakSunHours;
      }
    } catch (e) {
      console.warn("Could not retrieve live solar resource on calculate, using defaults", e);
    }

    const result = calculateSolarEstimate(input, resolvedAssumptions);

    // Save calculation bundle to sessionStorage for results page
    sessionStorage.setItem(
      "soloptimizer_active_calculation",
      JSON.stringify({
        input,
        result,
        assumptions: result.assumptionsUsed,
      })
    );

    router.push("/estimate/results");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Wizard Step Progress Stepper */}
      <div className="mb-10">
        <div className="hidden sm:flex items-center justify-between">
          {STEPS.map((stepItem, idx) => {
            const Icon = stepItem.icon;
            const isCompleted = state.step > stepItem.id;
            const isCurrent = state.step === stepItem.id;

            return (
              <React.Fragment key={stepItem.id}>
                <button
                  type="button"
                  onClick={() => handleGoToStep(stepItem.id)}
                  className="flex flex-col items-center group focus:outline-none"
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all ${
                      isCompleted
                        ? "border-emerald-500 bg-emerald-500/10 text-emerald-400"
                        : isCurrent
                        ? "border-amber-500 bg-amber-500/10 text-amber-500 ring-2 ring-amber-500/20 ring-offset-2 ring-offset-[#070A11]"
                        : "border-white/10 bg-[#070A11] text-slate-500 group-hover:border-white/30"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCurrent
                        ? "text-amber-500"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-slate-500"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-px flex-1 mx-4 transition-colors ${
                      state.step > idx + 1 ? "bg-emerald-500/50" : "bg-white/10"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile progress bar */}
        <div className="sm:hidden flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span>
              Step {state.step} of 6: {STEPS[state.step - 1].label}
            </span>
            <span className="font-mono text-amber-500">{Math.round((state.step / 6) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded bg-white/10">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${(state.step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content Container */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 sm:p-10 shadow-lg backdrop-blur-sm relative overflow-hidden">
        {/* Subtle grid background for the container */}
        <div className="absolute inset-0 bg-[url('https://assets.watermelon.sh/components/grid-pattern.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

        <div className="relative z-10">
          {state.step === 1 && (
            <StepProperty
              location={state.location}
              onChange={(location) => setState((prev) => ({ ...prev, location }))}
              onNext={handleNext}
            />
          )}
          {state.step === 2 && (
            <StepRoofMeasurement
              location={state.location}
              roof={state.roof}
              onChange={(roof) => setState((prev) => ({ ...prev, roof }))}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {state.step === 3 && (
            <StepRoofCharacteristics
              roof={state.roof}
              onChange={(roof) => setState((prev) => ({ ...prev, roof }))}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {state.step === 4 && (
            <StepElectricity
              electricity={state.electricity}
              onChange={(electricity) =>
                setState((prev) => ({ ...prev, electricity }))
              }
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {state.step === 5 && (
            <StepSystemAssumptions
              system={state.system}
              assumptions={state.customAssumptions}
              onChangeSystem={(system) => setState((prev) => ({ ...prev, system }))}
              onChangeAssumptions={(customAssumptions) =>
                setState((prev) => ({ ...prev, customAssumptions }))
              }
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {state.step === 6 && (
            <StepReview
              state={state}
              onGoToStep={handleGoToStep}
              onCalculate={handleCalculate}
              onBack={handleBack}
              isCalculating={isCalculating}
            />
          )}
        </div>
      </div>
    </div>
  );
}
