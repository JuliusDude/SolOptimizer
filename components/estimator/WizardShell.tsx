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

  const handleCalculate = () => {
    setIsCalculating(true);
    const input = toSolarEstimatorInput(state);
    const result = calculateSolarEstimate(input, state.customAssumptions);

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
      <div className="mb-8">
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
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                      isCompleted
                        ? "border-eco-600 bg-eco-600 text-white"
                        : isCurrent
                        ? "border-solar-500 bg-solar-500 text-slate-900 font-bold ring-4 ring-solar-200"
                        : "border-slate-300 bg-white text-slate-400 group-hover:border-slate-400"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span
                    className={`mt-2 text-xs font-semibold ${
                      isCurrent
                        ? "text-slate-900 font-bold"
                        : isCompleted
                        ? "text-eco-800"
                        : "text-slate-500"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </button>
                {idx < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 mx-2 transition ${
                      state.step > idx + 1 ? "bg-eco-600" : "bg-slate-200"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile progress bar */}
        <div className="sm:hidden flex flex-col space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>
              Step {state.step} of 6: {STEPS[state.step - 1].label}
            </span>
            <span>{Math.round((state.step / 6) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-solar-500 transition-all duration-300"
              style={{ width: `${(state.step / 6) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Content Container */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
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
  );
}
