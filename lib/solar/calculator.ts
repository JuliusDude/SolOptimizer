import {
  RoofOrientation,
  ShadingLevel,
  SolarAssumptions,
  SolarEstimateResult,
  SolarEstimatorInput,
  TwentyFiveYearProjectionYear,
} from "./types";
import { DEFAULT_SOLAR_ASSUMPTIONS } from "./assumptions";

// Indian monthly solar irradiance seasonal distribution weights (sums to 1.0)
const MONTHLY_WEIGHTS = [
  0.082, // Jan
  0.088, // Feb
  0.101, // Mar
  0.104, // Apr
  0.102, // May
  0.078, // Jun (monsoon onset)
  0.065, // Jul (monsoon peak)
  0.067, // Aug (monsoon)
  0.081, // Sep
  0.085, // Oct
  0.076, // Nov
  0.071, // Dec
];

export function calculateUsableRoofArea(
  totalAreaSqFt: number,
  usableFactor: number
): number {
  if (totalAreaSqFt <= 0) return 0;
  return Math.round(totalAreaSqFt * usableFactor * 100) / 100;
}

export function calculateSystemCapacityKW(
  usableRoofAreaSqFt: number,
  areaPerKWsqFt: number
): number {
  if (usableRoofAreaSqFt <= 0 || areaPerKWsqFt <= 0) return 0;
  // Rounded to 2 decimal places
  return Math.round((usableRoofAreaSqFt / areaPerKWsqFt) * 100) / 100;
}

export function calculateAnnualGenerationKWh(
  capacityKW: number,
  peakSunHoursPerDay: number,
  performanceFactor: number,
  orientationFactor: number,
  shadingFactor: number
): number {
  if (capacityKW <= 0) return 0;
  const rawGeneration =
    capacityKW *
    peakSunHoursPerDay *
    365 *
    performanceFactor *
    orientationFactor *
    shadingFactor;
  return Math.round(rawGeneration);
}

export function calculateMonthlyGenerationKWh(
  annualGenerationKWh: number
): number[] {
  return MONTHLY_WEIGHTS.map((weight) => Math.round(annualGenerationKWh * weight));
}

export function calculateSystemCostINR(
  capacityKW: number,
  costPerKW: number
): number {
  if (capacityKW <= 0 || costPerKW <= 0) return 0;
  return Math.round(capacityKW * costPerKW);
}

export function calculateAnnualSavingsINR(
  annualGenerationKWh: number,
  tariffINRPerKWh: number
): number {
  if (annualGenerationKWh <= 0 || tariffINRPerKWh <= 0) return 0;
  return Math.round(annualGenerationKWh * tariffINRPerKWh);
}

export function calculateSimplePaybackYears(
  systemCostINR: number,
  annualSavingsINR: number
): number | null {
  if (systemCostINR <= 0 || annualSavingsINR <= 0) return null;
  const years = systemCostINR / annualSavingsINR;
  return Math.round(years * 10) / 10; // 1 decimal place
}

export function calculateCO2AvoidedKg(
  annualGenerationKWh: number,
  co2Factor: number
): number {
  if (annualGenerationKWh <= 0) return 0;
  return Math.round(annualGenerationKWh * co2Factor);
}

export function calculateTwentyFiveYearProjection(
  systemCostINR: number,
  initialGenerationKWh: number,
  initialTariffINRPerKWh: number,
  assumptions: SolarAssumptions
): TwentyFiveYearProjectionYear[] {
  const projection: TwentyFiveYearProjectionYear[] = [];
  let cumulativeSavings = 0;

  for (let year = 1; year <= 25; year++) {
    // Panel degradation: generation decreases by degradation rate each year
    const degradationMultiplier = Math.pow(
      1 - assumptions.annualDegradationRate,
      year - 1
    );
    const yearlyGeneration = Math.round(initialGenerationKWh * degradationMultiplier);

    // Tariff escalation: grid tariff increases by escalation rate each year
    const tariffMultiplier = Math.pow(
      1 + assumptions.tariffEscalationRate,
      year - 1
    );
    const currentTariff = initialTariffINRPerKWh * tariffMultiplier;

    const yearlySavings = Math.round(yearlyGeneration * currentTariff);
    cumulativeSavings += yearlySavings;
    const netCashFlow = cumulativeSavings - systemCostINR;

    projection.push({
      year,
      generationKWh: yearlyGeneration,
      savingsINR: yearlySavings,
      cumulativeSavingsINR: cumulativeSavings,
      netCashFlowINR: netCashFlow,
    });
  }

  return projection;
}

