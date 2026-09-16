import React from "react";
import { AlertCircle } from "lucide-react";

export default function DisclaimerBanner() {
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 text-xs text-amber-900 shadow-sm">
      <div className="flex items-start space-x-2.5">
        <AlertCircle className="h-4 w-4 flex-shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold block text-amber-950">
            Estimation and Decision-Support Disclaimer
          </strong>
          <p className="text-amber-800 leading-relaxed">
            SolOptimizer provides informational solar estimates based on homeowner inputs and regional irradiance assumptions.
            Results are not a certified engineering design, structural roof feasibility survey, binding installer quotation,
            or guaranteed utility billing reduction. Homeowners should obtain a qualified on-site survey before signing contracts.
          </p>
        </div>
      </div>
    </div>
  );
}