export function calculateSolarEstimate(
  input: SolarEstimatorInput,
  customAssumptions?: Partial<SolarAssumptions>
): SolarEstimateResult {
  const assumptions: SolarAssumptions = {
    ...DEFAULT_SOLAR_ASSUMPTIONS,
    ...customAssumptions,
  };

  const orientation = input.roof.orientation as RoofOrientation;
  const shading = input.roof.shading as ShadingLevel;

  const orientationFactor =
    assumptions.orientationFactors[orientation] ?? 1.0;
  const shadingFactor =
    assumptions.shadingFactors[shading] ?? 1.0;

  const usableRoofAreaSqFt = calculateUsableRoofArea(
    input.roof.areaSqFt,
    assumptions.usableRoofFactor
  );
  const usableRoofAreaSqM = Math.round((usableRoofAreaSqFt / 10.7639) * 100) / 100;

  const estimatedCapacityKW = calculateSystemCapacityKW(
    usableRoofAreaSqFt,
    assumptions.areaPerKWsqFt
  );

  const annualGenerationKWh = calculateAnnualGenerationKWh(
    estimatedCapacityKW,
    assumptions.peakSunHoursPerDay,
    assumptions.systemPerformanceFactor,
    orientationFactor,
    shadingFactor
  );

  const monthlyGenerationKWh = calculateMonthlyGenerationKWh(annualGenerationKWh);

  const systemCostINR = calculateSystemCostINR(
    estimatedCapacityKW,
    input.system.costPerKW
  );

  const annualSavingsINR = calculateAnnualSavingsINR(
    annualGenerationKWh,
    input.electricity.tariffINRPerKWh
  );

  const paybackYears = calculateSimplePaybackYears(
    systemCostINR,
    annualSavingsINR
  );

  const annualCO2AvoidedKg = calculateCO2AvoidedKg(
    annualGenerationKWh,
    assumptions.co2KgPerKWh
  );

  const twentyFiveYearProjection = calculateTwentyFiveYearProjection(
    systemCostINR,
    annualGenerationKWh,
    input.electricity.tariffINRPerKWh,
    assumptions
  );

  return {
    usableRoofAreaSqFt,
    usableRoofAreaSqM,
    estimatedCapacityKW,
    annualGenerationKWh,
    monthlyGenerationKWh,
    systemCostINR,
    annualSavingsINR,
    paybackYears,
    annualCO2AvoidedKg,
    twentyFiveYearProjection,
    assumptionsUsed: assumptions,
    explanation: {
      usableAreaFormula: `Usable Area = ${input.roof.areaSqFt} sq ft × ${assumptions.usableRoofFactor} (usable factor) = ${usableRoofAreaSqFt} sq ft`,
      capacityFormula: `Capacity = ${usableRoofAreaSqFt} sq ft ÷ ${assumptions.areaPerKWsqFt} sq ft/kW = ${estimatedCapacityKW} kW`,
      generationFormula: `Generation = ${estimatedCapacityKW} kW × ${assumptions.peakSunHoursPerDay} PSH × 365 days × ${assumptions.systemPerformanceFactor} (PR) × ${orientationFactor} (Orientation) × ${shadingFactor} (Shading) = ${annualGenerationKWh} kWh/year`,
      savingsFormula: `Savings = ${annualGenerationKWh} kWh × ₹${input.electricity.tariffINRPerKWh}/kWh = ₹${annualSavingsINR.toLocaleString("en-IN")}/year`,
      paybackFormula: paybackYears !== null
        ? `Payback = ₹${systemCostINR.toLocaleString("en-IN")} (System Cost) ÷ ₹${annualSavingsINR.toLocaleString("en-IN")} (Annual Savings) = ${paybackYears} years`
        : "Payback not meaningful under these assumptions (annual savings are zero)",
      co2Formula: `CO₂ Avoided = ${annualGenerationKWh} kWh × ${assumptions.co2KgPerKWh} kg/kWh = ${annualCO2AvoidedKg.toLocaleString("en-IN")} kg/year`,
    },
  };
}
